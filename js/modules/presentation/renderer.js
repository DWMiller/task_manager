dmf.createModule('renderer', function(c) {
    'use strict';

    var properties = {
        id: 'renderer',
        selector: 'viewer',
        listeners: {
            'graph-ready': render
        }
    };

    var elements = {};
    var graph;

    var stiffness = 600.0;
    var repulsion = 400.0;
    var damping = 0.5;
    var minEnergyThreshold = 0.00001;
    var selectedNodeHandler = null;

    var settings = {
        font: {
            size: 16,
            face: "Open-sans, Verdana, sans-serif"
        },
        colours: {
            font: "#FFFFFF",
            emptyNode: "#E6E9F7",
            selectedNode: "#FFFFE0",
            brokenNode: "#FFFFFF",
            edge: '#000000',
            nodes: {
                incomplete: {
                    default: '#2980b9',
                    selected: '#3498db',
                },
                complete: {
                    default: '#27ae60',
                    selected: '#2ecc71',
                }
            }
        }
    };

    var ctx, layout, currentBB, targetBB, renderer;

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
        // $(elements.canvas).on('node-selected', nodeSelected);
        $(elements.canvas).on('dblclick', doubleClick);
        $(elements.canvas).on('mouseup', mouseup);
        $(elements.canvas).on('mousemove', mousemove);
    }

    function unbindEvents() {
        // $(elements.canvas).off('node-selected', nodeSelected);
        $(elements.canvas).off('mousedown', mousedown);
        $(elements.canvas).off('dblclick', doubleClick);
        $(elements.canvas).off('mouseup', mouseup);
        $(elements.canvas).off('mousemove', mousemove);
    }

    /******************************* Framework Listeners **********************/

    function render(data) {
        selectedNodeHandler = data.nodeSelected;

        unbindEvents();
        bindEvents();

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
        Springy.requestAnimationFrame(function adjust() {
            targetBB = layout.getBoundingBox();
            // current gets 20% closer to target every iteration
            currentBB = {
                bottomleft: currentBB.bottomleft.add(targetBB.bottomleft.subtract(currentBB.bottomleft)
                    .divide(10)),
                topright: currentBB.topright.add(targetBB.topright.subtract(currentBB.topright)
                    .divide(10))
            };

            Springy.requestAnimationFrame(adjust);
        });

        Springy.Node.prototype.getHeight = function() {
            var node = this;
            var treeNode = node.data.treeNode;
            return settings.font.size + ((treeNode.data.importance || 1) * 1);
            // In a more modular world, this would actually read the font size, but I think leaving it a constant is sufficient for now.
            // If you change the font size, I'd adjust this too.            
        };

        Springy.Node.prototype.getWidth = function() {
            var node = this;
            var text = (node.data.label !== undefined) ? node.data.label : node.id;
            if (node._width && node._width[text])
                return node._width[text];

            ctx.save();

            var treeNode = node.data.treeNode;
            var fontSize = settings.font.size + ((treeNode.data.importance || 1) * 1) + "px ";

            ctx.font = fontSize + settings.font.face;
            var width = ctx.measureText(text).width;
            ctx.restore();

            if (!node._width) {
                node._width = {};
            }

            node._width[text] = width;

            return width;
        };

        renderer = new Springy.Renderer(layout,
            function clear() {
                ctx.clearRect(0, 0, elements.canvas.width, elements.canvas.height);
            },
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

                var paddingX = 6;
                var paddingY = 6;

                var s1 = toScreen(p1).add(offset);
                var s2 = toScreen(p2).add(offset);

                var boxWidth = edge.target.getWidth() + paddingX;
                var boxHeight = edge.target.getHeight() + paddingY;

                var intersection = intersect_line_box(s1, s2, {
                    x: x2 - boxWidth / 2.0,
                    y: y2 - boxHeight / 2.0
                }, boxWidth, boxHeight);

                if (!intersection) {
                    intersection = s2;
                }

                var stroke = (edge.data.color !== undefined) ? edge.data.color : '#000000';

                var weight = (edge.data.weight !== undefined) ? edge.data.weight : 1.0;

                ctx.lineWidth = Math.max(weight * 2, 0.1);

                // line
                var lineEnd = s2;

                ctx.strokeStyle = stroke;
                ctx.beginPath();
                ctx.moveTo(s1.x, s1.y);
                ctx.lineTo(lineEnd.x, lineEnd.y);
                ctx.stroke();

            },
            function drawNode(node, p) {
                var treeNode = node.data.treeNode;

                var s = toScreen(p);

                ctx.save();

                // Pulled out the padding aspect sso that the size functions could be used in multiple places
                // These should probably be settable by the user (and scoped higher) but this suffices for now
                var paddingX = 12;
                var paddingY = 12;

                var contentWidth = node.getWidth();
                var contentHeight = node.getHeight();
                var boxWidth = contentWidth + paddingX;
                var boxHeight = contentHeight + paddingY;
                var fontSize = settings.font.size + ((treeNode.data.importance || 1) * 1) + "px ";
                // console.log(fontSize);
                // clear background
                ctx.clearRect(s.x - boxWidth / 2, s.y - boxHeight / 2, boxWidth, boxHeight);



                var isSelected = (selected !== null && selected.node !== null && selected.node.id === node.id);

                var nodeStatus = treeNode.data.status || 'incomplete';
                var variant = isSelected ? 'selected' : 'default';

                ctx.fillStyle = settings.colours.nodes[nodeStatus][variant];

                boxHeight += ((treeNode.data.importance || 1) * 1);

                // fill background
                if (isSelected) {
                    boxHeight *= 1.25;
                    boxWidth *= 1.25;
                }

                // } else if (nearest !== null && nearest.node !== null && nearest.node.id === node.id) {
                //     ctx.fillStyle = settings.colours.emptyNode;

                ctx.fillRect(s.x - boxWidth / 2, s.y - boxHeight / 2, boxWidth, boxHeight);

                ctx.textAlign = "left";
                ctx.textBaseline = "top";
                ctx.font = fontSize + settings.font.face;
                ctx.fillStyle = settings.colours.edge;
                var text = node.data.label;

                ctx.fillText(text, s.x - contentWidth / 2, s.y - contentHeight / 2);

                ctx.restore();
            }
        );

        renderer.start();

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
    }

    /************************************ UI Handlers ************************************/

    function mousedown(e) {
        var pos = jQuery(event.target).offset();
        var p = fromScreen({
            x: e.pageX - pos.left,
            y: e.pageY - pos.top
        });
        selected = nearest = dragged = layout.nearest(p);

        if (selected.node !== null) {
            dragged.point.m = 10000.0;
            dragged = null; // no dragging
            nodeSelected(selected.node);
        }

        renderer.start();
    }

    function mouseup(e) {
        dragged = null;
    }

    function mousemove(e) {
        var pos = jQuery(event.target).offset();
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

    function doubleClick(e) {
        var pos = jQuery(event.target).offset();
        var p = fromScreen({
            x: e.pageX - pos.left,
            y: e.pageY - pos.top
        });
        selected = layout.nearest(p);
        node = selected.node;
        if (node && node.data && node.data.ondoubleclick) {
            node.data.ondoubleclick();
        }
    }

    function nodeSelected(node) {
        selected = {
            node: node
        };

        c.notify({
            type: 'node-selected',
            data: node.data.treeNode
        });
    }

    /************************************ GENERAL FUNCTIONS ************************************/

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



    return {
        properties: properties,
        initialize: initialize,
        destroy: destroy,
    };

});
