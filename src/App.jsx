import { useEffect } from 'react'
import Toolbar from './components/Toolbar.jsx'
import Canvas from './components/Canvas.jsx'
import PropertiesPanel from './components/PropertiesPanel.jsx'
import { useEditor } from './hooks/useEditor.js'
import './App.css'

export default function App() {
  const {
    shapes,
    selectedId,
    selectedShape,
    addShape,
    selectShape,
    updateShape,
    deleteShape,
  } = useEditor()

  // Delete / Backspace removes the selected shape (unless typing in a field).
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Delete' && e.key !== 'Backspace') return
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (selectedId) {
        e.preventDefault()
        deleteShape(selectedId)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedId, deleteShape])

  return (
    <div className="app">
      <Toolbar onAdd={addShape} />
      <div className="workspace">
        <Canvas
          shapes={shapes}
          selectedId={selectedId}
          selectedShape={selectedShape}
          selectShape={selectShape}
          updateShape={updateShape}
        />
        <PropertiesPanel
          shape={selectedShape}
          updateShape={updateShape}
          deleteShape={deleteShape}
        />
      </div>
    </div>
  )
}
