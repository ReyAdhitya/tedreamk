const TYPE_LABEL = {
  rectangle: 'Rectangle',
  circle: 'Circle',
  triangle: 'Triangle',
}

function round(n) {
  return Math.round(n)
}

export default function PropertiesPanel({ shape, updateShape, deleteShape }) {
  if (!shape) {
    return (
      <aside className="panel">
        <p className="panel-empty">
          Select a shape to edit it, or add one from the toolbar.
        </p>
      </aside>
    )
  }

  const { id, type, x, y, width, height, fill, rotation } = shape

  return (
    <aside className="panel">
      <h2 className="panel-title">{TYPE_LABEL[type] ?? 'Shape'}</h2>

      <label className="field">
        <span>Color</span>
        <input
          type="color"
          value={fill}
          onChange={(e) => updateShape(id, { fill: e.target.value })}
        />
      </label>

      <label className="field">
        <span>Rotation</span>
        <div className="field-row">
          <input
            type="range"
            min="0"
            max="360"
            value={((rotation % 360) + 360) % 360}
            onChange={(e) => updateShape(id, { rotation: Number(e.target.value) })}
          />
          <output>{round(rotation)}°</output>
        </div>
      </label>

      <div className="readout">
        <div><span>X</span>{round(x)}</div>
        <div><span>Y</span>{round(y)}</div>
        <div><span>W</span>{round(width)}</div>
        <div><span>H</span>{round(height)}</div>
      </div>

      <button className="danger-btn" onClick={() => deleteShape(id)}>
        Delete shape
      </button>
    </aside>
  )
}
