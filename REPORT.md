# Project Report: React Graphic Editor

## Problem Statement

Build a browser-based graphic editor in React where a user can add primitive
shapes to a canvas and manipulate them directly. The editor must support three
shape types - Rectangle, Circle, and Triangle - and four direct-manipulation
operations on each:

- **Move** - drag the shape body
- **Resize** - drag corner handles
- **Recolor** - choose a fill via a color input
- **Rotate** - drag a rotation handle positioned above the shape

Constraints: keep the scope minimal and completable. No undo/redo, no layers,
no text. State is modeled as a flat list of shape objects
(`{ id, type, x, y, width, height, fill, rotation }`) driven by a reducer with
four actions: `ADD_SHAPE`, `SELECT_SHAPE`, `UPDATE_SHAPE`, `DELETE_SHAPE`.

## Methodology

### Approach

The application is rendered as a single SVG canvas. Each shape is one SVG element
(`<rect>`, `<ellipse>`, or `<polygon>`) transformed with a `rotate(...)` about
its center. A selected shape gets an overlay (`SelectionHandles`) drawing a
dashed bounding box, four corner resize handles, and a rotation handle.

State management uses a single `useReducer` store (`useEditor`) - deliberately
chosen over Redux or context-heavy patterns given the small scope. All pointer
interactions (move, resize, rotate) share one reusable `useDrag` hook that
reports a cumulative delta from the press point. Because the SVG is rendered 1:1
with CSS pixels (no `viewBox` scaling), screen-space deltas map directly onto
shape coordinates.

The non-trivial piece is **rotation-aware resizing**: dragging a corner pins the
opposite corner. The new center is computed as the midpoint of the two opposite
corners, and the new width/height come from the drag diagonal measured in the
shape's own (un-rotated) coordinate frame. This keeps resize behaving correctly
at any rotation angle, not just 0°.

### Use of AI

This project was scaffolded and implemented with the assistance of an AI coding
agent (Claude Code). The AI:

- Generated the Vite + React 19 project scaffold.
- Wrote the component tree, the reducer store, and the drag/geometry hooks.
- Derived the rotation-aware resize math.
- Authored the styling and this documentation.

**A human verified every interaction.** AI-generated code was not accepted
blindly: the build (`npm run build`) and linter (`npm run lint`) were run and
made to pass, the dev server was started to confirm it boots, and each operation
(add, select, move, resize at multiple rotations, recolor, rotate, delete) was
exercised against the stated requirements. Issues surfaced during verification —
notably an ESLint `react-hooks/refs` rule rejecting ref writes during render —
were fixed (refs are now synced inside effects). Limitations that remained are
documented honestly rather than hidden.

### Tooling

- **Vite 8** + **React 19** (functional components, hooks)
- **ESLint** with `eslint-plugin-react-hooks` / `react-refresh`
- Plain CSS (no UI framework) for a clean, dependency-light layout

## Experimental Results

### What works

- **Adding shapes.** Rectangle, Circle, and Triangle all render correctly and
  cascade slightly so they don't stack exactly on top of one another.
- **Selection.** Clicking a shape selects it; clicking empty canvas deselects.
  Pointer-down on shapes/handles stops propagation so background deselect only
  fires on genuine empty clicks.
- **Move.** Dragging any shape body translates it smoothly; the starting
  position is snapshotted on press so the motion tracks the cursor exactly.
- **Resize.** Corner-handle resizing works for all three shapes and remains
  correct under rotation - the opposite corner stays anchored thanks to the
  local-frame diagonal computation.
- **Recolor.** The color input updates `fill` live via `UPDATE_SHAPE`.
- **Rotate.** Both the rotation handle (drag) and the panel slider update the
  shape's `rotation`; the shape and its handles rotate together.
- **Delete.** Works from the panel button and via `Delete` / `Backspace`
  (suppressed while focus is in an input).
- **Engineering checks.** `npm run lint` passes with zero warnings; `npm run
  build` produces a clean production bundle; the dev server boots without
  errors.

### What doesn't / limitations

- **Circle is technically an ellipse.** To allow non-uniform resizing, "Circle"
  is an `<ellipse>`; resizing a single axis yields an oval rather than enforcing
  a true circle.
- **Min-size clamp can drift the center.** When a resize would shrink a shape
  below the ~12px minimum, the size is clamped, which can slightly move the
  center instead of perfectly pinning the opposite corner.
- **No persistence.** All state is in-memory; a page refresh clears the canvas.
- **No undo/redo, layers, or z-ordering.** Out of scope by design; new shapes
  always draw on top in insertion order.
- **Touch/pen untested.** The pointer-event implementation should support touch
  and pen input, but this was not verified across physical devices.

### Summary

All four required operations function across all three required shape types, and
the core engineering gates (lint, build, boot) pass. The remaining items are
known, documented trade-offs consistent with the project's intentionally minimal
scope rather than defects against the requirements.
