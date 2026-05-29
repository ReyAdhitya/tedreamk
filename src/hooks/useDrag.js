import { useCallback, useEffect, useRef } from 'react'

/**
 * Generic pointer-drag hook.
 *
 * Returns a single `onPointerDown` handler you can attach to any number of
 * elements. On press it captures the starting client position, then fires
 * `onMove` for every movement with the cumulative delta from the start point
 * (`dx`, `dy`) plus the raw client coordinates. `onStart`/`onEnd` bracket the
 * gesture.
 *
 * The SVG canvas is rendered 1:1 with CSS pixels (no viewBox scaling), so a
 * client-space delta equals an SVG user-space delta — callers can apply
 * `dx`/`dy` to shape coordinates directly.
 */
export function useDrag({ onStart, onMove, onEnd } = {}) {
  // Keep the latest callbacks in a ref so the returned handler is stable.
  const cbRef = useRef({})
  useEffect(() => {
    cbRef.current = { onStart, onMove, onEnd }
  })

  return useCallback((e) => {
    // Only react to the primary (left / touch) button.
    if (e.button != null && e.button !== 0) return
    e.stopPropagation()

    const start = { x: e.clientX, y: e.clientY }
    cbRef.current.onStart?.(e)

    const handleMove = (ev) => {
      cbRef.current.onMove?.({
        dx: ev.clientX - start.x,
        dy: ev.clientY - start.y,
        clientX: ev.clientX,
        clientY: ev.clientY,
        event: ev,
      })
    }

    const handleUp = (ev) => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      cbRef.current.onEnd?.(ev)
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
  }, [])
}
