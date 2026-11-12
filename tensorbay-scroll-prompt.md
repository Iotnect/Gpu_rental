# Tensorbay · GPU fly-in landing page

Update the existing **Tensorbay** GPU rental landing page in this repository. Use **Tensorbay** as the working brand. Keep the React, TypeScript and Vite setup. Use Mossline’s five-beat scroll sequence as the motion reference and Railway’s developer-oriented typography and layout as the visual reference.

The story follows a camera from a full view of a GPU package down to its silicon die, then gives the visitor a way to explore AI workloads and estimate the cost of a run. AI training and inference lead the story. 3D rendering and high-performance computing appear alongside them in the workload section.

## Visual direction

- Keep the existing Geist and IBM Plex Mono typography, near-black background (`#0c0b12`), mint accent (`#b9fbd5`) and lavender accent (`#c5b6ff`). Use dark graphite for the GPU package and violet lighting on the board. Preserve generous whitespace and a readable contrast layer behind text.
- Use `public/gpu-hero.webp` as the opening still and static fallback. Match its GPU geometry, camera angle and lighting when creating the animation. Keep the brand, navigation and headings as HTML.
- Keep the existing navigation destinations, including `#workloads`, `#gpus` and `#faq`. Make **Explore GPUs** available immediately in the hero. Add a **Skip to GPU catalog** link for visitors who want to bypass the animation.

## Five beats

### 1. Hero · 0–12%

Keep the headline **GPU compute for AI.** and the existing hero description. Place the headline and calls to action on the left, with the GPU on the right. Show the package, socket pins and PCB traces clearly. At wide widths, the edge of the GPU may overlap the headline area if the text stays legible. Use a quiet **Scroll to explore** cue.

### 2. Fly-in · 12–45%

As the visitor scrolls, move the camera toward the package, skim the circuit traces and settle over the die. Let two foreground board components pass near the edges to show depth. Reveal **From training to inference.** as the camera approaches the die. Use a short fade and lift for the heading. The camera should move backward when the visitor scrolls up.

### 3. Workload map · 45–70%

Hold the camera steady while four markers appear along the board. Each marker reveals one line and links to its matching workload card. Use accessible controls with visible labels that work with touch and keyboard.

| Marker | Detail |
| --- | --- |
| AI training | Train neural networks and fine-tune LLMs with PyTorch or Transformers. |
| AI inference | Run chatbots, vision models and batch inference with tools like vLLM or TensorRT. |
| 3D rendering | Render CGI, architectural walkthroughs and VFX with Blender, Maya or Unreal Engine. |
| High-performance computing | Run GPU-accelerated simulations and data analytics with tools like CUDA or RAPIDS. |

### 4. GPU selection · 70–100%

Reveal a dark glass panel titled **Estimate a GPU run**. Use the existing calculator data to show an example with **1 × NVIDIA A100**, **8 hours**, **RM 5.70 per GPU-hour** and a total of **RM 45.60**. Label it **Sample estimate**. A short count-up can draw attention to the total, with the final amount immediately available to assistive technology. **Configure a GPU** jumps to the existing calculator. Keep sample rates in the same data source used by the calculator so the example stays in sync.

### 5. Workloads and catalog · normal page scroll

Release the pinned stage into a rounded graphite section containing the four workload cards. Keep descriptions visible on touch and keyboard. Use the existing card actions to preselect a GPU in the calculator. Keep the catalog, cost estimate, configuration download and FAQ in normal page flow. All prices, totals and downloaded configurations use MYR with the RM symbol and two decimal places.

Use the existing sample rates of **RM 2.24** for RTX 4090, **RM 5.70** for A100 and **RM 10.19** for H100 per GPU-hour. Keep them clearly marked as sample rates. Use the existing configuration download as the next step. Product copy should reflect the current preview and its planning features.

## Motion and implementation

- Use one `position: sticky` stage for the first four beats on wide screens. Treat the progress ranges as starting points. Begin with a story height of about `360svh`, and shorten it if visitors have to scroll through dead space. Let the browser handle scrolling, anchor links and keyboard navigation normally.
- Use the still for first paint. If an original, locally hosted clip is available, start with a frame that matches the still and crossfade only once the matching frame is ready. Use a short seekable encode or a compact frame sequence with a bounded cache. Draw only when the requested frame changes. Keep the still visible if the animation fails or takes too long to load.
- If the clip is unavailable, build the fly-in from the existing still with a restrained scale and pan toward the die. Bring in the workload markers and estimator panel using the same progress ranges.
- Use one scroll progress controller with `requestAnimationFrame`. Limit per-frame updates to the animated elements and stop scheduling frames when the stage is idle. Remove listeners and cancel pending work when the React component unmounts.
- On narrow screens and with `prefers-reduced-motion: reduce`, show the static GPU image followed by the workload cards and calculator in normal page flow. Hide the camera imagery from assistive technology and keep overlay controls in the accessible HTML. Ensure only visible controls are keyboard focusable, and make the same links and information available in the static layout.

## Asset prompt for the optional fly-in

> Use the existing Tensorbay GPU render as the first-frame reference. Create a silent 5-second, 16:9 macro fly-in. Start with the full black titanium GPU package on a graphite PCB. Move low across etched circuit traces, past two out-of-focus board components, then ease to a stop over the square silicon die. Keep the same chip geometry throughout. Use soft violet edge light and subtle mint traces. Hold the last frame long enough for HTML workload markers. No text, logos, labels or interface graphics.

## Verification

Run `npm.cmd run build` on Windows. Check that the hero paints before the animation loads, scrolling forward and backward follows the same path, and the catalog shortcut works from the first screen. Verify the static fallback on mobile and with reduced motion, keyboard access to the workload links, and a calculator download that matches the displayed RM estimate.
