import { useEffect, useRef } from 'react';

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
    <div ref={layer} className="gpu-circuit-lights" aria-hidden="true">
      <svg viewBox="0 0 1344 896" fill="none">
        {/* Paths use the original GPU image coordinates so they follow its traces. */}
        <path pathLength="100" d="M82 617 286 505 319 486" />
        <path pathLength="100" d="M191 785 478 611" />
        <path pathLength="100" d="M942 856 867 786 865 734 833 704" />
        <path pathLength="100" d="M1155 800 973 647" />
        <path pathLength="100" d="M1310 15 1015 187 1015 221" />
        <path pathLength="100" d="M1344 275 1275 321 1150 321 1098 349" />
      </svg>
    </div>
  );
}
