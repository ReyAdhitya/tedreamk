const SHAPES = [
  { type: 'rectangle', label: 'Rectangle', icon: '▭' },
  { type: 'circle', label: 'Circle', icon: '◯' },
  { type: 'triangle', label: 'Triangle', icon: '△' },
]

export default function Toolbar({ onAdd }) {
  return (
    <header className="toolbar">
      <span className="toolbar-title">Graphic Editor</span>
      <div className="toolbar-group">
        {SHAPES.map(({ type, label, icon }) => (
          <button key={type} className="tool-btn" onClick={() => onAdd(type)}>
            <span className="tool-icon">{icon}</span>
            {label}
          </button>
        ))}
      </div>
    </header>
  )
}
