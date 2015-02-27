dmf.createModule('renderer', function(c) {
    'use strict';

    var properties = {
        id: 'renderer',
        selector: 'viewer',
        listeners: {
            'graph-ready': startRendering,
            'graph-unready': stopRendering,

        }
    };

    var elements = {};
    var graph;

    var stiffness = 300.0;
    var repulsion = 500.0;
    var damping = 0.5;
    var minEnergyThreshold = 0.00001;

    var settings = {
        font: {
            size: 12,
            face: "Open-sans, Verdana, sans-serif"
        },
        colours: {
            font: "#000000",
            emptyNode: "#E6E9F7",
            selectedNode: "#FFFFE0",
            brokenNode: "#FFFFFF",
            edge: '#1abc9c',
            nodes: {
                incomplete: {
                    default: '#3498db',
                    selected: '#2980b9',
                },
                complete: {
                    default: '#2ecc71',
                    selected: '#27ae60',
                }
            }
        },
        nodes: {
            radius: 40,
            borderWidth: 3
        },
        edges: {
            width: 2
        }

    };

    var ctx, layout, currentBB, targetBB, renderer;

    var state = {
        ready: false
    };

    // half-assed drag and drop
    var selected = null;
    var nearest = null;
    var dragged = null;

    function initialize(scope) {
        elements.canvas = document.getElementById('viewer');
    }

    function destroy() {
        elements = {};
        unbindEvents();
    }

    function bindEvents() {
        $(elements.canvas).on('mousedown', mousedown);
        // $(elements.canvas).on('dblclick', doubleClick);
        $(elements.canvas).on('mouseup', mouseup);
        $(elements.canvas).on('mousemove', mousemove);
        $(elements.canvas).on('node-clicked', nodeClicked);
    }

    function unbindEvents() {
        $(elements.canvas).off('mousedown', mousedown);
        // $(elements.canvas).off('dblclick', doubleClick);
        $(elements.canvas).off('mouseup', mouseup);
        $(elements.canvas).off('mousemove', mousemove);
        $(elements.canvas).off('node-clicked', nodeClicked);
    }

    /******************************* Framework Listeners **********************/

    function startRendering(data) {
        unbindEvents();
        bindEvents();
        state.ready = true;

        graph = data.graph;
        ctx = elements.canvas.getContext("2d");
        layout = new Springy.Layout.ForceDirected(graph, stiffness, repulsion, damping, minEnergyThreshold);

        // calculate bounding box of graph layout.. with ease-in
        currentBB = layout.getBoundingBox();

        targetBB = {
            bottomleft: new Springy.Vector(-2, -2),
            topright: new Springy.Vector(2, 2)
        };

        // auto adjusting bounding box
        Springy.requestAnimationFrame(adjust);

        renderer = new Springy.Renderer(layout, clear,
            drawEdge,
            drawNode);

        renderer.start();
    }

    function stopRendering() {
        state.ready = false;
        if (renderer) {
            renderer.stop();
        }
    }

    /************************************ UI Handlers *************************/

    function mousedown(e) {
        var pos = jQuery(e.target).offset();
        var p = fromScreen({
            x: e.pageX - pos.left,
            y: e.pageY - pos.top
        });
        selected = nearest = dragged = layout.nearest(p);

        if (selected.node !== null) {
            dragged.point.m = 10000.0;
            // dragged = null; // no dragging

            console.log('springy node selected', selected.node);

            c.notify({
                type: 'node-selected',
                data: selected.node.data.treeNode
            });

        }

        renderer.start();
    }

    function mouseup(e) {
        dragged = null;
    }

    function mousemove(e) {
        var pos = jQuery(e.target).offset();

        var p = fromScreen({
            x: e.pageX - pos.left,
            y: e.pageY - pos.top
        });
        nearest = layout.nearest(p);

        if (dragged !== null && dragged.node !== null) {
            dragged.point.p.x = p.x;
            dragged.point.p.y = p.y;
        }

        renderer.start();
    }

    // function doubleClick(e) {
    //     var pos = jQuery(event.target).offset();

    //     var p = fromScreen({
    //         x: e.pageX - pos.left,
    //         y: e.pageY - pos.top
    //     });
    //     selected = layout.nearest(p);

    //     var node = selected.node;

    //     if (node && node.data && node.data.ondoubleclick) {
    //         node.data.ondoubleclick();
    //     }
    // }

    /**
     * Used to simiulate a click on a node using a trigger jquery event
     * @param  {[type]} e    [description]
     * @param  {[type]} node [description]
     * @return {[type]}      [description]
     */
    function nodeClicked(e, node) {
        selected = {
            node: node
        };

        c.notify({
            type: 'node-selected',
            data: selected.node.data.treeNode
        });
    }

    /************************************ DRAWING FUNCTIONS *******************/

    function drawEdge(edge, p1, p2) {
        var x1 = toScreen(p1).x;
        var y1 = toScreen(p1).y;
        var x2 = toScreen(p2).x;
        var y2 = toScreen(p2).y;

        var direction = new Springy.Vector(x2 - x1, y2 - y1);
        var normal = direction.normal().normalise();

        var from = graph.getEdges(edge.source, edge.target);
        var to = graph.getEdges(edge.target, edge.source);

        var total = from.length + to.length;

        // Figure out edge's position in relation to other edges between the same nodes
        var n = 0;
        for (var i = 0; i < from.length; i++) {
            if (from[i].id === edge.id) {
                n = i;
            }
        }

        //change default to  10.0 to allow text fit between edges
        var spacing = 12.0;

        // Figure out how far off center the line should be drawn
        var offset = normal.multiply(-((total - 1) * spacing) / 2.0 + (n * spacing));

        var s1 = toScreen(p1).add(offset);
        var s2 = toScreen(p2).add(offset);

        var diameter = settings.nodes.radius * 2;

        var intersection = intersect_line_box(s1, s2, {
            x: x2 - settings.nodes.radius,
            y: y2 - settings.nodes.radius
        }, diameter, diameter);

        if (!intersection) {
            intersection = s2;
        }

        ctx.lineWidth = Math.max(settings.edges.width, 0.1);

        // line
        var lineEnd = s2;

        ctx.strokeStyle = settings.colours.edge;
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(lineEnd.x, lineEnd.y);
        ctx.stroke();
    }

    function drawNode(node, p) {
        var treeNode = node.data.treeNode;

        var s = toScreen(p);

        ctx.save();

        var isSelected = (selected !== null && selected.node !== null && selected.node.id === node.id);

        if (treeNode.data.status !== 'complete') {
            treeNode.data.status = 'incomplete';
        }

        var variant = isSelected ? 'selected' : 'default';

        ctx.fillStyle = settings.colours.nodes[treeNode.data.status][variant];

        var adjustedRadius = settings.nodes.radius + ((treeNode.data.importance || 1) * 2);

        // fill background
        if (isSelected) {
            adjustedRadius *= 1.2;
        }

        clearCircle(s.x, s.y, adjustedRadius, settings.nodes.borderWidth);
        drawCircle(s.x, s.y, adjustedRadius, settings.nodes.borderWidth);

        var fontSize = settings.font.size + "px "; // + ((treeNode.data.importance || 1) * 1) + "px ";

        ctx.textAlign = "center";
        // ctx.textBaseline = "middle";
        ctx.font = fontSize + settings.font.face;
        ctx.fillStyle = settings.colours.font;
        var text = node.data.label;

        drawWrappedText(text, s.x, s.y - settings.font.size, adjustedRadius * 2);

        ctx.restore();
    }

    function clearCircle(x, y, radius, borderWidth) {
        ctx.beginPath();
        ctx.arc(x, y, radius + borderWidth, 0, 2 * Math.PI);
        ctx.clip();
        ctx.clearRect(x - radius - 1, y - radius - 1,
            radius * 2 + 2, radius * 2 + 2);
    }

    function drawCircle(x, y, radius, borderWidth) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fill();

        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = '#5D5D5D';
        ctx.stroke();
    }

    function drawWrappedText(text, x, y, maxWidth) {
        var words = text.split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = ctx.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line, x, y);
                line = words[n] + ' ';
                y += settings.font.size;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    /************************************ GENERAL FUNCTIONS *******************/

    function clear() {
        ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
    }



    // convert to/from screen coordinates
    function toScreen(p) {
        var size = currentBB.topright.subtract(currentBB.bottomleft);
        var sx = p.subtract(currentBB.bottomleft).divide(size.x).x * elements.canvas.width;
        var sy = p.subtract(currentBB.bottomleft).divide(size.y).y * elements.canvas.height;
        return new Springy.Vector(sx, sy);
    }

    function fromScreen(s) {
        var size = currentBB.topright.subtract(currentBB.bottomleft);
        var px = (s.x / elements.canvas.width) * size.x + currentBB.bottomleft.x;
        var py = (s.y / elements.canvas.height) * size.y + currentBB.bottomleft.y;
        return new Springy.Vector(px, py);
    }

    function changeSelected(node) {
        console.log(selected);
    }


    // helpers for figuring out where to draw arrows
    function intersect_line_line(p1, p2, p3, p4) {
        var denom = ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y));

        // lines are parallel
        if (denom === 0) {
            return false;
        }

        var ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
        var ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

        if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
            return false;
        }

        return new Springy.Vector(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
    }

    function intersect_line_box(p1, p2, p3, w, h) {
        var tl = {
            x: p3.x,
            y: p3.y
        };
        var tr = {
            x: p3.x + w,
            y: p3.y
        };
        var bl = {
            x: p3.x,
            y: p3.y + h
        };
        var br = {
            x: p3.x + w,
            y: p3.y + h
        };

        var result;


        result = intersect_line_line(p1, p2, tl, tr);
        if (result) {
            return result;
        } // top

        result = intersect_line_line(p1, p2, tr, br);
        if (result) {
            return result;
        } // right

        result = intersect_line_line(p1, p2, br, bl);
        if (result) {
            return result;
        } // bottom

        result = intersect_line_line(p1, p2, bl, tl);
        if (result) {
            return result;
        } // left

        return false;
    }

    function adjust() {
        if (!state.ready) {
            return;
        }

        targetBB = layout.getBoundingBox();
        // current gets 20% closer to target every iteration
        currentBB = {
            bottomleft: currentBB.bottomleft.add(targetBB.bottomleft.subtract(currentBB.bottomleft)
                .divide(10)),
            topright: currentBB.topright.add(targetBB.topright.subtract(currentBB.topright)
                .divide(10))
        };

        Springy.requestAnimationFrame(adjust);
    }

    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
