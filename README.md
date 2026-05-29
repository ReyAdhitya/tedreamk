# Graphic Editor

A minimal React + SVG graphic editor. Add shapes to a canvas and manipulate them
directly: drag to move, drag corner handles to resize, recolor with a color
picker, and rotate with a handle above each shape.

Built on Vite + React 19. State lives in a single `useReducer` store; all
pointer interactions go through a small reusable `useDrag` hook.

## Demo

**Live:** https://tedreamk.vercel.app

> Record a GIF and add it here before final submission.

## Getting started

```bash
# Clone
git clone https://github.com/ReyAdhitya/tedreamk
cd tedreamk

# Install
npm install

# Run the dev server (http://localhost:5173)
npm run dev

# Production build + preview
npm run build
npm run preview

# Lint
npm run lint
```

## Usage

- **Add** a shape from the toolbar (Rectangle / Circle / Triangle).
- **Select** by clicking a shape; click empty canvas to deselect.
- **Move** by dragging the shape body.
- **Resize** by dragging any of the four corner handles.
- **Recolor** with the color input in the right-hand Properties panel.
- **Rotate** by dragging the round handle above the shape, or use the rotation
  slider in the Properties panel.
- **Delete** the selected shape with the panel button or the `Delete` /
  `Backspace` key.

## Supported shapes

| Shape     | Move | Resize | Recolor | Rotate |
| --------- | :--: | :----: | :-----: | :----: |
| Rectangle |  ✅  |   ✅   |   ✅    |   ✅   |
| Circle    |  ✅  |   ✅   |   ✅    |   ✅   |
| Triangle  |  ✅  |   ✅   |   ✅    |   ✅   |

## Shape state model

Every shape is a plain object:

```js
{ id, type, x, y, width, height, fill, rotation }
```

- `x, y` — top-left of the shape's unrotated bounding box
- `rotation` — degrees, applied about the box center

Reducer actions: `ADD_SHAPE`, `SELECT_SHAPE`, `UPDATE_SHAPE`, `DELETE_SHAPE`.

## Project structure

```
src/
  components/
    Canvas.jsx            # SVG canvas, move-drag, click-to-deselect
    Toolbar.jsx           # Add-shape buttons
    ShapeRenderer.jsx     # Renders one shape (rect / ellipse / polygon)
    SelectionHandles.jsx  # Bounding box, resize handles, rotation handle
    PropertiesPanel.jsx   # Color, rotation, X/Y/W/H readout, delete
  hooks/
    useEditor.js          # Reducer store + action helpers
    useDrag.js            # Reusable pointer-drag hook
  App.jsx                 # Wires everything together
```

## Known issues

- **Circle is an ellipse.** "Circle" renders as an `<ellipse>` so it can be
  resized non-uniformly; resizing one axis produces an oval, not a constrained
  circle.
- **Min-size clamp drifts the center.** Resizing below the ~12px minimum clamps
  the size, which can nudge the shape's center slightly instead of keeping the
  opposite corner perfectly pinned.
- **Backspace deletes.** `Backspace` removes the selected shape (ignored while
  typing in an input). This may surprise users expecting it to do nothing.
- **No persistence.** State is in-memory only; a refresh clears the canvas.
- **No undo/redo, layers, z-order controls, or text** — out of scope by design.
- **Touch/pen** works via pointer events but is untested across devices.
