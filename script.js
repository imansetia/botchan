/**
 * ============================================================================
 * BOTCHAN — PORTFOLIO UI, THEME CONTROLLER & LOG SYSTEM (script.js)
 * Stack: Plain HTML5, CSS3 Variables, Vanilla ES Modules
 * ============================================================================
 */

export const CONFIG = {
  // Color palettes mirrored with CSS custom properties in style.css
  colors: {
    light: {
      bg: '#F2EBE4',
      surface: '#EAE1D8',
      text: '#0D141B',
      muted: '#6B6B6B',
      accent: '#5B6248',
      border: '#CFC7BE',
    },
    dark: {
      bg: '#0E0E0E',
      surface: '#161616',
      text: '#E9E1D5',
      muted: '#8E8A82',
      accent: '#A3AD86',
      border: '#2A2A28',
    },
  },

  // Animation and UI speeds
  animation: {
    themeTransitionMs: 160,
    entranceDurationSec: 2.0,
    scrollLerpFactor: 0.08,
  },

  // Allowed status states for Section 01 (Now Building)
  statusStates: ['learning', 'in progress', 'done'],

  // ==========================================================================
  // HOW TO ADD A NEW LOG ENTRY:
  // 1. Add a new object at the top of the `logEntries` array below.
  // 2. Provide:
  //    - `date`: 'YYYY-MM-DD' string
  //    - `topic`: 'git' | 'architecture' | 'threejs' (used by the filter buttons)
  //    - `topicLabel`: Uppercase monospace badge label (e.g. 'GIT', 'THREE.JS')
  //    - `text`: Short note describing what you learned or built.
  // ==========================================================================
  logEntries: [
    {
      date: '2026-10-24',
      topic: 'threejs',
      topicLabel: 'THREE.JS',
      text: 'Decoupled scroll offset from the PerspectiveCamera by moving the parent THREE.Group along the Y-axis instead, preventing target conflicts with OrbitControls damping.',
    },
    {
      date: '2026-10-19',
      topic: 'git',
      topicLabel: 'GIT',
      text: 'Practiced resolving a non-fast-forward merge between main and two feature branches; mapped how merge commits store two parent SHA hashes in chronological order.',
    },
    {
      date: '2026-10-11',
      topic: 'architecture',
      topicLabel: 'ARCHITECTURE',
      text: 'Refactored portfolio state into a single declarative CONFIG object so both the WebGL 3D scene and the 2D SVG fallback read from identical commit node coordinates.',
    },
    {
      date: '2026-10-03',
      topic: 'threejs',
      topicLabel: 'THREE.JS',
      text: 'Added IntersectionObserver to pause the requestAnimationFrame loop when the hero canvas leaves the viewport, plus prefers-reduced-motion checks for accessibility.',
    },
    {
      date: '2026-09-22',
      topic: 'git',
      topicLabel: 'GIT',
      text: 'Learned the difference between git reset, git revert, and git checkout when inspecting historical commits in a detached HEAD state.',
    },
  ],
};

/**
 * Pure helper: Resolve color palette for a given theme name ('light' | 'dark').
 */
export function getThemeColors(themeName = 'light') {
  return themeName === 'dark' ? CONFIG.colors.dark : CONFIG.colors.light;
}

/**
 * Pure helper: Filter log entries by topic ('all' | 'git' | 'architecture' | 'threejs').
 */
export function filterLogEntries(entries, topic = 'all') {
  if (!Array.isArray(entries)) return [];
  const normalized = String(topic || 'all').toLowerCase();
  if (normalized === 'all') return entries;
  return entries.filter((entry) => String(entry.topic).toLowerCase() === normalized);
}

/**
 * Pure helper: Return the next status state in the [learning -> in progress -> done] cycle.
 */
export function getNextBuildingStatus(currentStatus, states = CONFIG.statusStates) {
  const idx = states.indexOf(currentStatus);
  if (idx === -1) return states[0];
  return states[(idx + 1) % states.length];
}

/**
 * Pure helper: Select visible commit nodes (reduces node count on mobile while
 * preserving valid parent linkages across main and side branches).
 */
export function selectVisibleCommitNodes(allNodes, isMobile = false, mobileLimit = 7) {
  if (!Array.isArray(allNodes)) return [];
  if (!isMobile || allNodes.length <= mobileLimit) {
    return allNodes.map((n) => ({ ...n, parent_ids: [...(n.parent_ids || [])] }));
  }

  // Keep the latest `mobileLimit` commits so branch splits and merges remain visible
  const sliced = allNodes.slice(allNodes.length - mobileLimit);
  const validIds = new Set(sliced.map((n) => n.id));

  return sliced.map((node) => ({
    ...node,
    parent_ids: (node.parent_ids || []).filter((pid) => validIds.has(pid)),
  }));
}

/**
 * Pure helper: Compute 3D spatial coordinates and edges for the Git commit graph.
 * - `main` branch runs vertically along center (x = 0, z = 0)
 * - Side branch 1 (`feat/webgl-graph`) splits out to (-x, +z)
 * - Side branch 2 (`arch/state-tree`) splits out to (+x, -z)
 */
export function computeCommitGraphLayout(commitNodes, options = {}) {
  const {
    verticalStep = 0.56,
    branchOffsets = {
      main: { x: 0, z: 0 },
      'feat/webgl-graph': { x: -1.35, z: 0.7 },
      'arch/state-tree': { x: 1.35, z: -0.7 },
    },
    entranceDurationSec = CONFIG.animation.entranceDurationSec,
  } = options;

  const count = commitNodes.length;
  const totalHeight = Math.max(0, (count - 1) * verticalStep);
  const startY = -totalHeight / 2;

  const nodeMap = new Map();
  const positionedNodes = commitNodes.map((commit, index) => {
    const offset = branchOffsets[commit.branch] || { x: 1.2, z: 0.6 };
    const y = startY + index * verticalStep;
    // Slight deterministic depth wave on side branches for clearer 3D parallax
    const waveZ = commit.branch === 'main' ? 0 : Math.sin(index * 0.9) * 0.18;
    const position = {
      x: Number(offset.x.toFixed(3)),
      y: Number(y.toFixed(3)),
      z: Number((offset.z + waveZ).toFixed(3)),
    };

    const delaySec =
      count > 1
        ? Number(((index / (count - 1)) * (entranceDurationSec * 0.78)).toFixed(3))
        : 0;

    const item = {
      ...commit,
      index,
      isMain: commit.branch === 'main',
      position,
      delaySec,
    };
    nodeMap.set(commit.id, item);
    return item;
  });

  // Build directed parent -> child edges
  const edges = [];
  for (const node of positionedNodes) {
    for (const parentId of node.parent_ids || []) {
      const parentNode = nodeMap.get(parentId);
      if (parentNode) {
        // An edge uses the accent color if either endpoint belongs to a side branch
        const isSideEdge = !node.isMain || !parentNode.isMain;
        edges.push({
          id: `${parentNode.id}->${node.id}`,
          fromId: parentNode.id,
          toId: node.id,
          from: parentNode.position,
          to: node.position,
          isSideEdge,
          appearIndex: node.index,
          delaySec: node.delaySec,
        });
      }
    }
  }

  return {
    nodes: positionedNodes,
    edges,
  };
}

/**
 * Pure helper: Generate a 2D SVG string representation of the commit graph
 * using the exact same commit JSON data (used when WebGL fails to initialize).
 */
export function buildFallbackSvgMarkup(commitNodes, themeColors = CONFIG.colors.light) {
  const layout = computeCommitGraphLayout(commitNodes, { verticalStep: 1 });
  const width = 520;
  const height = 380;
  const padY = 38;
  const usableHeight = height - padY * 2;
  const count = Math.max(1, layout.nodes.length);

  const branchX = {
    main: width * 0.5,
    'feat/webgl-graph': width * 0.25,
    'arch/state-tree': width * 0.75,
  };

  const svgCoords = new Map();
  layout.nodes.forEach((node, idx) => {
    const cx = branchX[node.branch] ?? width * 0.68;
    // Render newest commits toward the top, oldest at the bottom
    const cy =
      count > 1
        ? height - padY - (idx / (count - 1)) * usableHeight
        : height / 2;
    svgCoords.set(node.id, { cx: Math.round(cx), cy: Math.round(cy), node });
  });

  const lineElements = layout.edges
    .map((edge) => {
      const p1 = svgCoords.get(edge.fromId);
      const p2 = svgCoords.get(edge.toId);
      if (!p1 || !p2) return '';
      const stroke = edge.isSideEdge ? themeColors.accent : themeColors.text;
      return `<line x1="${p1.cx}" y1="${p1.cy}" x2="${p2.cx}" y2="${p2.cy}" stroke="${stroke}" stroke-width="1.5" />`;
    })
    .join('\n      ');

  const nodeElements = Array.from(svgCoords.values())
    .map(({ cx, cy, node }) => {
      const fill = node.isMain ? themeColors.text : themeColors.accent;
      const labelX = cx + (node.branch === 'feat/webgl-graph' ? -12 : 12);
      const anchor = node.branch === 'feat/webgl-graph' ? 'end' : 'start';
      return `<g class="svg-commit-node" data-commit-id="${node.id}" tabindex="0" role="button" aria-label="Commit ${node.id}: ${node.message}">
        <circle cx="${cx}" cy="${cy}" r="5.5" fill="${fill}" stroke="${themeColors.bg}" stroke-width="1.5" />
        <text x="${labelX}" y="${cy + 4}" text-anchor="${anchor}" fill="${themeColors.muted}" font-family="'IBM Plex Mono', monospace" font-size="10">${node.id} · ${node.branch}</text>
      </g>`;
    })
    .join('\n      ');

  return `<svg class="fallback-svg" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="2D Git commit graph fallback">
      ${lineElements}
      ${nodeElements}
    </svg>`;
}

/* ==========================================================================
   DOM INITIALIZATION (Runs in Browser)
   ========================================================================== */

function initPortfolioUI() {
  const rootEl = document.documentElement;
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleText = document.getElementById('theme-toggle-text');
  const logListEl = document.getElementById('log-list');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const statusBadgeEl = document.getElementById('building-status-badge');
  const cycleStatusBtn = document.getElementById('cycle-status-btn');
  const libraryLink = document.getElementById('library-botchan-link');

  // 1. Theme State Management & Custom Event Broadcast for Three.js Sync
  let currentTheme = 'light';
  try {
    const saved = window.localStorage.getItem('botchan-theme');
    if (saved === 'dark' || saved === 'light') {
      currentTheme = saved;
    }
  } catch {
    currentTheme = 'light';
  }

  function applyTheme(themeName, notifyThreeJs = true) {
    currentTheme = themeName === 'dark' ? 'dark' : 'light';
    rootEl.setAttribute('data-theme', currentTheme);

    if (themeToggleText) {
      themeToggleText.textContent =
        currentTheme === 'dark' ? 'THEME: DARK' : 'THEME: LIGHT';
    }
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-pressed',
        currentTheme === 'dark' ? 'true' : 'false',
      );
      themeToggleBtn.setAttribute(
        'aria-label',
        currentTheme === 'dark'
          ? 'Switch to light theme'
          : 'Switch to dark theme',
      );
    }

    try {
      window.localStorage.setItem('botchan-theme', currentTheme);
    } catch {
      // Ignore storage errors in restricted iframes
    }

    if (notifyThreeJs) {
      const colors = getThemeColors(currentTheme);
      window.dispatchEvent(
        new CustomEvent('botchan:themechange', {
          detail: { theme: currentTheme, colors },
        }),
      );
    }
  }

  applyTheme(currentTheme, false);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(nextTheme, true);
    });
  }

  // 2. Render & Filter Section 02: Log Entries
  function renderLogEntries(activeTopic = 'all') {
    if (!logListEl) return;
    const filtered = filterLogEntries(CONFIG.logEntries, activeTopic);
    logListEl.innerHTML = filtered
      .map(
        (item) => `
      <li class="log-item" data-topic="${item.topic}">
        <time class="log-date mono-label" datetime="${item.date}">${item.date}</time>
        <span class="log-topic mono-label">${item.topicLabel}</span>
        <p class="log-text">${item.text}</p>
      </li>`,
      )
      .join('');
  }

  renderLogEntries('all');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const selectedTopic = btn.getAttribute('data-filter') || 'all';
      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderLogEntries(selectedTopic);
    });
  });

  // 3. Section 01: Now Building Status Badge Cycler ([learning / in progress / done])
  if (cycleStatusBtn && statusBadgeEl) {
    cycleStatusBtn.addEventListener('click', () => {
      const current = statusBadgeEl.getAttribute('data-status') || 'in progress';
      const next = getNextBuildingStatus(current, CONFIG.statusStates);
      statusBadgeEl.setAttribute('data-status', next);
      statusBadgeEl.textContent = `[${next}]`;
    });
  }

  // 4. Listen for Commit Selection Events from 3D Graph or SVG Fallback
  const inspectorBranch = document.getElementById('inspector-branch');
  const inspectorMessage = document.getElementById('inspector-message');
  const inspectorId = document.getElementById('inspector-id');
  const inspectorParents = document.getElementById('inspector-parents');
  const inspectorDate = document.getElementById('inspector-date');

  window.addEventListener('botchan:commitselect', (event) => {
    const commit = event.detail?.commit;
    if (!commit) return;

    if (inspectorBranch) {
      inspectorBranch.textContent = `BRANCH: ${commit.branch}`;
    }
    if (inspectorMessage) {
      inspectorMessage.textContent = commit.message;
    }
    if (inspectorId) {
      inspectorId.textContent = `COMMIT: ${commit.id}`;
    }
    if (inspectorParents) {
      const parentsText =
        commit.parent_ids && commit.parent_ids.length > 0
          ? commit.parent_ids.join(', ')
          : 'root (initial)';
      inspectorParents.textContent = `PARENTS: ${parentsText}`;
    }
    if (inspectorDate) {
      inspectorDate.textContent = commit.date;
    }

    // Sync active state on accessible commit buttons strip
    const nodeButtons = document.querySelectorAll('.node-chip-btn');
    nodeButtons.forEach((btn) => {
      const isMatch = btn.getAttribute('data-commit-id') === commit.id;
      btn.classList.toggle('is-selected', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  });

  // 5. Footer "Library ↔ Botchan" switch link smooth scroll & highlight
  if (libraryLink) {
    libraryLink.addEventListener('click', (e) => {
      e.preventDefault();
      const logSection = document.getElementById('log');
      if (logSection) {
        logSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioUI);
  } else {
    initPortfolioUI();
  }
}
