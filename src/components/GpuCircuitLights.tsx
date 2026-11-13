import { useEffect, useRef } from 'react';

const chip = { x: 1140, y: 320 };
const lanes = Array.from({ length: 12 }, (_, lane) => (lane - 5.5) * 10);

const traces = lanes.flatMap((offset, lane) => {
  const row = chip.y + offset;
  const column = chip.x + offset;
  return [
    `M0 ${row + 174} H${408 + offset} l92 -92 H${779 + offset} l82 -82 H${chip.x - 96}`,
    `M1600 ${row - 119} H${1451 + offset} l-119 119 H${chip.x + 96}`,
    `M${column - 110} 0 V${55 - offset / 2} l110 110 V${chip.y - 96}`,
    `M${column + 124} 640 V${575 - offset / 2} l-124 -124 V${chip.y + 96}`,
  ].map((path, bank) => ({ path, animated: (lane + bank) % 3 === 0 }));
});

const pins = lanes.map((offset) => 96 + offset);

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
        <g className="gpu-board-traces">
          {traces.map(({ path }) => <path key={path} d={path} />)}
        </g>
        <g className="gpu-circuit-lights">
          {traces.filter(({ animated }) => animated).map(({ path }) => (
            <path key={path} d={path} pathLength="100" />
          ))}
        </g>
        <g transform={`translate(${chip.x - 96} ${chip.y - 96})`}>
          <rect width="192" height="192" rx="7" className="gpu-chip-package" />
          {pins.map((pin) => (
            <path key={pin} className="gpu-chip-pin" d={`M${pin} 0v14 M${pin} 178v14 M0 ${pin}h14 M178 ${pin}h14`} />
          ))}
          <rect x="16" y="16" width="160" height="160" rx="6" className="gpu-chip-cover" />
          <rect x="46" y="46" width="100" height="100" rx="3" className="gpu-chip-die" />
          <path className="gpu-chip-grid" d="M60 59v74 M72 59v74 M84 59v74 M96 59v74 M108 59v74 M120 59v74 M132 59v74 M59 60h74 M59 72h74 M59 84h74 M59 96h74 M59 108h74 M59 120h74 M59 132h74" />
          <circle cx="29" cy="29" r="3" className="gpu-chip-marker" />
        </g>
      </svg>
    </div>
  );
}
