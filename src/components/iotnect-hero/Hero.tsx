import { CrystalizedLogo } from './effects/CrystalizedLogo';
import ParticleText from './effects/ParticleText';
import { heroGather } from './effects/heroAnimation';
import GradientASCII from './effects/GradientASCII';
import './Hero.css';

const logoUrl = `${import.meta.env.BASE_URL}assets/iotnect-logo.jpeg`;
const brandName = 'Iotnect';

export function Hero() {
  return (
    <section className="iotnect-hero" aria-labelledby="iotnect-hero-title">
      <div className="hero-background" aria-hidden="true">
        <GradientASCII
          colors={['#160926', '#6e299e', '#c94aa9', '#793bc3']}
          shape="horizon"
          cellSize={15}
          glyphOpacity={0.65}
          glow={0.35}
          flicker={0.08}
          speed={0.55}
          gradientOpacity={0.64}
          clickEffect="none"
          intro={false}
          dpr={1}
        />
      </div>
      <div className="hero-brand">
        <h1 id="iotnect-hero-title" className="hero-title">{brandName}</h1>
        <div className="hero-brand-frame">
          <CrystalizedLogo src={logoUrl} color="#F25BD0" size={0.77} crackle={0.85} fill={0.5} interactive hoverStrength={0.7} />
        </div>
        <div className="hero-wordmark" aria-hidden="true">
          <ParticleText
            text={brandName}
            fontSize="clamp(3.5rem, 9vw, 6rem)"
            fontWeight={800}
            fontFamily="Manrope, sans-serif"
            color="#F7E8FF"
            highlightColor="#F25BD0"
            particleSize={2}
            density={3}
            scatter={heroGather.scatter}
            gatherDuration={heroGather.duration}
            stagger={heroGather.stagger}
            pointerRepel={28}
            repelRadius={90}
            idleDrift={0.5}
            trigger="mount"
            glow
          />
        </div>
        <p className="hero-brand-tagline">INTELLIGENCE. CONNECTED.</p>
        <a className="hero-scroll" href="#gpu-intro">SCROLL TO EXPLORE <span aria-hidden="true">↓</span></a>
      </div>
    </section>
  );
}
