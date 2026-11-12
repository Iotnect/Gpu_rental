import { useLayoutEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, CircuitBoard, Plus } from 'lucide-react';
import './gpu-story.css';

type WorkloadMarker = {
  id: string;
  title: string;
  markerDetail: string;
};

type GpuStoryProps = {
  workloads: readonly WorkloadMarker[];
  sample: { model: string; count: number; hours: number; hourlyRate: string; total: string };
};

const motionQuery = '(min-width: 1050px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)';
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const segment = (progress: number, start: number, end: number) => clamp((progress - start) / (end - start));
const ease = (value: number) => value * value * (3 - 2 * value);

export function GpuStory({ workloads, sample }: GpuStoryProps) {
  const storyRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(workloads[0].id);
  const activeWorkload = workloads.find((workload) => workload.id === activeId)!;

  useLayoutEffect(() => {
    const story = storyRef.current;
    const stage = stageRef.current;
    if (!story || !stage) return;

    const media = window.matchMedia(motionQuery);
    let frame: number | undefined;
    let stickyTop = 0;
    let scrollDistance = 1;

    function update() {
      frame = undefined;
      if (!story || !stage) return;

      const progress = clamp((stickyTop - story.getBoundingClientRect().top) / scrollDistance);
      const camera = ease(segment(progress, .12, .45));
      const phase = progress < .17 ? 'hero' : progress < .45 ? 'flight' : progress < .70 ? 'map' : 'estimate';
      const reveal = {
        hero: 1,
        flight: ease(segment(progress, .17, .26)) * (1 - ease(segment(progress, .40, .45))),
        map: ease(segment(progress, .45, .50)),
        estimate: ease(segment(progress, .70, .79)),
      }[phase];

      stage.dataset.phase = phase;
      stage.toggleAttribute('data-overlay-visible', reveal > 0);
      stage.style.setProperty('--progress', String(progress));
      stage.style.setProperty('--camera', String(camera));
      stage.style.setProperty('--hero-fade', String(1 - ease(segment(progress, .08, .17))));
      stage.style.setProperty('--overlay-reveal', String(reveal));
      stage.style.setProperty('--foreground-opacity', String(segment(progress, .13, .20) * (1 - segment(progress, .32, .43))));
    }

    function queueUpdate() {
      if (frame === undefined) frame = requestAnimationFrame(update);
    }

    function measure() {
      if (!story || !stage) return;
      stickyTop = parseFloat(getComputedStyle(stage).top) || 0;
      scrollDistance = Math.max(1, story.offsetHeight - stage.offsetHeight);
      queueUpdate();
    }

    function stop() {
      window.removeEventListener('scroll', queueUpdate);
      window.removeEventListener('resize', measure);
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      if (story) delete story.dataset.animated;
      if (stage) {
        delete stage.dataset.phase;
        stage.removeAttribute('data-overlay-visible');
      }
    }

    function configure() {
      stop();
      if (!media.matches || !story) return;

      story.dataset.animated = '';
      measure();
      window.addEventListener('scroll', queueUpdate, { passive: true });
      window.addEventListener('resize', measure);
    }

    configure();
    media.addEventListener('change', configure);
    return () => {
      stop();
      media.removeEventListener('change', configure);
    };
  }, []);

  return (
    <section className="story" ref={storyRef} aria-labelledby="hero-title">
      <div className="hero story-stage" ref={stageRef}>
        <div className="shell hero-inner">
          <div className="hero-copy">
            <p className="eyebrow hero-label"><span /> ON-DEMAND GPU RENTAL</p>
            <h1 id="hero-title">GPU compute<br /> <em>for AI.</em></h1>
            <p className="hero-description">Train and fine-tune models, serve live inference, or run demanding renders and simulations with rented GPUs.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#gpus">Explore GPUs <ArrowRight size={18} /></a>
              <a className="button button-quiet" href="#workloads">View workloads <ArrowDown size={16} /></a>
            </div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="artwork" />
            <div className="hero-frame">
              <span className="corner corner-tl" /><span className="corner corner-tr" /><span className="corner corner-bl" /><span className="corner corner-br" />
              <div className="visual-title"><CircuitBoard size={16} /> GPU ARCHITECTURE</div>
              <div className="visual-note"><span /> ACCELERATED COMPUTE</div>
            </div>
          </div>
        </div>

        <div className="story-foreground" aria-hidden="true"><span /><span /></div>

        <div className="story-overlay story-flight">
          <h2>From training to inference.</h2>
        </div>

        <div className="story-overlay story-map" aria-label="Workload map">
          <div className="shell story-map-inner">
            <div className="story-map-heading">
              <h2>Explore GPU workloads</h2>
            </div>
            <div className="story-markers" role="group" aria-label="Select a workload">
              {workloads.map(({ id, title }) => (
                <button key={id} className={`story-marker story-marker-${id}`} type="button" aria-pressed={activeId === id} aria-controls="story-marker-detail" onClick={() => setActiveId(id)}>
                  <Plus size={15} aria-hidden="true" />{title}
                </button>
              ))}
            </div>
            <div className="story-marker-detail" id="story-marker-detail">
              <p aria-live="polite">{activeWorkload.markerDetail}</p>
              <a href={`#${activeWorkload.id}`} aria-label={`View ${activeWorkload.title} workload`}>View workload <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>
        </div>

        <div className="story-overlay story-estimate">
          <div className="story-estimate-card">
            <p className="eyebrow">Sample estimate</p>
            <h2>Estimate a GPU run</h2>
            <dl>
              <div><dt>Configuration</dt><dd>{sample.count} × NVIDIA {sample.model}</dd></div>
              <div><dt>Runtime</dt><dd>{sample.hours} hours</dd></div>
              <div><dt>Sample rate</dt><dd>{sample.hourlyRate} / GPU-hour</dd></div>
            </dl>
            <p className="story-estimate-total">{sample.total}</p>
            <a className="button button-primary" href="#gpus">Configure a GPU <ArrowRight size={17} /></a>
          </div>
        </div>

        <div className="shell story-controls">
          <span className="story-scroll-hint"><ArrowDown size={15} aria-hidden="true" /> Scroll to explore</span>
          <div className="story-progress" aria-hidden="true"><span /></div>
          <a href="#gpus">Skip to GPU catalog <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}
