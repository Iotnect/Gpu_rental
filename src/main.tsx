import { StrictMode, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Box, ChevronDown,
  Cpu, Download, Layers3, Menu, Network, Terminal, X, Zap,
} from 'lucide-react';
import { GpuCircuitLights } from './components/GpuCircuitLights';
import { Hero } from './components/iotnect-hero/Hero';
import './styles.css';

const gpus = [
  { id: '4090', name: 'RTX 4090', memory: 24, hourlySen: 224, role: 'Prototyping & rendering' },
  { id: 'a100', name: 'A100', memory: 80, hourlySen: 570, role: 'Fine-tuning & batch inference' },
  { id: 'h100', name: 'H100', memory: 80, hourlySen: 1019, role: 'Large models & distributed jobs' },
] as const;

type GpuId = typeof gpus[number]['id'];

const workloads = [
  { title: 'AI training', description: 'Train neural networks and fine-tune LLMs with your own datasets and checkpoints.', stack: 'PyTorch · Transformers', icon: Network, gpu: 'h100' },
  { title: 'AI inference', description: 'Serve chatbots, vision models, and text pipelines. Run batch jobs or handle live requests.', stack: 'vLLM · TensorRT', icon: Zap, gpu: 'a100' },
  { title: '3D rendering', description: 'Render high-resolution frames, architectural walkthroughs, and VFX sequences.', stack: 'Blender · Maya · Unreal Engine', icon: Box, gpu: '4090' },
  { title: 'High-performance computing', description: 'Run GPU-accelerated simulations, data analytics, and quantitative models.', stack: 'CUDA · RAPIDS', icon: Activity, gpu: 'h100' },
] as const;

const faqs = [
  { question: 'How do I choose a GPU?', answer: 'Start with the memory your workload needs. For training, account for model weights, activations, optimizer state, and batch size. For inference, include the memory needed for concurrent requests and their context. For rendering, start with a representative frame to check memory use.' },
  { question: 'Can I use more than one GPU?', answer: 'You can model up to eight GPUs in the estimator. A multi-GPU workload also needs software that can distribute work across devices. Memory is listed per GPU, and usable memory depends on how your workload is split.' },
  { question: 'How is the estimate calculated?', answer: 'The estimate multiplies the sample hourly rate by GPU count and runtime. It covers GPU time only. Storage, data transfer, and taxes are outside the estimate.' },
  { question: 'Can I book an instance from this page?', answer: 'This page is a preview of the GPU rental product. You can explore example hardware and download a configuration for your planning. Live inventory, billing, and instance booking are pending.' },
];

const ringgit = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' });
const brandName = 'NeoPark';

function Brand() {
  return <a className="brand" href="#top"><img src={`${import.meta.env.BASE_URL}neopark.svg`} alt="" width="32" height="32" />{brandName}</a>;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const [gpuId, setGpuId] = useState<GpuId>('a100');
  const [count, setCount] = useState(1);
  const [hours, setHours] = useState(8);
  const gpu = gpus.find((option) => option.id === gpuId)!;
  const hourlyRate = ringgit.format(gpu.hourlySen / 100);
  const estimate = ringgit.format((gpu.hourlySen * count * hours) / 100);

  function downloadConfig() {
    const config = [
      `${brandName} GPU configuration`, '', `GPU: NVIDIA ${gpu.name}`, `Memory per GPU: ${gpu.memory} GB`,
      `GPU count: ${count}`, `Runtime: ${hours} hours`, `Sample rate: ${hourlyRate} per GPU-hour`,
      `Estimated compute cost: ${estimate}`, '', 'Planning estimate only. Rates and inventory are illustrative.', '',
    ].join('\n');
    const url = URL.createObjectURL(new Blob([config], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'neopark-gpu-configuration.txt';
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header" onKeyDown={(event) => {
        if (event.key === 'Escape' && menuOpen) {
          setMenuOpen(false);
          menuButton.current?.focus();
        }
      }}>
        <div className="shell header-inner">
          <Brand />
          <button ref={menuButton} className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
          <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} id="main-navigation" aria-label="Main navigation">
            <a href="#workloads" onClick={() => setMenuOpen(false)}>Workloads</a>
            <a href="#gpus" onClick={() => setMenuOpen(false)}>GPU catalog</a>
            <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
          </nav>
          <a className="button button-small header-cta" href="#gpus">Configure a GPU <ArrowUpRight size={15} /></a>
        </div>
      </header>

      <main id="main">
        <Hero />

        <section className="hero" id="gpu-intro" aria-labelledby="hero-title">
          <GpuCircuitLights />
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
          </div>
        </section>

        <div className="tool-strip">
          <div className="shell tool-strip-inner">
            <span className="eyebrow tool-label">WORKLOAD TOOLS</span>
            <ul aria-label="Example workload tools">
              <li><span className="tool-symbol torch" aria-hidden="true" />PyTorch</li>
              <li><Layers3 size={20} aria-hidden="true" />CUDA</li>
              <li><Terminal size={20} aria-hidden="true" />vLLM</li>
              <li><Box size={20} aria-hidden="true" />Blender</li>
              <li><Cpu size={20} aria-hidden="true" />TensorRT</li>
            </ul>
          </div>
        </div>

        <section className="shell section workloads" id="workloads" aria-labelledby="workload-title">
          <div className="section-heading">
            <div><p className="eyebrow section-label">WORKLOADS</p><h2 id="workload-title">What are you running?</h2></div>
            <p>Start with your workload to find an example GPU configuration.</p>
          </div>
          <div className="workload-grid">
            {workloads.map(({ title, description, stack, icon: Icon, gpu: recommendedGpu }) => (
              <article className="workload" key={title}>
                <div className="workload-top"><Icon size={24} strokeWidth={1.6} /><a href="#gpus" aria-label={`Explore GPUs for ${title}`} onClick={() => setGpuId(recommendedGpu)}><ArrowUpRight size={20} /></a></div>
                <h3>{title}</h3>
                <p>{description}</p>
                <span>{stack}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="gpu-section" id="gpus" aria-labelledby="gpu-title">
          <div className="shell section">
            <div className="section-heading">
              <div><p className="eyebrow section-label">GPU CATALOG</p><h2 id="gpu-title">Configure your compute.</h2></div>
              <p>Compare example GPUs and estimate the compute cost for your run.</p>
            </div>
            <div className="configurator">
              <fieldset className="gpu-options">
                <legend className="eyebrow">GPU MODEL</legend>
                {gpus.map((option) => (
                  <label className="gpu-option" key={option.id}>
                    <input type="radio" name="gpu" value={option.id} checked={gpuId === option.id} onChange={() => setGpuId(option.id)} />
                    <span className="gpu-name"><strong>NVIDIA {option.name}</strong><small>{option.role}</small></span>
                    <span className="gpu-memory">{option.memory} GB</span>
                  </label>
                ))}
              </fieldset>
              <div className="estimate">
                <div className="estimate-heading"><span className="eyebrow">COST ESTIMATE</span><span className="sample-label">Sample rates · MYR</span></div>
                <div className="estimate-fields">
                  <label htmlFor="gpu-count">GPU count<span className="select-wrap"><select id="gpu-count" value={count} onChange={(event) => setCount(Number(event.target.value))}>{[1, 2, 4, 8].map((value) => <option value={value} key={value}>{value} {value === 1 ? 'GPU' : 'GPUs'}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></span></label>
                  <label htmlFor="runtime">Runtime<span className="select-wrap"><select id="runtime" value={hours} onChange={(event) => setHours(Number(event.target.value))}>{[1, 4, 8, 24, 48, 72, 168].map((value) => <option value={value} key={value}>{value} {value === 1 ? 'hour' : 'hours'}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></span></label>
                </div>
                <div className="estimate-total" aria-live="polite"><strong>{estimate}</strong><span>{hourlyRate} / GPU-hour<br />{count * hours} GPU-hours</span></div>
                <button type="button" className="button button-primary" onClick={downloadConfig}>Download configuration <Download size={17} /></button>
              </div>
            </div>
          </div>
        </section>

        <section className="shell section faq" id="faq" aria-labelledby="faq-title">
          <div><p className="eyebrow section-label">FAQ</p><h2 id="faq-title">Before you rent.</h2></div>
          <div className="questions">
            {faqs.map(({ question, answer }) => <details key={question}><summary>{question}<ChevronDown size={19} aria-hidden="true" /></summary><p>{answer}</p></details>)}
          </div>
        </section>

        <section className="shell closing" aria-labelledby="closing-title">
          <div className="closing-panel">
            <div><h2 id="closing-title">Plan your next run.</h2><p>Pick a GPU and see what your run could cost.</p></div>
            <a className="button button-primary" href="#gpus">Estimate GPU cost <ArrowDownRight size={18} /></a>
          </div>
        </section>
      </main>

      <footer className="footer"><div className="shell footer-inner"><Brand /><p>GPU rental for AI and accelerated workloads.</p><a href="#top">Back to top ↑</a></div></footer>
    </>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
