import { useCallback, useEffect, useRef } from 'react'
import ShapeRenderer from './ShapeRenderer.jsx'
import SelectionHandles from './SelectionHandles.jsx'
import { useDrag } from '../hooks/useDrag.js'

export default function Canvas({
  shapes,
  selectedId,
  selectedShape,
  selectShape,
  updateShape,
}) {
  const svgRef = useRef(null)

  // Latest shapes, so the (stable) move handler always reads current values.
  const shapesRef = useRef(shapes)
  useEffect(() => {
    shapesRef.current = shapes
  }, [shapes])

  // Active move gesture: which shape and its starting position.
  const move = useRef(null)

  // Convert client coords -> SVG user space (1:1, no viewBox scaling).
  const toSvgPoint = useCallback((clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top }
  }, [])

  const onShapeDown = useDrag({
    onStart: (e) => {
      const id = e.currentTarget.dataset.id
      selectShape(id)
      const shape = shapesRef.current.find((s) => s.id === id)
      move.current = { id, x: shape.x, y: shape.y }
    },
    onMove: ({ dx, dy }) => {
      const { id, x, y } = move.current
      updateShape(id, { x: x + dx, y: y + dy })
    },
  })

  // Clicking empty canvas clears the selection. Shape/handle pointerdowns
  // stop propagation (via useDrag), so this only fires on the background.
  const onCanvasDown = (e) => {
    if (e.target === svgRef.current) selectShape(null)
  }

  return (
    <svg
      ref={svgRef}
      className="canvas"
      onPointerDown={onCanvasDown}
    >
      {shapes.map((shape) => (
        <ShapeRenderer key={shape.id} shape={shape} onPointerDown={onShapeDown} />
      ))}

      {selectedShape && (
        <SelectionHandles
          key={selectedId}
          shape={selectedShape}
          updateShape={updateShape}
          toSvgPoint={toSvgPoint}
        />
      )}
    </svg>
  )
}
