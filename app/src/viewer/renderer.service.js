(function () {
    "use strict";
    angular.module("tm-viewer")
        .service("renderer", ['canvasUtils', renderer]);

    function renderer(canvasUtils) {

        var settings = {
            stiffness: 300.0,
            repulsion: 500.0,
            damping: 0.5,
            minEnergyThreshold: 0.00001,
            maxSelectionDistance: 2
        };

        var canvas, ctx, layout, currentBB, targetBB, renderer, callbacks;

        var state = {
            graph: null,
            ready: false,
            selected: null,
            nearest: null,
            dragged: null
        };

        /************************************ UI Handlers *************************/

        function mousedown(e) {

            let pos = {
                top: e.target.offsetTop,
                left: e.target.offsetLeft
            };

            var p = fromScreen({
                x: e.pageX - pos.left,
                y: e.pageY - pos.top
            });
            
            state.nearest = layout.nearest(p);

            if (state.nearest.distance > settings.maxSelectionDistance) {
                if (state.selected) {
                    state.selected = null;
                }

                return;
            }

            state.selected = state.dragged = state.nearest;

            if (state.selected.node !== null) {
                state.dragged.point.m = 10000.0;
                callbacks.nodeSelected(state.selected.node.data.treeNode)
            }
        }

        function mouseup(e) {
            state.dragged = null;
        }

        function mousemove(e) {

            let pos = {
                top: e.target.offsetTop,
                left: e.target.offsetLeft
            };

            var p = fromScreen({
                x: e.pageX - pos.left,
                y: e.pageY - pos.top
            });
            state.nearest = layout.nearest(p);

            if (state.dragged !== null && state.dragged.node !== null) {
                state.dragged.point.p.x = p.x;
                state.dragged.point.p.y = p.y;
            }

            // renderer.start();
        }

        function doubleClick(e) {

            let pos = {
                top: e.target.offsetTop,
                left: e.target.offsetLeft
            };

            var p = fromScreen({
                x: e.pageX - pos.left,
                y: e.pageY - pos.top
            });
            state.selected = layout.nearest(p);

            var node = state.selected.node;

            if (node && node.data && node.data.ondoubleclick) {
                callbacks.nodeDoubleClicked(state.selected.node.data.treeNode)
            }
        }

        /************************************ DRAWING FUNCTIONS *******************/

        function drawEdge(edge, p1, p2) {
            var x1 = toScreen(p1).x;
            var y1 = toScreen(p1).y;
            var x2 = toScreen(p2).x;
            var y2 = toScreen(p2).y;

            var direction = new Springy.Vector(x2 - x1, y2 - y1);
            var normal = direction.normal().normalise();

            var from = state.graph.getEdges(edge.source, edge.target);
            var to = state.graph.getEdges(edge.target, edge.source);

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

            // var intersection = intersect_line_box(s1, s2, {
            //     x: x2 - settings.nodes.radius,
            //     y: y2 - settings.nodes.radius
            // }, diameter, diameter);
            //
            // if (!intersection) {
            //     intersection = s2;
            // }

            canvasUtils.drawLine(ctx, s1, s2, settings);
        }

        function drawNode(node, p) {

            var treeNode = node.data.treeNode;

            var s = toScreen(p);

            // ctx.save();

            var isSelected = (state.selected !== null && state.selected.node !== null && state.selected.node.id === node.id);

            if (treeNode.status !== 'complete') {
                treeNode.status = 'incomplete';
            }

            var variant = isSelected ? 'selected' : 'default';

            ctx.fillStyle = settings.colours.nodes[treeNode.status][variant];
            ctx.strokeStyle = settings.colours.nodes[treeNode.status].border;

            var adjustedRadius = settings.nodes.radius + ((treeNode.importance || 1) * 2);

            // fill background
            if (isSelected) {
                adjustedRadius *= 1.2;
            }

            // canvasUtils.clearCircle(ctx, s, adjustedRadius, settings);
            canvasUtils.drawCircle(ctx, s, adjustedRadius, settings);

            canvasUtils.drawWrappedText(ctx, node.data.label, s, adjustedRadius, settings);

            // ctx.restore();
        }

        // convert to/from screen coordinates
        function toScreen(p) {
            var size = currentBB.topright.subtract(currentBB.bottomleft);
            var sx = p.subtract(currentBB.bottomleft).divide(size.x).x * canvas.width;
            var sy = p.subtract(currentBB.bottomleft).divide(size.y).y * canvas.height;
            return new Springy.Vector(sx, sy);
        }

        function fromScreen(s) {
            var size = currentBB.topright.subtract(currentBB.bottomleft);
            var px = (s.x / canvas.width) * size.x + currentBB.bottomleft.x;
            var py = (s.y / canvas.height) * size.y + currentBB.bottomleft.y;
            return new Springy.Vector(px, py);
        }

        // helpers for figuring out where to draw arrows
        // function intersect_line_line(p1, p2, p3, p4) {
        //     var denom = ((p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y));
        //
        //     // lines are parallel
        //     if (denom === 0) {
        //         return false;
        //     }
        //
        //     var ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
        //     var ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
        //
        //     if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        //         return false;
        //     }
        //
        //     return new Springy.Vector(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
        // }

        // function intersect_line_box(p1, p2, p3, w, h) {
        //     var tl = {
        //         x: p3.x,
        //         y: p3.y
        //     };
        //     var tr = {
        //         x: p3.x + w,
        //         y: p3.y
        //     };
        //     var bl = {
        //         x: p3.x,
        //         y: p3.y + h
        //     };
        //     var br = {
        //         x: p3.x + w,
        //         y: p3.y + h
        //     };
        //
        //     var result;
        //
        //
        //     result = intersect_line_line(p1, p2, tl, tr);
        //     if (result) {
        //         return result;
        //     } // top
        //
        //     result = intersect_line_line(p1, p2, tr, br);
        //     if (result) {
        //         return result;
        //     } // right
        //
        //     result = intersect_line_line(p1, p2, br, bl);
        //     if (result) {
        //         return result;
        //     } // bottom
        //
        //     result = intersect_line_line(p1, p2, bl, tl);
        //     if (result) {
        //         return result;
        //     } // left
        //
        //     return false;
        // }

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
            start: function startRendering(data) {
                canvas = data.canvas[0];
                state.graph = data.graph;

                callbacks = data.callbacks;

                angular.extend(settings, data.project.settings);

                state.ready = true;

                ctx = canvas.getContext("2d");

                layout = new Springy.Layout.ForceDirected(state.graph, settings.stiffness, settings.repulsion, settings.damping, settings.minEnergyThreshold);

                // calculate bounding box of graph layout.. with ease-in
                currentBB = layout.getBoundingBox();

                targetBB = {
                    bottomleft: new Springy.Vector(-2, -2),
                    topright: new Springy.Vector(2, 2)
                };

                // auto adjusting bounding box
                Springy.requestAnimationFrame(adjust);

                renderer = new Springy.Renderer(layout,
                    function clear() {
                        canvasUtils.clear(ctx, canvas)
                    }, drawEdge, drawNode);

                renderer.start();
            },
            stop: function stopRendering() {
                state.ready = false;
                if (renderer) {
                    renderer.stop();
                }
            },
            handlers: {
                mousedown: mousedown,
                mousemove: mousemove,
                mouseup: mouseup,
                dblclick: doubleClick
            }
        };
    }

})();





