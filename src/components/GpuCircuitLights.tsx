import { useEffect, useRef } from 'react';

const artworkUrl = `${import.meta.env.BASE_URL}gpu-hero-unlit.webp`;

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
      <div className="gpu-backdrop-artwork">
        <img src={artworkUrl} alt="" width="1536" height="1024" />
        <svg className="gpu-circuit-lights" viewBox="0 0 1536 1024" fill="none">
          <path pathLength="100" d="M81 695 254 597 272 596 366 543" />
          <path pathLength="100" d="M174 920 510 719 550 691" />
          <path pathLength="100" d="M1076 984 1008 916 1008 784 961 744" />
          <path pathLength="100" d="M30 439 103 394 236 394 289 367 334 367" />
          <path pathLength="100" d="M318 4 451 82 451 195 532 257" />
          <g className="gpu-circuit-violet">
            <path pathLength="100" d="M1438 934 1346 934 1085 716" />
            <path pathLength="100" d="M1490 12 1176 182 1176 244 1141 265" />
            <path pathLength="100" d="M1536 309 1470 349 1324 349 1241 396" />
            <path pathLength="100" d="M1536 620 1353 619 1275 559 1251 559" />
            <path pathLength="100" d="M1536 733 1434 733 1383 697 1308 695 1223 634" />
          </g>
        </svg>
      </div>
    </div>
  );
}
