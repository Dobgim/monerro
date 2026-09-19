import LeafIcon from './LeafIcon'

// "••••• 🍃 •••••" ornament above each section heading
export default function LeafLines({ color = '#abd590' }) {
  const dots = { width: '40px', borderStyle: 'dotted', borderColor: color, borderWidth: '0 0 5px' }
  return (
    <div className="leaf-lines" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
      <div className="cb-dots" style={dots} />
      <LeafIcon />
      <div className="cb-dots" style={dots} />
    </div>
  )
}
