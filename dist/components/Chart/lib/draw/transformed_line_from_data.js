import drawLine from './line';
export default function (canvas, color, transformer, {
  yData,
  xData,
  ySize,
  xSize,
  yOffset = 0,
  xOffset = 0
}) {
  const points = [];

  for (let i = 0; i < xData.length; i += 1) {
    points.push({
      y: yOffset - transformer.y(yData[i], ySize),
      x: transformer.x(xData[i], xSize) + xOffset
    });
  }

  drawLine(canvas, color, points);
}