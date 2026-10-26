/**
 * ============================================================================
 * BOTCHAN — 3D GIT COMMIT GRAPH (graph3d.js)
 * Stack: Vanilla JS ES Module + Three.js v0.160.0 from CDN (No Bundlers)
 * ============================================================================
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';
import {
  computeCommitGraphLayout,
  selectVisibleCommitNodes,
  buildFallbackSvgMarkup,
  getThemeColors,
} from './script.js';

export const GRAPH_CONFIG = {
  // Fallback theme colors (overridden dynamically by CSS custom properties)
  colors: {
    light: {
      mainBranch: '#0D141B', // --text
      sideBranch: '#5B6248', // --accent
      guideLine: '#CFC7BE',  // --border
    },
    dark: {
      mainBranch: '#E9E1D5', // --text
      sideBranch: '#A3AD86', // --accent
      guideLine: '#2A2A28',  // --border
    },
  },

  // Animation, interaction, and performance parameters
  animation: {
    entranceDurationSec: 2.0, // Total time for nodes to appear one-by-one
    nodeScaleLerpSpeed: 9.0,  // Speed of individual node pop-in
    idleRotationSpeed: 0.16,  // Radians per second for slow idle rotation
    scrollYMultiplier: 0.0025,// Group Y-translation per pixel scrolled
    scrollLerpFactor: 0.08,   // Smooth easing factor for scroll movement
    orbitDampingFactor: 0.06, // OrbitControls inertia damping
    maxPixelRatio: 2,         // Cap devicePixelRatio at 2 for performance
    mobileBreakpointPx: 768,  // Viewport width below which nodes are reduced
    mobileMaxNodes: 7,        // Number of nodes rendered on mobile screens
  },

  // ==========================================================================
  // HOW TO ADD A NEW COMMIT NODE TO THE 3D GRAPH:
  // 1. Append a new commit object to the `commits` array below in chronological order.
  // 2. Fields:
  //    - `id`: Short Git SHA string (e.g., 'c10a7b3')
  //    - `parent_ids`: Array of 1 parent ID (normal/branch commit) or 2 parent IDs (merge commit)
  //    - `branch`: 'main' | 'feat/webgl-graph' | 'arch/state-tree'
  //      ('main' uses the primary text color; side branches use the olive accent color)
  //    - `message`: Concise commit summary displayed in the hover/tap tooltip
  //    - `date`: 'YYYY-MM-DD' commit timestamp
  // ==========================================================================
  commits: [
    {
      id: 'c01a8f0',
      parent_ids: [],
      branch: 'main',
      message: 'init: repository & semantic HTML5 structure',
      date: '2026-09-12',
    },
    {
      id: 'c02b3d1',
      parent_ids: ['c01a8f0'],
      branch: 'main',
      message: 'feat(css): add light/dark theme tokens & 1px borders',
      date: '2026-09-18',
    },
    {
      id: 'c03e9a4',
      parent_ids: ['c02b3d1'],
      branch: 'feat/webgl-graph',
      message: 'feat(3d): bootstrap Three.js r160 scene & OrbitControls',
      date: '2026-09-25',
    },
    {
      id: 'c04f1c2',
      parent_ids: ['c02b3d1'],
      branch: 'main',
      message: 'docs(log): add initial Git DAG & worktree notes',
      date: '2026-09-29',
    },
    {
      id: 'c05d7e8',
      parent_ids: ['c03e9a4'],
      branch: 'feat/webgl-graph',
      message: 'feat(3d): add raycaster node inspection & HTML tooltip',
      date: '2026-10-04',
    },
    {
      id: 'c06a2b9',
      parent_ids: ['c04f1c2'],
      branch: 'arch/state-tree',
      message: 'refactor(arch): decouple commit JSON config & SVG fallback',
      date: '2026-10-09',
    },
    {
      id: 'c07c4f1',
      parent_ids: ['c04f1c2', 'c05d7e8'],
      branch: 'main',
      message: 'merge: integrate feat/webgl-graph into main branch',
      date: '2026-10-15',
    },
    {
      id: 'c08e5a3',
      parent_ids: ['c06a2b9'],
      branch: 'arch/state-tree',
      message: 'perf(a11y): add IntersectionObserver & reduced-motion guard',
      date: '2026-10-20',
    },
    {
      id: 'c09f4a2',
      parent_ids: ['c07c4f1', 'c08e5a3'],
      branch: 'main',
      message: 'merge: integrate arch/state-tree into main portfolio layout',
      date: '2026-10-24',
    },
  ],
};

/**
 * Read current CSS variable colors from `:root` / `[data-theme]` so Three.js
 * materials always stay in sync with the active CSS theme.
 */
function readCssThemeColors() {
  const themeAttr =
    document.documentElement.getAttribute('data-theme') || 'light';
  const fallback =
    themeAttr === 'dark'
      ? GRAPH_CONFIG.colors.dark
      : GRAPH_CONFIG.colors.light;

  const styles = window.getComputedStyle(document.documentElement);
  const textHex = styles.getPropertyValue('--text').trim() || fallback.mainBranch;
  const accentHex =
    styles.getPropertyValue('--accent').trim() || fallback.sideBranch;
  const borderHex =
    styles.getPropertyValue('--border').trim() || fallback.guideLine;
  const bgHex = styles.getPropertyValue('--bg').trim() || '#F2EBE4';
  const mutedHex = styles.getPropertyValue('--muted').trim() || '#6B6B6B';

  return {
    theme: themeAttr,
    mainBranch: textHex,
    sideBranch: accentHex,
    guideLine: borderHex,
    bg: bgHex,
    text: textHex,
    accent: accentHex,
    muted: mutedHex,
  };
}

/**
 * Detect software WebGL (SwiftShader / llvmpipe / Basic Render) so frame pacing
 * remains responsive on GPU-less environments while keeping scene geometry identical.
 */
function detectSoftwareWebGL() {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl =
      probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return { supported: false, isSoftwareGl: true };

    const dbgExt = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererParam = dbgExt
      ? dbgExt.UNMASKED_RENDERER_WEBGL
      : gl.RENDERER;
    const gpuName = String(gl.getParameter(rendererParam) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();

    const isSoftwareGl =
      /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpuName);
    return { supported: true, isSoftwareGl };
  } catch {
    return { supported: false, isSoftwareGl: true };
  }
}

/**
 * Initialize the 3D Git Commit Graph or gracefully fall back to 2D SVG.
 */
function initCommitGraph3D() {
  const container = document.getElementById('graph-container');
  const canvas = document.getElementById('commit-graph-canvas');
  const svgFallbackContainer = document.getElementById('svg-fallback-container');
  const tooltipEl = document.getElementById('commit-tooltip');
  const tooltipIdEl = document.getElementById('tooltip-id');
  const tooltipBranchEl = document.getElementById('tooltip-branch');
  const tooltipMsgEl = document.getElementById('tooltip-message');
  const tooltipDateEl = document.getElementById('tooltip-date');
  const nodeButtonsContainer = document.getElementById('commit-node-buttons');
  const resetGraphBtn = document.getElementById('reset-graph-btn');

  if (!container || !canvas) return;

  const isMobile =
    window.innerWidth < GRAPH_CONFIG.animation.mobileBreakpointPx;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  // Prepare visible commit nodes (reduces count on mobile)
  const visibleCommits = selectVisibleCommitNodes(
    GRAPH_CONFIG.commits,
    isMobile,
    GRAPH_CONFIG.animation.mobileMaxNodes,
  );
  const graphLayout = computeCommitGraphLayout(visibleCommits, {
    entranceDurationSec: GRAPH_CONFIG.animation.entranceDurationSec,
  });

  // Populate accessible commit sequence buttons below the viewport
  if (nodeButtonsContainer) {
    nodeButtonsContainer.innerHTML = graphLayout.nodes
      .map(
        (node, idx) => `
        <button
          type="button"
          class="node-chip-btn ${idx === graphLayout.nodes.length - 1 ? 'is-selected' : ''}"
          data-commit-id="${node.id}"
          aria-pressed="${idx === graphLayout.nodes.length - 1 ? 'true' : 'false'}"
          title="${node.id} (${node.branch}): ${node.message}"
        >
          ${node.id.slice(0, 4)}
        </button>`,
      )
      .join('');
  }

  // Helper to update the tooltip DOM and broadcast commit selection
  function showCommitTooltip(commit, clientX, clientY) {
    if (!commit) return;

    window.dispatchEvent(
      new CustomEvent('botchan:commitselect', { detail: { commit } }),
    );

    if (!tooltipEl) return;
    if (tooltipIdEl) tooltipIdEl.textContent = commit.id;
    if (tooltipBranchEl) tooltipBranchEl.textContent = commit.branch;
    if (tooltipMsgEl) tooltipMsgEl.textContent = commit.message;
    if (tooltipDateEl) tooltipDateEl.textContent = commit.date;

    const rect = container.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;

    const clampedX = Math.max(12, Math.min(relX + 14, rect.width - 240));
    const clampedY = Math.max(12, Math.min(relY - 18, rect.height - 110));

    tooltipEl.style.transform = `translate3d(${Math.round(clampedX)}px, ${Math.round(clampedY)}px, 0)`;
    tooltipEl.hidden = false;
  }

  function hideCommitTooltip() {
    if (tooltipEl) {
      tooltipEl.hidden = true;
    }
  }

  // Activate 2D SVG Fallback if WebGL is unavailable or requested via ?fallback=svg
  const forceSvgFallback = new URLSearchParams(window.location.search).get(
    'fallback',
  ) === 'svg';
  const glProbe = detectSoftwareWebGL();

  function activateSvgFallback() {
    canvas.style.display = 'none';
    if (!svgFallbackContainer) return;
    svgFallbackContainer.hidden = false;

    const renderSvg = () => {
      const colors = readCssThemeColors();
      svgFallbackContainer.innerHTML = buildFallbackSvgMarkup(
        visibleCommits,
        colors,
      );

      const svgNodes = svgFallbackContainer.querySelectorAll('.svg-commit-node');
      svgNodes.forEach((gEl) => {
        const cid = gEl.getAttribute('data-commit-id');
        const commitObj = graphLayout.nodes.find((n) => n.id === cid);
        if (!commitObj) return;

        gEl.addEventListener('mouseenter', (e) => {
          showCommitTooltip(commitObj, e.clientX, e.clientY);
        });
        gEl.addEventListener('click', (e) => {
          const box = gEl.getBoundingClientRect();
          showCommitTooltip(
            commitObj,
            e.clientX || box.left,
            e.clientY || box.top,
          );
        });
      });
    };

    renderSvg();
    window.addEventListener('botchan:themechange', renderSvg);

    if (nodeButtonsContainer) {
      nodeButtonsContainer.querySelectorAll('.node-chip-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const cid = btn.getAttribute('data-commit-id');
          const commitObj = graphLayout.nodes.find((n) => n.id === cid);
          if (commitObj) {
            const rect = container.getBoundingClientRect();
            showCommitTooltip(
              commitObj,
              rect.left + rect.width * 0.5,
              rect.top + rect.height * 0.4,
            );
          }
        });
      });
    }
  }

  if (!glProbe.supported || forceSvgFallback) {
    activateSvgFallback();
    return;
  }

  // Initialize Three.js WebGLRenderer with transparent background
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !glProbe.isSoftwareGl,
      powerPreference: 'high-performance',
    });
  } catch {
    activateSvgFallback();
    return;
  }

  const isSoftwareGl = glProbe.isSoftwareGl;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(
    isSoftwareGl
      ? 1
      : Math.min(
          window.devicePixelRatio || 1,
          GRAPH_CONFIG.animation.maxPixelRatio,
        ),
  );
  renderer.setSize(container.clientWidth, container.clientHeight, false);

  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    activateSvgFallback();
  });

  // Scene & Camera Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / Math.max(1, container.clientHeight),
    0.1,
    100,
  );
  camera.position.set(3.6, 0.25, 7.5);

  // Lighting for subtle depth on commit spheres and rings
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
  scene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xfffcf5, 1.4);
  keyLight.position.set(5, 8, 6);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xdce6f2, 0.8);
  fillLight.position.set(-5, -4, 4);
  scene.add(fillLight);

  // OrbitControls for drag-to-orbit with inertia
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = !isSoftwareGl;
  controls.dampingFactor = GRAPH_CONFIG.animation.orbitDampingFactor;
  controls.enablePan = false;
  controls.minDistance = 3.5;
  controls.maxDistance = 12.5;
  controls.target.set(0, 0, 0);
  controls.update();

  // Parent Group containing the entire Git Commit Graph
  // Moving `graphGroup.position.y` on scroll avoids conflict with `OrbitControls`
  const graphGroup = new THREE.Group();
  scene.add(graphGroup);

  // Shared Materials (dynamically updated on theme toggle)
  const initialColors = readCssThemeColors();

  const mainNodeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialColors.mainBranch),
    roughness: 0.38,
    metalness: 0.12,
  });

  const sideNodeMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialColors.sideBranch),
    roughness: 0.35,
    metalness: 0.15,
  });

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: new THREE.Color(initialColors.sideBranch),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.65,
  });

  const mainLineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(initialColors.mainBranch),
    transparent: true,
    opacity: 0.85,
  });

  const sideLineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(initialColors.sideBranch),
    transparent: true,
    opacity: 0.9,
  });

  const guideLineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(initialColors.guideLine),
    transparent: true,
    opacity: 0.45,
  });

  // Subtle vertical branch axis reference lines
  const axisTop = 2.55;
  const axisBottom = -2.55;
  [-1.35, 0, 1.35].forEach((xOffset, idx) => {
    const zOffset = idx === 0 ? 0.7 : idx === 2 ? -0.7 : 0;
    const pts = [
      new THREE.Vector3(xOffset, axisBottom, zOffset),
      new THREE.Vector3(xOffset, axisTop, zOffset),
    ];
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const guideLine = new THREE.Line(geo, guideLineMaterial);
    graphGroup.add(guideLine);
  });

  // Shared Geometries for composite commit node assemblies
  const sphereGeo = new THREE.SphereGeometry(0.145, 24, 24);
  const mergeCoreGeo = new THREE.OctahedronGeometry(0.17, 1);
  const collarGeo = new THREE.TorusGeometry(0.22, 0.016, 12, 32);
  const hitSphereGeo = new THREE.SphereGeometry(0.32, 12, 12);
  const hitMeshMat = new THREE.MeshBasicMaterial({ visible: false });

  const animatedNodeEntries = [];
  const hitMeshes = [];
  const nodeGroupById = new Map();

  // Create 3D Commit Nodes
  graphLayout.nodes.forEach((node) => {
    const nodeHolder = new THREE.Group();
    nodeHolder.position.set(
      node.position.x,
      node.position.y,
      node.position.z,
    );

    const isMergeCommit = (node.parent_ids || []).length > 1;
    const coreMesh = new THREE.Mesh(
      isMergeCommit ? mergeCoreGeo : sphereGeo,
      node.isMain ? mainNodeMaterial : sideNodeMaterial,
    );
    nodeHolder.add(coreMesh);

    // Architectural orbital ring around merge commits & branch heads
    const collarMesh = new THREE.Mesh(
      collarGeo,
      node.isMain ? mainNodeMaterial : ringMaterial,
    );
    collarMesh.rotation.x = Math.PI / 2;
    const baseRingScale = isMergeCommit ? 1.15 : 0.85;
    collarMesh.scale.setScalar(baseRingScale);
    nodeHolder.add(collarMesh);

    // Invisible larger proxy sphere for forgiving raycast hover/tap targets
    const hitMesh = new THREE.Mesh(hitSphereGeo, hitMeshMat);
    hitMesh.userData = { commit: node, nodeHolder, collarMesh, baseRingScale };
    nodeHolder.add(hitMesh);
    hitMeshes.push(hitMesh);

    // Entrance scale setup: start at 0.001 unless reduced motion is enabled
    const initialScale = prefersReducedMotion ? 1 : 0.001;
    nodeHolder.scale.setScalar(initialScale);

    graphGroup.add(nodeHolder);
    nodeGroupById.set(node.id, {
      node,
      nodeHolder,
      collarMesh,
      baseRingScale,
    });
    animatedNodeEntries.push({
      nodeHolder,
      delaySec: node.delaySec,
      currentScale: initialScale,
    });
  });

  // Create Connecting Lines Between Parent & Child Commits
  const animatedEdgeEntries = [];
  graphLayout.edges.forEach((edge) => {
    const startVec = new THREE.Vector3(
      edge.from.x,
      edge.from.y,
      edge.from.z,
    );
    const endVec = new THREE.Vector3(edge.to.x, edge.to.y, edge.to.z);

    // Subdivide curve slightly on branch splits/merges for clean architectural routing
    let lineGeo;
    if (edge.isSideEdge && (edge.from.x !== edge.to.x || edge.from.z !== edge.to.z)) {
      const midY = (startVec.y + endVec.y) * 0.5;
      const curve = new THREE.CatmullRomCurve3([
        startVec,
        new THREE.Vector3(
          THREE.MathUtils.lerp(startVec.x, endVec.x, 0.45),
          midY,
          THREE.MathUtils.lerp(startVec.z, endVec.z, 0.45),
        ),
        endVec,
      ]);
      lineGeo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(16));
    } else {
      lineGeo = new THREE.BufferGeometry().setFromPoints([startVec, endVec]);
    }

    const lineMesh = new THREE.Line(
      lineGeo,
      edge.isSideEdge ? sideLineMaterial : mainLineMaterial,
    );
    lineMesh.visible = prefersReducedMotion;
    graphGroup.add(lineMesh);

    animatedEdgeEntries.push({
      lineMesh,
      delaySec: edge.delaySec,
    });
  });

  // Highlight Ring for Currently Hovered/Selected Commit Node
  const selectionRingGeo = new THREE.RingGeometry(0.26, 0.31, 32);
  const selectionRingMesh = new THREE.Mesh(selectionRingGeo, ringMaterial);
  selectionRingMesh.visible = false;
  graphGroup.add(selectionRingMesh);

  let activeCommitId =
    graphLayout.nodes[graphLayout.nodes.length - 1]?.id || null;

  function setHighlightedNode(commitId) {
    activeCommitId = commitId;
    const entry = nodeGroupById.get(commitId);
    if (!entry) {
      selectionRingMesh.visible = false;
      return;
    }
    selectionRingMesh.position.copy(entry.nodeHolder.position);
    selectionRingMesh.lookAt(camera.position);
    selectionRingMesh.visible = true;
  }

  if (activeCommitId) {
    setHighlightedNode(activeCommitId);
  }

  // Theme Toggle Sync: Dynamically update Three.js material colors without reload
  function syncThreeMaterialsWithTheme() {
    const nextColors = readCssThemeColors();
    mainNodeMaterial.color.set(nextColors.mainBranch);
    sideNodeMaterial.color.set(nextColors.sideBranch);
    ringMaterial.color.set(nextColors.sideBranch);
    mainLineMaterial.color.set(nextColors.mainBranch);
    sideLineMaterial.color.set(nextColors.sideBranch);
    guideLineMaterial.color.set(nextColors.guideLine);
    renderer.render(scene, camera);
  }

  window.addEventListener('botchan:themechange', syncThreeMaterialsWithTheme);

  // Raycaster for Node Hover & Tap Inspection
  const raycaster = new THREE.Raycaster();
  const pointerNdc = new THREE.Vector2();
  const scratchWorldPos = new THREE.Vector3();
  let lastRaycastTime = 0;

  function performRaycast(clientX, clientY, isClick = false) {
    const now = performance.now();
    if (!isClick && now - lastRaycastTime < 32) return;
    lastRaycastTime = now;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointerNdc, camera);
    const hits = raycaster.intersectObjects(hitMeshes, false);

    if (hits.length > 0) {
      const hitData = hits[0].object.userData;
      const commit = hitData?.commit;
      if (commit) {
        container.style.cursor = 'pointer';
        setHighlightedNode(commit.id);
        showCommitTooltip(commit, clientX, clientY);
        return;
      }
    }

    container.style.cursor = 'grab';
    if (!isClick) {
      hideCommitTooltip();
    }
  }

  canvas.addEventListener('pointermove', (e) => {
    performRaycast(e.clientX, e.clientY, false);
  });

  canvas.addEventListener('pointerdown', (e) => {
    performRaycast(e.clientX, e.clientY, true);
  });

  canvas.addEventListener('pointerleave', () => {
    hideCommitTooltip();
    container.style.cursor = 'grab';
  });

  // Wire accessible commit sequence buttons to focus/inspect 3D nodes
  if (nodeButtonsContainer) {
    nodeButtonsContainer.querySelectorAll('.node-chip-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cid = btn.getAttribute('data-commit-id');
        const entry = nodeGroupById.get(cid);
        if (!entry) return;

        setHighlightedNode(cid);

        // Project 3D node world coordinates to 2D container coordinates for tooltip
        entry.nodeHolder.getWorldPosition(scratchWorldPos);
        scratchWorldPos.project(camera);

        const rect = canvas.getBoundingClientRect();
        const screenX =
          rect.left + ((scratchWorldPos.x + 1) * 0.5) * rect.width;
        const screenY =
          rect.top + ((-(scratchWorldPos.y - 1) * 0.5)) * rect.height;

        showCommitTooltip(entry.node, screenX, screenY);
        renderer.render(scene, camera);
      });
    });
  }

  // Reset Orbit Button
  if (resetGraphBtn) {
    resetGraphBtn.addEventListener('click', () => {
      camera.position.set(3.6, 0.25, 7.5);
      controls.target.set(0, 0, 0);
      graphGroup.rotation.set(0, 0, 0);
      controls.update();
      hideCommitTooltip();
      renderer.render(scene, camera);
    });
  }

  // Scroll Animation State: Moves `graphGroup.position.y` instead of `camera`
  let targetScrollGroupY = 0;
  function updateScrollTarget() {
    if (prefersReducedMotion) {
      targetScrollGroupY = 0;
      return;
    }
    targetScrollGroupY =
      window.scrollY * GRAPH_CONFIG.animation.scrollYMultiplier;
  }
  window.addEventListener('scroll', updateScrollTarget, { passive: true });
  updateScrollTarget();

  // Responsive Resize Handling
  function handleResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', handleResize);

  // IntersectionObserver: Pause WebGL loop when canvas is out of viewport
  let isCanvasInViewport = true;
  let isLoopRunning = false;
  let frameTimerId = 0;

  // Software-WebGL fence pacing helper so headless/CPU WebGL never starves the main thread
  function afterSoftwareDraw(callback) {
    const gl = renderer.getContext();
    if (gl && typeof gl.fenceSync === 'function') {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (!isCanvasInViewport) {
          gl.deleteSync(sync);
          isLoopRunning = false;
          return;
        }
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameTimerId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameTimerId = window.setTimeout(callback, 80);
        }
      };
      frameTimerId = window.setTimeout(poll, 5);
    } else {
      frameTimerId = window.setTimeout(callback, 80);
    }
  }

  const startTimeSec = performance.now() * 0.001;
  let lastFrameSec = startTimeSec;

  function animateFrame() {
    if (!isCanvasInViewport) {
      isLoopRunning = false;
      return;
    }

    const nowSec = performance.now() * 0.001;
    const dt = Math.min(0.1, Math.max(0.001, nowSec - lastFrameSec));
    lastFrameSec = nowSec;
    const elapsedSec = nowSec - startTimeSec;

    // 1. Entrance Animation: Nodes & edges appear in commit order over ~2 seconds
    if (!prefersReducedMotion) {
      for (const item of animatedNodeEntries) {
        if (elapsedSec >= item.delaySec) {
          item.currentScale = THREE.MathUtils.lerp(
            item.currentScale,
            1.0,
            Math.min(1, dt * GRAPH_CONFIG.animation.nodeScaleLerpSpeed),
          );
          item.nodeHolder.scale.setScalar(item.currentScale);
        }
      }
      for (const edgeItem of animatedEdgeEntries) {
        if (!edgeItem.lineMesh.visible && elapsedSec >= edgeItem.delaySec) {
          edgeItem.lineMesh.visible = true;
        }
      }
    }

    // 2. Slow Idle Rotation (respects prefers-reduced-motion)
    if (!prefersReducedMotion) {
      graphGroup.rotation.y += GRAPH_CONFIG.animation.idleRotationSpeed * dt;
    }

    // 3. Smooth Scroll Group Y Movement (avoids OrbitControls camera conflict)
    if (!prefersReducedMotion) {
      graphGroup.position.y +=
        (targetScrollGroupY - graphGroup.position.y) *
        GRAPH_CONFIG.animation.scrollLerpFactor;
    }

    // Keep selection highlight ring oriented toward the camera
    if (selectionRingMesh.visible) {
      selectionRingMesh.lookAt(camera.position);
    }

    controls.update();
    renderer.render(scene, camera);

    if (isSoftwareGl) {
      afterSoftwareDraw(animateFrame);
    } else {
      frameTimerId = window.requestAnimationFrame(animateFrame);
    }
  }

  function startRenderLoop() {
    if (isLoopRunning) return;
    isLoopRunning = true;
    lastFrameSec = performance.now() * 0.001;
    animateFrame();
  }

  function stopRenderLoop() {
    isLoopRunning = false;
    window.cancelAnimationFrame(frameTimerId);
    window.clearTimeout(frameTimerId);
  }

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isCanvasInViewport = entry.isIntersecting;
          if (isCanvasInViewport) {
            startRenderLoop();
          } else {
            stopRenderLoop();
          }
        });
      },
      { threshold: 0.05 },
    );
    observer.observe(container);
  }

  startRenderLoop();
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCommitGraph3D);
  } else {
    initCommitGraph3D();
  }
}
