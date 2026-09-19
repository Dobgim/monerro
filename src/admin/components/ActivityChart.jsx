import { useEffect, useRef, useState } from 'react'
import Icon from './Icon'

const H = 220
const PAD = { top: 16, right: 8, bottom: 28, left: 36 }
const MAX_BAR = 24

function niceMax(v) {
  if (v <= 4) return 4
  const step = 10 ** Math.floor(Math.log10(v))
  return Math.ceil(v / step) * step
}

// Column with a 4px rounded data-end and a square base on the baseline
function columnPath(x, y, w, h) {
  const r = Math.min(4, w / 2, h)
  if (h <= 0) return ''
  return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`
}

// Single-series column chart: add-to-cart events per day. Title names the series, so no legend.
export default function ActivityChart({ data, label = 'Cart adds' }) {
  const wrap = useRef(null)
  const [width, setWidth] = useState(600)
  const [hover, setHover] = useState(null)
  const [asTable, setAsTable] = useState(false)

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width))
    ro.observe(wrap.current)
    return () => ro.disconnect()
  }, [])

  const max = niceMax(Math.max(...data.map((d) => d.value), 0))
  const ticks = [0, max / 2, max]
  const innerW = Math.max(width - PAD.left - PAD.right, 10)
  const innerH = H - PAD.top - PAD.bottom
  const band = innerW / data.length
  const barW = Math.min(MAX_BAR, band * 0.6)
  const y = (v) => PAD.top + innerH - (v / max) * innerH
  const total = data.reduce((n, d) => n + d.value, 0)

  return (
    <div className="adm-chart" ref={wrap}>
      <div className="adm-chart__bar">
        <p className="adm-chart__total">
          <strong>{total.toLocaleString()}</strong> {label.toLowerCase()} in the last {data.length} days
        </p>
        <button type="button" className="adm-linkbtn" onClick={() => setAsTable((t) => !t)} aria-pressed={asTable}>
          <Icon name={asTable ? 'chart' : 'table'} size={15} /> {asTable ? 'Show chart' : 'Show table'}
        </button>
      </div>

      {asTable ? (
        <table className="adm-table adm-table--compact">
          <thead>
            <tr>
              <th>Day</th>
              <th className="num">{label}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.key}>
                <td>{d.long}</td>
                <td className="num">{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="adm-chart__plot">
          <svg width={width} height={H} role="img" aria-label={`${label} per day, last ${data.length} days. Total ${total}.`}>
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} className="adm-chart__grid" />
                <text x={PAD.left - 8} y={y(t)} dy="0.32em" textAnchor="end" className="adm-chart__tick">
                  {t.toLocaleString()}
                </text>
              </g>
            ))}
            {data.map((d, i) => {
              const cx = PAD.left + band * i + band / 2
              const top = y(d.value)
              const showLabel = data.length <= 7 || (data.length - 1 - i) % 2 === 0 // every other day, always including today
              return (
                <g key={d.key}>
                  <path d={columnPath(cx - barW / 2, top, barW, PAD.top + innerH - top)} className={`adm-chart__col${hover === i ? ' is-hover' : ''}`} />
                  {showLabel && (
                    <text x={cx} y={H - 8} textAnchor="middle" className="adm-chart__tick">
                      {d.short}
                    </text>
                  )}
                  {/* hit target: the whole band, taller than the mark */}
                  <rect
                    x={PAD.left + band * i}
                    y={PAD.top}
                    width={band}
                    height={innerH}
                    fill="transparent"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  />
                </g>
              )
            })}
          </svg>
          {hover !== null && (
            <div
              className="adm-chart__tip"
              style={{
                left: Math.min(Math.max(PAD.left + band * hover + band / 2, 70), width - 70),
                top: y(data[hover].value) - 8,
              }}
            >
              <span>{data[hover].long}</span>
              <strong>
                {data[hover].value} {label.toLowerCase()}
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
