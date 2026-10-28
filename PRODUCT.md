# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Plain static HTML, CSS, and Vanilla JavaScript with Three.js loaded as an ES module through an import map. No bundler, framework, build tool, or npm dependency. Deployed to GitHub Pages at botchan.tech via the repository CNAME.

## Users

Recruiters, hiring managers, and fellow developers who arrive from a link or profile. They need to quickly judge Botchan's skills and learning progress in Git, software architecture, and Three.js, then find repositories and contact details.

## Product Purpose

Botchan lets visitors explore a learning journey in Git, software architecture, and Three.js through an interactive 3D commit graph, a dated learning log, and project summaries. The portfolio demonstrates its subject directly: the hero DAG visualization is built dependency-free, with a 2D SVG fallback and reduced-motion support.

Success means a visitor understands within seconds that Botchan is a serious, growing developer, interacts with the 3D graph, reads at least one log entry, and clicks through to a GitHub repository or makes contact.

## Positioning

The portfolio itself is the proof of the work: its central Git DAG visualization makes the concepts being studied inspectable instead of merely describing them.

## Operating Context

Visitors arrive from an external link or profile and scan the portfolio quickly. They move from the hero and commit graph into Now Building, Log, Projects, and Stack, using the graph inspector, log filters, theme toggle, and repository/contact links to explore.

## Capabilities and Constraints

- Preserve the existing section structure: Now Building, Log, Projects, and Stack.
- Keep Git terminology accurate, including DAG, parent commits, merge, and branch.
- Keep the single declarative CONFIG object as the source for both the WebGL scene and the SVG fallback.
- Pause the animation loop when the canvas is offscreen.
- Preserve semantic landmarks, ARIA live regions, keyboard navigation, prefers-reduced-motion support, the 2D SVG fallback, and the light/dark theme toggle.
- Do not fabricate projects, commit hashes, dates, skills, credentials, testimonials, metrics, or links.
- Preserve the beginner-learning tone and the factual content already present in the repository.

## Brand Commitments

- Name: Botchan.
- Voice: clear, technical, honest, and beginner-learning rather than over-claiming expertise.
- Keep the existing terminology and identity recognizable across future work.

## Evidence on Hand

- [index.html](./index.html) contains the public portfolio copy, section structure, metadata, repository/contact links, and accessible graph controls.
- [style.css](./style.css) contains the current theme tokens, responsive layout, typography, and interaction states.
- [script.js](./script.js) contains portfolio UI behavior including theme, log filtering, and project status interaction.
- [graph3d.js](./graph3d.js) contains the shared commit graph data and the WebGL/SVG interaction implementation.
- [CNAME](./CNAME) records the custom GitHub Pages domain `botchan.tech`.
- No testimonials, external proof assets, or user-supplied case studies are established; future work must not invent them.

## Product Principles

1. Show the work and the learning process, not inflated claims.
2. Make technical concepts inspectable through working interaction.
3. Keep the system dependency-free, understandable, and easy to deploy.
4. Preserve accessible alternatives to every visual interaction.
5. Treat factual accuracy and honest beginner progress as part of the product.

## Accessibility & Inclusion

Preserve semantic landmarks, ARIA live regions, keyboard navigation, prefers-reduced-motion support, and the 2D SVG fallback for the 3D graph. The theme toggle and interactive graph must remain usable without relying on pointer input or motion.
