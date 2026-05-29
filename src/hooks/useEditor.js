import { useCallback, useReducer } from 'react'

/**
 * Editor state: the list of shapes and the id of the currently selected one.
 *
 * Shape shape: { id, type, x, y, width, height, fill, rotation }
 *   - x, y      : top-left of the shape's (unrotated) bounding box
 *   - rotation  : degrees, applied about the box center
 */

let counter = 0
const nextId = () => `shape-${Date.now().toString(36)}-${counter++}`

const SHAPE_DEFAULTS = {
  rectangle: { width: 140, height: 90, fill: '#4f8cff' },
  circle: { width: 110, height: 110, fill: '#ff6b6b' },
  triangle: { width: 130, height: 110, fill: '#51cf66' },
}

const initialState = { shapes: [], selectedId: null }

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_SHAPE':
      return {
        shapes: [...state.shapes, action.shape],
        selectedId: action.shape.id,
      }

    case 'SELECT_SHAPE':
      return { ...state, selectedId: action.id }

    case 'UPDATE_SHAPE':
      return {
        ...state,
        shapes: state.shapes.map((s) =>
          s.id === action.id ? { ...s, ...action.patch } : s,
        ),
      }

    case 'DELETE_SHAPE':
      return {
        shapes: state.shapes.filter((s) => s.id !== action.id),
        selectedId: state.selectedId === action.id ? null : state.selectedId,
      }

    default:
      return state
  }
}

export function useEditor() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const addShape = useCallback((type) => {
    const defaults = SHAPE_DEFAULTS[type]
    if (!defaults) return
    // Cascade new shapes slightly so they don't stack perfectly.
    const jitter = (counter % 6) * 24
    dispatch({
      type: 'ADD_SHAPE',
      shape: {
        id: nextId(),
        type,
        x: 240 + jitter,
        y: 160 + jitter,
        rotation: 0,
        ...defaults,
      },
    })
  }, [])

  const selectShape = useCallback((id) => {
    dispatch({ type: 'SELECT_SHAPE', id })
  }, [])

  const updateShape = useCallback((id, patch) => {
    dispatch({ type: 'UPDATE_SHAPE', id, patch })
  }, [])

  const deleteShape = useCallback((id) => {
    dispatch({ type: 'DELETE_SHAPE', id })
  }, [])

  const selectedShape =
    state.shapes.find((s) => s.id === state.selectedId) ?? null

  return {
    shapes: state.shapes,
    selectedId: state.selectedId,
    selectedShape,
    addShape,
    selectShape,
    updateShape,
    deleteShape,
  }
}
