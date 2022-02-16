// from: https://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-using-html-canvas
// export const roundRect =
//   (x: number, y: number, w: number, h: number, r: number) =>
//   (ctx: CanvasRenderingContext2D) => {
//     if (w < 2 * r) r = w / 2
//     if (h < 2 * r) r = h / 2

//     ctx.beginPath()
//     ctx.moveTo(x + r, y)
//     ctx.arcTo(x + w, y, x + w, y + h, r)
//     ctx.arcTo(x + w, y + h, x, y + h, r)
//     ctx.arcTo(x, y + h, x, y, r)
//     ctx.arcTo(x, y, x + w, y, r)
//     ctx.closePath()
//     ctx.fill()
//     return ctx
//   }

type Radius = { tl: number; tr: number; br: number; bl: number }
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius.
 * @see https://stackoverflow.com/a/3368118
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | Radius = 5,
  fill: boolean = false,
  stroke: boolean = true
) {
  let innerRadius: Radius = { bl: 0, br: 0, tl: 0, tr: 0 }
  if (typeof radius === 'number') {
    innerRadius = { tl: radius, tr: radius, br: radius, bl: radius }
  } else {
    const defaultRadius = { tl: 0, tr: 0, br: 0, bl: 0 }
    for (let side in defaultRadius) {
      ;(innerRadius as any)[side] = ((radius as any)[side] ||
        (defaultRadius as any)[side]) as number
    }
  }
  ctx.beginPath()
  ctx.moveTo(x + innerRadius.tl, y)
  ctx.lineTo(x + width - innerRadius.tr, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + innerRadius.tr)
  ctx.lineTo(x + width, y + height - innerRadius.br)
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - innerRadius.br,
    y + height
  )
  ctx.lineTo(x + innerRadius.bl, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - innerRadius.bl)
  ctx.lineTo(x, y + innerRadius.tl)
  ctx.quadraticCurveTo(x, y, x + innerRadius.tl, y)
  ctx.closePath()
  if (fill) {
    ctx.fill()
  }
  if (stroke) {
    ctx.stroke()
  }
}

export function drawTextBG(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  bgHeight: number,
  horizontalMargins: number,
  x: number,
  y: number,
  fgColor: string,
  bgColor: string,
  drawRect: (x: number, y: number, width: number, height: number) => void
) {
  /// set font
  ctx.font = font

  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = bgColor

  const { width } = ctx.measureText(text)
  drawRect(x, y, width + horizontalMargins * 2, bgHeight)
  ctx.fillStyle = fgColor
  ctx.fillText(text, x + horizontalMargins, y + bgHeight / 2)
}
