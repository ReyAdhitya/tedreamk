/**
 * Renders a single shape as an SVG element, rotated about its center.
 * `onPointerDown` starts a move-drag (wired in Canvas); `data-id` lets that
 * handler discover which shape was grabbed.
 */
export default function ShapeRenderer({ shape, onPointerDown }) {
  const { id, type, x, y, width, height, fill, rotation } = shape
  const cx = x + width / 2
  const cy = y + height / 2

  const common = {
    fill,
    transform: `rotate(${rotation} ${cx} ${cy})`,
    'data-id': id,
    onPointerDown,
    style: { cursor: 'move' },
  }

  switch (type) {
    case 'rectangle':
      return <rect x={x} y={y} width={width} height={height} {...common} />

    case 'circle':
      // Rendered as an ellipse so it can be resized non-uniformly.
      return <ellipse cx={cx} cy={cy} rx={width / 2} ry={height / 2} {...common} />

    case 'triangle': {
      const points = `${x + width / 2},${y} ${x + width},${y + height} ${x},${y + height}`
      return <polygon points={points} {...common} />
    }

    default:
      return null
  }
}
