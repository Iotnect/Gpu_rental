import { useEffect, useRef } from 'react';

const chip = { x: 1010, y: 320, halfSize: 96 };
const lanes = Array.from({ length: 18 }, (_, lane) => (lane - 8.5) * 8);

const traces = lanes.flatMap((offset, lane) => {
  const row = chip.y + offset;
  const column = chip.x + offset;
  return [
    `M-240 ${row + 123} H${330 + offset} l46 -46 H${524 + offset} l38 -38 H${725 + offset} l39 -39 H${chip.x - chip.halfSize}`,
    `M1600 ${row - 38} H${1515 + offset / 2} l-75 75 H${1275 - offset / 2} l-37 -37 H${chip.x + chip.halfSize}`,
    `M${column + 112} 0 V${36 - offset / 3} l-112 112 V${chip.y - chip.halfSize}`,
    `M${column + 142} 640 l-86 -86 v-37 l-56 -56 V${chip.y + chip.halfSize}`,
  ].map((path, bank) => ({ path, animated: (lane + bank) % 3 === 0, bank }));
});

const boardRoutes = Array.from({ length: 7 }, (_, lane) => {
  const gap = lane * 7;
  return [
    `M300 ${8 + gap} h${125 - gap} l61 61 h${196 - gap} l38 38 v52 l34 34 h58`,
    `M${490 - gap} 640 v-50 l61 -61 h99 l54 -54 h125 l43 -43`,
    `M1290 ${18 + gap} h${245 - gap} l64 64 h160`,
    `M1192 ${435 + gap} h${86 - gap} l45 45 h${108 - gap} l49 49 h235`,
  ];
}).flat();

const pins = lanes.map((offset) => chip.halfSize + offset);
const diePads = Array.from({ length: 16 }, (_, pad) => 54 + pad * 5.6);
const components = [
  { x: 480, y: 64, width: 72, height: 48, rotation: 0 },
  { x: 575, y: 121, width: 96, height: 56, rotation: 0 },
  { x: 737, y: 99, width: 84, height: 52, rotation: 45 },
  { x: 664, y: 211, width: 104, height: 43, rotation: 0 },
  { x: 803, y: 169, width: 68, height: 36, rotation: 45 },
  { x: 829, y: 410, width: 43, height: 52, rotation: 0 },
  { x: 753, y: 485, width: 66, height: 38, rotation: -45 },
  { x: 896, y: 527, width: 48, height: 61, rotation: 0 },
  { x: 1191, y: 118, width: 61, height: 42, rotation: -45 },
  { x: 1370, y: 62, width: 87, height: 48, rotation: 0 },
  { x: 1500, y: 94, width: 56, height: 32, rotation: 0 },
  { x: 1211, y: 211, width: 104, height: 32, rotation: 0 },
  { x: 1381, y: 473, width: 88, height: 47, rotation: 0 },
  { x: 1496, y: 527, width: 67, height: 33, rotation: 0 },
  { x: 1242, y: 486, width: 56, height: 28, rotation: 45 },
  { x: 1314, y: 567, width: 52, height: 27, rotation: 45 },
];
const componentPads = [0.15, 0.29, 0.43, 0.57, 0.71, 0.85];

export function GpuCircuitLights() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = layer.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      element.toggleAttribute('data-visible', entry.isIntersecting);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={layer} className="gpu-backdrop" aria-hidden="true">
      <svg className="gpu-board" viewBox="0 0 1600 640" fill="none">
        <defs>
          <linearGradient id="gpu-package-metal" x2="100%" y2="100%">
            <stop stopColor="#496370" />
            <stop offset=".32" stopColor="#182932" />
            <stop offset="1" stopColor="#081319" />
          </linearGradient>
        </defs>
        <g className="gpu-board-routing">
          {boardRoutes.map((path) => <path key={path} d={path} />)}
        </g>
        <g className="gpu-board-components">
          {components.map(({ x, y, width, height, rotation }) => (
            <g key={x} transform={`translate(${x} ${y}) rotate(${rotation})`}>
              <rect x="-7" y="-8" width={width + 14} height={height + 16} rx="4" className="gpu-component-outline" />
              {componentPads.map((pad) => (
                <path key={pad} d={`M${pad * width} -5v9 M${pad * width} ${height - 4}v9`} className="gpu-component-pad" />
              ))}
              <rect width={width} height={height} rx="3" className="gpu-component-body" />
              <circle cx="8" cy="8" r="2" className="gpu-chip-marker" />
              <path d={`M8 ${height - 8} H${width - 8}`} className="gpu-component-outline" />
            </g>
          ))}
        </g>
        <g className="gpu-board-traces">
          {traces.map(({ path, bank }) => <path key={path} d={path} data-bank={bank} />)}
        </g>
        <g className="gpu-circuit-lights">
          {traces.filter(({ animated }) => animated).map(({ path }) => (
            <path key={path} d={path} pathLength="100" />
          ))}
        </g>
        <g transform={`translate(${chip.x - chip.halfSize} ${chip.y - chip.halfSize})`}>
          <rect x="-9" y="-9" width="210" height="210" rx="10" className="gpu-chip-socket" />
          <rect width="192" height="192" rx="7" className="gpu-chip-package" />
          {pins.map((pin) => (
            <path key={pin} className="gpu-chip-pin" d={`M${pin} 0v14 M${pin} 178v14 M0 ${pin}h14 M178 ${pin}h14`} />
          ))}
          <rect x="16" y="16" width="160" height="160" rx="6" className="gpu-chip-cover" />
          <rect x="46" y="46" width="100" height="100" rx="3" className="gpu-chip-die" />
          {diePads.map((pad) => (
            <path key={pad} className="gpu-chip-grid" d={`M${pad} 54v84 M54 ${pad}h84`} />
          ))}
          <circle cx="29" cy="29" r="3" className="gpu-chip-marker" />
        </g>
      </svg>
    </div>
  );
}
