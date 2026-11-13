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
          {/* Trace coordinates are measured on gpu-hero-unlit.webp. */}
          <path pathLength="100" d="M108 676 231 607 268 607 364 554" />
          <path pathLength="100" d="M244 870 543 692" />
          <path pathLength="100" d="M1060 980 989 912 987 804 947 771" />
          <path pathLength="100" d="M45 442 104 407 236 407 289 378 336 378" />
          <path pathLength="100" d="M374 24 499 94 488 184 548 223" />
          <g className="gpu-circuit-violet">
            <path pathLength="100" d="M1398 923 1357 891 1111 695" />
            <path pathLength="100" d="M1478 24 1148 213 1148 254 1125 267" />
            <path pathLength="100" d="M1535 326 1470 364 1321 365 1248 406" />
            <path pathLength="100" d="M1534 590 1402 588 1323 534 1281 533" />
            <path pathLength="100" d="M1534 735 1435 735 1382 697 1277 694 1173 622" />
          </g>
        </svg>
      </div>
    </div>
  );
}
