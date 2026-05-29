import { useEffect, useRef } from 'react'
import { useDrag } from '../hooks/useDrag.js'

const HANDLE = 10 // px (side of a square corner handle)
const ROTATE_OFFSET = 30 // px the rotation handle sits above the box top
const MIN_SIZE = 12

// Local corner offsets relative to the box center, and each corner's opposite.
const CORNERS = {
  nw: [-0.5, -0.5],
  ne: [0.5, -0.5],
  se: [0.5, 0.5],
  sw: [-0.5, 0.5],
}
const OPPOSITE = { nw: 'se', ne: 'sw', se: 'nw', sw: 'ne' }
const CORNER_CURSOR = { nw: 'nwse-resize', ne: 'nesw-resize', se: 'nwse-resize', sw: 'nesw-resize' }

/**
 * Resize a rotated box by dragging one corner while pinning the opposite
 * corner in place. Works for any rotation: the new center is the midpoint of
 * the two opposite corners, and the new size is the drag diagonal measured in
 * the box's own (un-rotated) frame.
 */
function computeResize(shape, corner, dx, dy) {
  const { x, y, width, height, rotation } = shape
  const rad = (rotation * Math.PI) / 180
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)
  const cx = x + width / 2
  const cy = y + height / 2

  // Map a local (fractional) offset to a world point.
  const toWorld = ([fx, fy]) => {
    const ox = fx * width
    const oy = fy * height
    return [cx + ox * cos - oy * sin, cy + ox * sin + oy * cos]
  }

  const fixed = toWorld(CORNERS[OPPOSITE[corner]])
  const dragged = toWorld(CORNERS[corner])
  const moved = [dragged[0] + dx, dragged[1] + dy]

  const ncx = (fixed[0] + moved[0]) / 2
  const ncy = (fixed[1] + moved[1]) / 2

  // Diagonal vector rotated back into the box's local frame -> new w/h.
  const ddx = moved[0] - fixed[0]
  const ddy = moved[1] - fixed[1]
  const localW = Math.abs(ddx * cos + ddy * sin)
  const localH = Math.abs(-ddx * sin + ddy * cos)

  const w = Math.max(localW, MIN_SIZE)
  const h = Math.max(localH, MIN_SIZE)

  return { x: ncx - w / 2, y: ncy - h / 2, width: w, height: h }
}

export default function SelectionHandles({ shape, updateShape, toSvgPoint }) {
  // Snapshot of the shape at gesture start, plus which corner is active.
  const gesture = useRef(null)
  const shapeRef = useRef(shape)
  useEffect(() => {
    shapeRef.current = shape
  }, [shape])

  const onResizeDown = useDrag({
    onStart: (e) => {
      gesture.current = {
        corner: e.currentTarget.dataset.corner,
        shape: { ...shapeRef.current },
      }
    },
    onMove: ({ dx, dy }) => {
      const { corner, shape: start } = gesture.current
      updateShape(start.id, computeResize(start, corner, dx, dy))
    },
  })

  const onRotateDown = useDrag({
    onMove: ({ clientX, clientY }) => {
      const s = shapeRef.current
      const cx = s.x + s.width / 2
      const cy = s.y + s.height / 2
      const p = toSvgPoint(clientX, clientY)
      // Handle points "up" at rotation 0, so add 90deg to align.
      const angle = (Math.atan2(p.y - cy, p.x - cx) * 180) / Math.PI + 90
      updateShape(s.id, { rotation: Math.round(angle) })
    },
  })

  const { x, y, width, height, rotation } = shape
  const cx = x + width / 2
  const cy = y + height / 2
  const rotateX = cx
  const rotateY = y - ROTATE_OFFSET

  return (
    // The whole overlay rotates with the shape; drag math handles screen-space.
    <g transform={`rotate(${rotation} ${cx} ${cy})`} style={{ pointerEvents: 'none' }}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="none"
        stroke="#1b9aff"
        strokeWidth="1.5"
        strokeDasharray="5 4"
      />

      {/* Rotation handle */}
      <line x1={cx} y1={y} x2={rotateX} y2={rotateY} stroke="#1b9aff" strokeWidth="1.5" />
      <circle
        cx={rotateX}
        cy={rotateY}
        r={6}
        fill="#fff"
        stroke="#1b9aff"
        strokeWidth="1.5"
        onPointerDown={onRotateDown}
        style={{ cursor: 'grab', pointerEvents: 'all' }}
      />

      {/* Corner resize handles */}
      {Object.entries(CORNERS).map(([corner, [fx, fy]]) => (
        <rect
          key={corner}
          data-corner={corner}
          x={cx + fx * width - HANDLE / 2}
          y={cy + fy * height - HANDLE / 2}
          width={HANDLE}
          height={HANDLE}
          fill="#fff"
          stroke="#1b9aff"
          strokeWidth="1.5"
          onPointerDown={onResizeDown}
          style={{ cursor: CORNER_CURSOR[corner], pointerEvents: 'all' }}
        />
      ))}
    </g>
  )
}
