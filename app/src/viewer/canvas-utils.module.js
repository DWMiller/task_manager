(function () {
    "use strict";
    angular.module("tm-canvas-utils", [])
        .service("canvasUtils", canvasUtils);

    function canvasUtils() {
        return {
            clear:function(ctx, canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },
            drawLine: function (ctx, start, end, settings) {

                ctx.lineWidth = Math.max(settings.edges.width, 0.1);

                ctx.strokeStyle = settings.colours.edge;
                ctx.beginPath();
                ctx.moveTo(start.x, start.y);
                ctx.lineTo(end.x, end.y);
                ctx.stroke();
            },
            drawCircle: function (ctx, point, radius, settings) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, radius, 0, 2 * Math.PI);
                ctx.fill();

                ctx.lineWidth = settings.nodes.borderWidth;

                ctx.stroke();
            },
            clearCircle: function (ctx, point, radius, settings) {
                ctx.beginPath();
                ctx.arc(point.x, point.y, radius + settings.nodes.borderWidth, 0, 2 * Math.PI);
                ctx.clip();
                ctx.clearRect(point.x - radius - 1, point.y - radius - 1,
                    radius * 2 + 2, radius * 2 + 2);
            },
            drawWrappedText: function (ctx, text, point, maxWidth, settings) {
                maxWidth *= 2;
                point.y -= settings.font.size;

                var fontSize = settings.font.size + "px "; // + ((treeNode.data.importance || 1) * 1) + "px ";

                ctx.textAlign = "center";
                // ctx.textBaseline = "middle";
                ctx.font = fontSize + settings.font.face;
                ctx.fillStyle = settings.colours.font;
                
                var words = text.split(' ');
                var line = '';

                for (var n = 0; n < words.length; n++) {
                    var testLine = line + words[n] + ' ';
                    var metrics = ctx.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > maxWidth && n > 0) {
                        ctx.fillText(line, point.x, point.y);
                        line = words[n] + ' ';
                        point.y += settings.font.size;
                    } else {
                        line = testLine;
                    }
                }
                ctx.fillText(line, point.x, point.y);
            }
        }
    }

})();




