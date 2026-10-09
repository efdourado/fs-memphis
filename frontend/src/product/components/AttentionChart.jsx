import { formatDate } from '../hooks';

const VIEW_W = 100;
const VIEW_H = 40;

// Lines are drawn in a stretchable SVG; labels are HTML positioned in percent,
// so text stays readable at phone width.
export default function AttentionChart({ points = [], events = [], label, compact = false }) {
  if (points.length < 2) return null;

  const x = (index) => (index / (points.length - 1)) * VIEW_W;
  const y = (value) => VIEW_H - (value / 100) * VIEW_H;
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(2)},${y(p.value).toFixed(2)}`).join(' ');
  const area = `${line} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`;

  const indexOf = (period) => points.findIndex((p) => p.period === period);
  const markers = compact ? [] : events
    .map((event, n) => ({ event, n: n + 1, index: indexOf(String(event.date).slice(0, 7)) }))
    .filter((m) => m.index >= 0)
    .map((m) => ({ ...m, left: (x(m.index) / VIEW_W) * 100 }))
    // Pins closer than a few percent would cover each other, so they stack.
    .reduce((placed, m) => {
      const before = placed.at(-1);
      const row = before && m.left - before.left < 5 ? before.row + 1 : 0;
      return [...placed, { ...m, row }];
    }, []);

  const tickCount = compact ? 2 : 4;
  const ticks = [...new Set(Array.from({ length: tickCount }, (_, i) => Math.round((i / (tickCount - 1)) * (points.length - 1))))];

  return (
    <figure className={`m-chart${compact ? ' m-chart--compact' : ''}`}>
      <div className="m-chart__plot" role="img" aria-label={label}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={area} className="m-chart__area" />
          <path d={line} className="m-chart__line" vectorEffect="non-scaling-stroke" />
          {markers.map((m) => (
            <line
              key={m.n}
              x1={x(m.index)}
              x2={x(m.index)}
              y1="0"
              y2={VIEW_H}
              className="m-chart__marker"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
        {markers.map((m) => (
          <span
            key={m.n}
            className="m-chart__pin"
            style={{ left: `${m.left}%`, top: `${-10 + m.row * 24}px` }}
            title={`${formatDate(m.event.date)}: ${m.event.title}`}
          >
            {m.n}
          </span>
        ))}
      </div>
      <div className="m-chart__axis" aria-hidden="true">
        {ticks.map((index) => (
          <span key={index} style={{ left: `${(index / (points.length - 1)) * 100}%` }}>
            {points[index].period.slice(0, 4)}
          </span>
        ))}
      </div>
    </figure>
  );
}
