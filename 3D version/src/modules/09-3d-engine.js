// ============================================================================
// 9. CRYSTAL GEMS! 3D EDITION — REAL-TIME WEBGL 3D CEL-TOON ENGINE
// ============================================================================
(function () {
  if (typeof window === 'undefined') return;

  // --- Minimal 4x4 Matrix Math (Column-Major for WebGL) ---
  const M4 = {
    identity() {
      const m = new Float32Array(16);
      m[0] = m[5] = m[10] = m[15] = 1;
      return m;
    },
    perspective(fovRad, aspect, near, far) {
      const f = 1.0 / Math.tan(fovRad * 0.5);
      const nf = 1 / (near - far);
      const out = new Float32Array(16);
      out[0] = f / aspect;
      out[5] = f;
      out[10] = (far + near) * nf;
      out[11] = -1;
      out[14] = (2 * far * near) * nf;
      return out;
    },
    lookAt(eye, target, up) {
      let zx = eye[0] - target[0], zy = eye[1] - target[1], zz = eye[2] - target[2];
      let len = Math.hypot(zx, zy, zz) || 1;
      zx /= len; zy /= len; zz /= len;
      let xx = up[1] * zz - up[2] * zy;
      let xy = up[2] * zx - up[0] * zz;
      let xz = up[0] * zy - up[1] * zx;
      len = Math.hypot(xx, xy, xz) || 1;
      xx /= len; xy /= len; xz /= len;
      const yx = zy * xz - zz * xy;
      const yy = zz * xx - zx * xz;
      const yz = zx * xy - zy * xx;
      const out = new Float32Array(16);
      out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0;
      out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0;
      out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
      out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
      out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
      out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
      out[15] = 1;
      return out;
    },
    multiply(a, b) {
      const out = new Float32Array(16);
      for (let c = 0; c < 4; c++) {
        for (let r = 0; r < 4; r++) {
          out[c * 4 + r] =
            a[0 * 4 + r] * b[c * 4 + 0] +
            a[1 * 4 + r] * b[c * 4 + 1] +
            a[2 * 4 + r] * b[c * 4 + 2] +
            a[3 * 4 + r] * b[c * 4 + 3];
        }
      }
      return out;
    },
    trs(tx, ty, tz, rx, ry, rz, sx, sy, sz) {
      const cx = Math.cos(rx), sxr = Math.sin(rx);
      const cy = Math.cos(ry), syr = Math.sin(ry);
      const cz = Math.cos(rz), szr = Math.sin(rz);
      // R = Ry * Rx * Rz
      const r00 = cy * cz + syr * sxr * szr;
      const r01 = cz * syr * sxr - cy * szr;
      const r02 = cx * syr;
      const r10 = cx * szr;
      const r11 = cx * cz;
      const r12 = -sxr;
      const r20 = cy * sxr * szr - cz * syr;
      const r21 = syr * szr + cy * cz * sxr;
      const r22 = cx * cy;
      const out = new Float32Array(16);
      out[0] = r00 * sx; out[1] = r10 * sx; out[2] = r20 * sx; out[3] = 0;
      out[4] = r01 * sy; out[5] = r11 * sy; out[6] = r21 * sy; out[7] = 0;
      out[8] = r02 * sz; out[9] = r12 * sz; out[10] = r22 * sz; out[11] = 0;
      out[12] = tx;      out[13] = ty;      out[14] = tz;      out[15] = 1;
      return out;
    }
  };

  function hexToRgb(hex) {
    if (!hex || typeof hex !== 'string') return [0.95, 0.45, 0.72];
    const h = hex.replace('#', '');
    if (h.length === 3) {
      return [
        parseInt(h[0] + h[0], 16) / 255,
        parseInt(h[1] + h[1], 16) / 255,
        parseInt(h[2] + h[2], 16) / 255
      ];
    }
    if (h.length >= 6) {
      return [
        parseInt(h.slice(0, 2), 16) / 255,
        parseInt(h.slice(2, 4), 16) / 255,
        parseInt(h.slice(4, 6), 16) / 255
      ];
    }
    return [0.95, 0.45, 0.72];
  }

  // --- Procedural 3D Geometry Generators ---
  function createCubeData() {
    const p = [], n = [], idx = [];
    const faces = [
      [[0, 0, 1],  [-0.5,-0.5,0.5], [0.5,-0.5,0.5], [0.5,0.5,0.5], [-0.5,0.5,0.5]],
      [[0, 0,-1],  [0.5,-0.5,-0.5], [-0.5,-0.5,-0.5], [-0.5,0.5,-0.5], [0.5,0.5,-0.5]],
      [[0, 1, 0],  [-0.5,0.5,0.5], [0.5,0.5,0.5], [0.5,0.5,-0.5], [-0.5,0.5,-0.5]],
      [[0,-1, 0],  [-0.5,-0.5,-0.5], [0.5,-0.5,-0.5], [0.5,-0.5,0.5], [-0.5,-0.5,0.5]],
      [[1, 0, 0],  [0.5,-0.5,0.5], [0.5,-0.5,-0.5], [0.5,0.5,-0.5], [0.5,0.5,0.5]],
      [[-1, 0, 0], [-0.5,-0.5,-0.5], [-0.5,-0.5,0.5], [-0.5,0.5,0.5], [-0.5,0.5,-0.5]]
    ];
    let v = 0;
    for (const f of faces) {
      const norm = f[0];
      for (let i = 1; i <= 4; i++) {
        p.push(f[i][0], f[i][1], f[i][2]);
        n.push(norm[0], norm[1], norm[2]);
      }
      idx.push(v, v + 1, v + 2, v, v + 2, v + 3);
      v += 4;
    }
    return { pos: new Float32Array(p), norm: new Float32Array(n), idx: new Uint16Array(idx) };
  }

  function createSphereData(lat = 12, lon = 16) {
    const p = [], n = [], idx = [];
    for (let y = 0; y <= lat; y++) {
      const theta = (y * Math.PI) / lat;
      const st = Math.sin(theta), ct = Math.cos(theta);
      for (let x = 0; x <= lon; x++) {
        const phi = (x * 2 * Math.PI) / lon;
        const nx = st * Math.cos(phi), ny = ct, nz = st * Math.sin(phi);
        p.push(nx * 0.5, ny * 0.5, nz * 0.5);
        n.push(nx, ny, nz);
      }
    }
    for (let y = 0; y < lat; y++) {
      for (let x = 0; x < lon; x++) {
        const a = y * (lon + 1) + x;
        const b = a + lon + 1;
        idx.push(a, a + 1, b, b, a + 1, b + 1);
      }
    }
    return { pos: new Float32Array(p), norm: new Float32Array(n), idx: new Uint16Array(idx) };
  }

  function createCylinderData(seg = 14) {
    const p = [], n = [], idx = [];
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      const ca = Math.cos(a), sa = Math.sin(a);
      p.push(ca * 0.5, -0.5, sa * 0.5, ca * 0.5, 0.5, sa * 0.5);
      n.push(ca, 0, sa, ca, 0, sa);
    }
    for (let i = 0; i < seg; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
    // Top & bottom caps
    const topC = p.length / 3;
    p.push(0, 0.5, 0); n.push(0, 1, 0);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      p.push(Math.cos(a) * 0.5, 0.5, Math.sin(a) * 0.5);
      n.push(0, 1, 0);
    }
    for (let i = 0; i < seg; i++) idx.push(topC, topC + 1 + i + 1, topC + 1 + i);

    const botC = p.length / 3;
    p.push(0, -0.5, 0); n.push(0, -1, 0);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      p.push(Math.cos(a) * 0.5, -0.5, Math.sin(a) * 0.5);
      n.push(0, -1, 0);
    }
    for (let i = 0; i < seg; i++) idx.push(botC, botC + 1 + i, botC + 1 + i + 1);
    return { pos: new Float32Array(p), norm: new Float32Array(n), idx: new Uint16Array(idx) };
  }

  function createConeData(seg = 14) {
    const p = [], n = [], idx = [];
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      const ca = Math.cos(a), sa = Math.sin(a);
      p.push(ca * 0.5, -0.5, sa * 0.5, 0, 0.5, 0);
      const ny = 0.45, l = Math.hypot(ca, ny, sa);
      n.push(ca / l, ny / l, sa / l, ca / l, ny / l, sa / l);
    }
    for (let i = 0; i < seg; i++) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2);
    }
    const botC = p.length / 3;
    p.push(0, -0.5, 0); n.push(0, -1, 0);
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      p.push(Math.cos(a) * 0.5, -0.5, Math.sin(a) * 0.5);
      n.push(0, -1, 0);
    }
    for (let i = 0; i < seg; i++) idx.push(botC, botC + 1 + i, botC + 1 + i + 1);
    return { pos: new Float32Array(p), norm: new Float32Array(n), idx: new Uint16Array(idx) };
  }

  function createGemData() {
    // Faceted 3D Octahedron Gemstone
    const verts = [
      [0, 0.65, 0], [0.5, 0, 0], [0, 0, 0.5], [-0.5, 0, 0], [0, 0, -0.5], [0, -0.65, 0]
    ];
    const tris = [
      [0,2,1],[0,3,2],[0,4,3],[0,1,4],
      [5,1,2],[5,2,3],[5,3,4],[5,4,1]
    ];
    const p = [], n = [], idx = [];
    let c = 0;
    for (const t of tris) {
      const a = verts[t[0]], b = verts[t[1]], d = verts[t[2]];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
      const vx = d[0] - a[0], vy = d[1] - a[1], vz = d[2] - a[2];
      let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      const l = Math.hypot(nx, ny, nz) || 1;
      nx /= l; ny /= l; nz /= l;
      for (const k of [a, b, d]) {
        p.push(k[0], k[1], k[2]);
        n.push(nx, ny, nz);
      }
      idx.push(c, c + 1, c + 2);
      c += 3;
    }
    return { pos: new Float32Array(p), norm: new Float32Array(n), idx: new Uint16Array(idx) };
  }

  function createTorusData(R = 0.5, r = 0.11, segR = 20, segr = 10) {
    const p = [], n = [], idx = [];
    for (let i = 0; i <= segR; i++) {
      const u = (i / segR) * Math.PI * 2;
      const cu = Math.cos(u), su = Math.sin(u);
      for (let j = 0; j <= segr; j++) {
        const v = (j / segr) * Math.PI * 2;
        const cv = Math.cos(v), sv = Math.sin(v);
        const x = (R + r * cv) * cu;
        const y = r * sv;
        const z = (R + r * cv) * su;
        p.push(x, y, z);
        n.push(cv * cu, sv, cv * su);
      }
    }
    for (let i = 0; i < segR; i++) {
      for (let j = 0; j < segr; j++) {
        const a = i * (segr + 1) + j;
        const b = a + segr + 1;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
    }
    return { pos: new Float32Array(p), norm: new Float32Array(n), idx: new Uint16Array(idx) };
  }

  // --- Character 3D Visual Palettes & Proportions ---
  const HERO_3D_STYLE = {
    steven:   { skin: '#fde0d7', hair: '#26151c', top: '#f472b6', inner: '#18181b', pants: '#2563eb', boot: '#ef4444', gem: '#ff6097', accent: '#fde047', h: 1.0,  w: 1.05, hairType: 'cloud',  weapon: 'shield' },
    garnet:   { skin: '#9d3b7d', hair: '#231126', top: '#f43f8e', inner: '#1e1b5e', pants: '#0f0a3c', boot: '#ec4899', gem: '#ef4444', accent: '#fbbf24', h: 1.38, w: 1.15, hairType: 'afro',   weapon: 'gauntlets' },
    amethyst: { skin: '#b895d1', hair: '#dcd4ef', top: '#18181b', inner: '#9333ea', pants: '#475569', boot: '#f8fafc', gem: '#a855f7', accent: '#c084fc', h: 0.96, w: 1.08, hairType: 'mane',   weapon: 'whip' },
    pearl:    { skin: '#f5f4e6', hair: '#f8c6b3', top: '#7bd2c4', inner: '#67e8f9', pants: '#f2bf6d', boot: '#99f6e4', gem: '#ffffff', accent: '#22d3ee', h: 1.24, w: 0.78, hairType: 'point',  weapon: 'spear' },
    bismuth:  { skin: '#8ba0cb', hair: '#f472b6', top: '#7b2059', inner: '#facc15', pants: '#7b2059', boot: '#23141c', gem: '#22d3ee', accent: '#f97316', h: 1.28, w: 1.48, hairType: 'dreads', weapon: 'hammer' },
    peridot:  { skin: '#76e065', hair: '#eef79c', top: '#14532d', inner: '#fef08a', pants: '#16a34a', boot: '#fef08a', gem: '#4ade80', accent: '#a3e635', h: 0.96, w: 0.88, hairType: 'dorito', weapon: 'shards' },
    lapis:    { skin: '#38c6f4', hair: '#1d63c6', top: '#1e64c8', inner: '#0b1c48', pants: '#1e64c8', boot: '#38c6f4', gem: '#0284c7', accent: '#bae6fd', h: 1.18, w: 0.84, hairType: 'bob',    weapon: 'wings' },
    rose:     { skin: '#fce4ec', hair: '#f59bc0', top: '#fffbeb', inner: '#fce7f3', pants: '#fce7f3', boot: '#f59bc0', gem: '#f43f5e', accent: '#fbcfe8', h: 1.34, w: 1.25, hairType: 'curls',  weapon: 'swordShield' },
    connie:   { skin: '#8d4e31', hair: '#1e1114', top: '#f8fafc', inner: '#cbd5e1', pants: '#64748b', boot: '#fb7185', gem: '#f472b6', accent: '#ec4899', h: 1.04, w: 0.86, hairType: 'long',   weapon: 'sword' },
    jasper:   { skin: '#f59e42', hair: '#fce7dc', top: '#882d2d', inner: '#f7c5a8', pants: '#2b1a19', boot: '#7f2424', gem: '#ea580c', accent: '#14b8a6', h: 1.40, w: 1.38, hairType: 'spiky',  weapon: 'helmet' }
  };

  const FUSION_3D_STYLE = {
    stevonnie:      { skin: '#d4976a', hair: '#1c1216', top: '#f43f5e', pants: '#2563eb', boot: '#d4976a', gem: '#f472b6', accent: '#fde047', h: 1.36, w: 1.05, weapon: 'swordShield' },
    smoky:          { skin: '#8b797d', hair: '#291c19', top: '#18181b', pants: '#2563eb', boot: '#f8fafc', gem: '#a855f7', accent: '#fb923c', h: 1.38, w: 1.25, weapon: 'yoyo' },
    rainbow2:       { skin: '#fde2e4', hair: '#ddd6fe', top: '#5eead4', pants: '#2563eb', boot: '#f472b6', gem: '#38bdf8', accent: '#fde047', h: 1.36, w: 0.92, weapon: 'spear' },
    sunstone:       { skin: '#f97316', hair: '#fde047', top: '#ec4899', pants: '#2563eb', boot: '#f43f5e', gem: '#facc15', accent: '#ea580c', h: 1.44, w: 1.35, weapon: 'gauntlets' },
    sugilite:       { skin: '#6b21a8', hair: '#1e102d', top: '#312e81', pants: '#1e1b4b', boot: '#4c1d95', gem: '#a855f7', accent: '#38bdf8', h: 1.62, w: 1.52, weapon: 'hammer' },
    sardonyx:       { skin: '#be123c', hair: '#fdba74', top: '#0f172a', pants: '#6b0f26', boot: '#0f172a', gem: '#fb7185', accent: '#fde047', h: 1.58, w: 1.08, weapon: 'hammer' },
    opal:           { skin: '#ddd6fe', hair: '#fef9c3', top: '#5eead4', pants: '#6b4c7a', boot: '#fef08a', gem: '#818cf8', accent: '#67e8f9', h: 1.56, w: 0.94, weapon: 'spear' },
    malachite:      { skin: '#2dd4bf', hair: '#a7f3d0', top: '#065f46', pants: '#0f766e', boot: '#064e3b', gem: '#ea580c', accent: '#38bdf8', h: 1.66, w: 1.55, weapon: 'wings' },
    rainbowClassic: { skin: '#fed7aa', hair: '#fde68a', top: '#f8fafc', pants: '#f472b6', boot: '#ec4899', gem: '#e879f9', accent: '#67e8f9', h: 1.48, w: 1.04, weapon: 'sword' }
  };

  // Episode 3D Atmosphere Themes
  const STAGE_3D_THEMES = [
    { sky: [0.16, 0.24, 0.45], floor: '#e2c598', accent: '#38bdf8', pillar: '#475569', water: '#0284c7', name: 'Beach City Boardwalk' },
    { sky: [0.22, 0.14, 0.34], floor: '#4c1d95', accent: '#f472b6', pillar: '#6d28d9', water: '#1e1b4b', name: 'Crystal Temple Sanctuary' },
    { sky: [0.28, 0.12, 0.16], floor: '#5c2b29', accent: '#fb923c', pillar: '#7f1d1d', water: '#450a0a', name: 'Prime Kindergarten' },
    { sky: [0.12, 0.28, 0.46], floor: '#cbd5e1', accent: '#67e8f9', pillar: '#f8fafc', water: '#0ea5e9', name: 'Ancient Sky Arena' },
    { sky: [0.26, 0.10, 0.08], floor: '#334155', accent: '#f97316', pillar: '#475569', water: '#ea580c', name: "Bismuth's Molten Forge" },
    { sky: [0.08, 0.18, 0.34], floor: '#bae6fd', accent: '#38bdf8', pillar: '#e0f2fe', water: '#0369a1', name: 'Frozen Spire Tundra' },
    { sky: [0.10, 0.22, 0.18], floor: '#1e293b', accent: '#4ade80', pillar: '#0f766e', water: '#064e3b', name: 'Homeworld Warship Deck' },
    { sky: [0.18, 0.10, 0.28], floor: '#312e81', accent: '#c084fc', pillar: '#4c1d95', water: '#1e1b4b', name: 'Diamond Galaxy Warp' },
    { sky: [0.26, 0.20, 0.32], floor: '#e2e8f0', accent: '#f472b6', pillar: '#f8fafc', water: '#94a3b8', name: 'Homeworld Ballroom' },
    { sky: [0.14, 0.14, 0.22], floor: '#f8fafc', accent: '#e2e8f0', pillar: '#ffffff', water: '#cbd5e1', name: "White Diamond's Throne" }
  ];

  class Crystal3DEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.gl = null;
      this.ctx2d = null;
      this.isSoftware3D = false;
      this.ready = false;
      this.camMode = 0; // 0: Dynamic 3D Side, 1: 3D Isometric Angle, 2: 3D Hero Close-Up
      this.camNames = ['3D ACTION', '3D ISOMETRIC', '3D DRAMATIC'];
      this.meshes = {};
      this.rawMeshes = {
        cube: createCubeData(),
        sphere: createSphereData(8, 12),
        cylinder: createCylinderData(10),
        cone: createConeData(10),
        gem: createGemData(),
        torus: createTorusData(0.5, 0.12, 14, 7)
      };
      this.triQueue = [];
      this.projMat = M4.identity();
      this.viewMat = M4.identity();
      this.vpMat = M4.identity();
      this.camPos = [0, 4, 15];
      this.initGL();
    }

    initGL() {
      if (!this.canvas) return;
      try {
        const gl = this.canvas.getContext('webgl', { antialias: true, alpha: false, preserveDrawingBuffer: true })
          || this.canvas.getContext('experimental-webgl', { antialias: true, alpha: false, preserveDrawingBuffer: true });
        if (!gl) {
          // Graceful Software 3D Perspective Rasterizer fallback (works 100% everywhere!)
          this.ctx2d = this.canvas.getContext('2d');
          if (this.ctx2d) {
            this.isSoftware3D = true;
            this.ready = true;
          }
          return;
        }
        this.gl = gl;

        const vsSrc = `
          attribute vec3 aPos;
          attribute vec3 aNorm;
          uniform mat4 uModel;
          uniform mat4 uVP;
          varying vec3 vNorm;
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = uModel * vec4(aPos, 1.0);
            vWorldPos = wp.xyz;
            vNorm = normalize(mat3(uModel) * aNorm);
            gl_Position = uVP * wp;
          }
        `;
        const fsSrc = `
          precision mediump float;
          varying vec3 vNorm;
          varying vec3 vWorldPos;
          uniform vec3 uColor;
          uniform vec3 uEmissive;
          uniform vec3 uCamPos;
          uniform float uAlpha;
          void main() {
            vec3 N = normalize(vNorm);
            vec3 L = normalize(vec3(0.45, 0.85, 0.65));
            vec3 V = normalize(uCamPos - vWorldPos);
            float ndl = dot(N, L);
            // Smooth 3-band Cel-Toon Shading
            float toon = ndl > 0.55 ? 1.08 : (ndl > 0.10 ? 0.84 : 0.54);
            float rim = pow(1.0 - max(dot(N, V), 0.0), 2.6) * 0.42;
            vec3 shadowTint = vec3(0.14, 0.10, 0.24) * (1.0 - toon) * 0.45;
            vec3 col = uColor * toon + shadowTint + vec3(1.0, 0.94, 0.98) * rim + uEmissive;
            gl_FragColor = vec4(col, uAlpha);
          }
        `;

        const compile = (type, src) => {
          const s = gl.createShader(type);
          gl.shaderSource(s, src);
          gl.compileShader(s);
          if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
            console.warn('3D Shader error:', gl.getShaderInfoLog(s));
            return null;
          }
          return s;
        };
        const vs = compile(gl.VERTEX_SHADER, vsSrc);
        const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
        if (!vs || !fs) return;
        const prog = gl.createProgram();
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        this.prog = prog;

        this.loc = {
          aPos: gl.getAttribLocation(prog, 'aPos'),
          aNorm: gl.getAttribLocation(prog, 'aNorm'),
          uModel: gl.getUniformLocation(prog, 'uModel'),
          uVP: gl.getUniformLocation(prog, 'uVP'),
          uColor: gl.getUniformLocation(prog, 'uColor'),
          uEmissive: gl.getUniformLocation(prog, 'uEmissive'),
          uCamPos: gl.getUniformLocation(prog, 'uCamPos'),
          uAlpha: gl.getUniformLocation(prog, 'uAlpha')
        };

        const upload = (d) => {
          const vb = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, vb);
          gl.bufferData(gl.ARRAY_BUFFER, d.pos, gl.STATIC_DRAW);
          const nb = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, nb);
          gl.bufferData(gl.ARRAY_BUFFER, d.norm, gl.STATIC_DRAW);
          const ib = gl.createBuffer();
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
          gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, d.idx, gl.STATIC_DRAW);
          return { vb, nb, ib, count: d.idx.length };
        };

        this.meshes.cube = upload(createCubeData());
        this.meshes.sphere = upload(createSphereData(12, 16));
        this.meshes.cylinder = upload(createCylinderData(14));
        this.meshes.cone = upload(createConeData(14));
        this.meshes.gem = upload(createGemData());
        this.meshes.torus = upload(createTorusData(0.5, 0.11, 20, 10));

        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.ready = true;
      } catch (e) {
        this.ready = false;
      }
    }

    cycleCamera() {
      this.camMode = (this.camMode + 1) % this.camNames.length;
      const btn = document.getElementById('cam3dBtn');
      if (btn) btn.textContent = `🎥 ${this.camNames[this.camMode]} [V]`;
      return this.camNames[this.camMode];
    }

    drawMesh(name, tx, ty, tz, rx, ry, rz, sx, sy, sz, colorHex, emissiveHex = null, alpha = 1.0) {
      const model = M4.trs(tx, ty, tz, rx, ry, rz, sx, sy, sz);
      const c = Array.isArray(colorHex) ? colorHex : hexToRgb(colorHex);

      // Software 3D Perspective Triangle Queue (identical 3D camera & cel-toon lighting!)
      if (this.isSoftware3D) {
        const raw = this.rawMeshes[name];
        if (!raw) return;
        const mvp = M4.multiply(this.vpMat, model);
        const W = this.canvas.width, H = this.canvas.height;
        const pos = raw.pos, idx = raw.idx;
        const em = emissiveHex ? (Array.isArray(emissiveHex) ? emissiveHex : hexToRgb(emissiveHex)) : null;
        const m = model;
        const lx = 0.42, ly = 0.78, lz = 0.46;

        for (let i = 0; i < idx.length; i += 3) {
          const i0 = idx[i] * 3, i1 = idx[i + 1] * 3, i2 = idx[i + 2] * 3;
          const v0x = pos[i0], v0y = pos[i0 + 1], v0z = pos[i0 + 2];
          const v1x = pos[i1], v1y = pos[i1 + 1], v1z = pos[i1 + 2];
          const v2x = pos[i2], v2y = pos[i2 + 1], v2z = pos[i2 + 2];

          // Clip-space projection
          const proj = (x, y, z) => {
            const cx = mvp[0]*x + mvp[4]*y + mvp[8]*z + mvp[12];
            const cy = mvp[1]*x + mvp[5]*y + mvp[9]*z + mvp[13];
            const cz = mvp[2]*x + mvp[6]*y + mvp[10]*z + mvp[14];
            const cw = mvp[3]*x + mvp[7]*y + mvp[11]*z + mvp[15];
            return [cx, cy, cz, cw];
          };
          const p0 = proj(v0x, v0y, v0z);
          const p1 = proj(v1x, v1y, v1z);
          const p2 = proj(v2x, v2y, v2z);
          if (p0[3] <= 0.25 || p1[3] <= 0.25 || p2[3] <= 0.25) continue;

          const x0 = (p0[0] / p0[3] * 0.5 + 0.5) * W, y0 = (0.5 - p0[1] / p0[3] * 0.5) * H;
          const x1 = (p1[0] / p1[3] * 0.5 + 0.5) * W, y1 = (0.5 - p1[1] / p1[3] * 0.5) * H;
          const x2 = (p2[0] / p2[3] * 0.5 + 0.5) * W, y2 = (0.5 - p2[1] / p2[3] * 0.5) * H;

          // Backface cull in screen space
          const cross = (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
          if (cross >= 0) continue;

          // World-space face normal for cel-toon lighting
          const wx0 = m[0]*v0x + m[4]*v0y + m[8]*v0z;
          const wy0 = m[1]*v0x + m[5]*v0y + m[9]*v0z;
          const wz0 = m[2]*v0x + m[6]*v0y + m[10]*v0z;
          const ux = (m[0]*v1x + m[4]*v1y + m[8]*v1z) - wx0;
          const uy = (m[1]*v1x + m[5]*v1y + m[9]*v1z) - wy0;
          const uz = (m[2]*v1x + m[6]*v1y + m[10]*v1z) - wz0;
          const vx = (m[0]*v2x + m[4]*v2y + m[8]*v2z) - wx0;
          const vy = (m[1]*v2x + m[5]*v2y + m[9]*v2z) - wy0;
          const vz = (m[2]*v2x + m[6]*v2y + m[10]*v2z) - wz0;
          let nx = uy*vz - uz*vy, ny = uz*vx - ux*vz, nz = ux*vy - uy*vx;
          const nl = Math.hypot(nx, ny, nz) || 1;
          const ndl = (nx*lx + ny*ly + nz*lz) / nl;
          const toon = ndl > 0.50 ? 1.08 : (ndl > 0.08 ? 0.86 : 0.58);
          const r = Math.min(255, Math.round((c[0] * toon + (em ? em[0] * 0.42 : 0)) * 255));
          const g = Math.min(255, Math.round((c[1] * toon + (em ? em[1] * 0.42 : 0)) * 255));
          const b = Math.min(255, Math.round((c[2] * toon + (em ? em[2] * 0.42 : 0)) * 255));
          const depth = (p0[2] / p0[3] + p1[2] / p1[3] + p2[2] / p2[3]) / 3;
          this.triQueue.push({ x0, y0, x1, y1, x2, y2, depth, fill: `rgba(${r},${g},${b},${alpha})` });
        }
        return;
      }

      const gl = this.gl;
      const m = this.meshes[name];
      if (!m) return;
      gl.uniformMatrix4fv(this.loc.uModel, false, model);
      gl.uniform3f(this.loc.uColor, c[0], c[1], c[2]);
      if (emissiveHex) {
        const e = Array.isArray(emissiveHex) ? emissiveHex : hexToRgb(emissiveHex);
        gl.uniform3f(this.loc.uEmissive, e[0] * 0.55, e[1] * 0.55, e[2] * 0.55);
      } else {
        gl.uniform3f(this.loc.uEmissive, 0, 0, 0);
      }
      gl.uniform1f(this.loc.uAlpha, alpha);

      gl.bindBuffer(gl.ARRAY_BUFFER, m.vb);
      gl.enableVertexAttribArray(this.loc.aPos);
      gl.vertexAttribPointer(this.loc.aPos, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, m.nb);
      gl.enableVertexAttribArray(this.loc.aNorm);
      gl.vertexAttribPointer(this.loc.aNorm, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.ib);
      gl.drawElements(gl.TRIANGLES, m.count, gl.UNSIGNED_SHORT, 0);
    }

    flushSoftware3D() {
      if (!this.isSoftware3D || !this.ctx2d) return;
      const ctx = this.ctx2d;
      this.triQueue.sort((a, b) => b.depth - a.depth);
      ctx.lineWidth = 0.75;
      ctx.lineJoin = 'round';
      for (let i = 0; i < this.triQueue.length; i++) {
        const tr = this.triQueue[i];
        ctx.fillStyle = tr.fill;
        ctx.strokeStyle = tr.fill;
        ctx.beginPath();
        ctx.moveTo(tr.x0, tr.y0);
        ctx.lineTo(tr.x1, tr.y1);
        ctx.lineTo(tr.x2, tr.y2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      this.triQueue.length = 0;
    }

    renderWorld(game, shakeX = 0, shakeY = 0) {
      if (!this.ready || !game) return false;
      const W = this.canvas.width;
      const H = this.canvas.height;
      const stageIdx = Math.max(0, Math.min(STAGE_3D_THEMES.length - 1, game.stageIndex || 0));
      const theme = STAGE_3D_THEMES[stageIdx];

      if (this.isSoftware3D) {
        this.triQueue.length = 0;
        const ctx = this.ctx2d;
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, `rgb(${Math.round(theme.sky[0]*255)},${Math.round(theme.sky[1]*255)},${Math.round(theme.sky[2]*255)})`);
        grad.addColorStop(1, `rgb(${Math.round(theme.sky[0]*155+30)},${Math.round(theme.sky[1]*155+25)},${Math.round(theme.sky[2]*155+50)})`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      } else {
        const gl = this.gl;
        gl.viewport(0, 0, W, H);
        gl.clearColor(theme.sky[0], theme.sky[1], theme.sky[2], 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.prog);
      }

      const S = 1 / 50; // 50px = 1.0 3D unit
      const groundY = (game.player && game.player.groundY) || 580;
      const camCenterX = ((game.cameraX || 0) + W * 0.5) * S;
      const zoom = game.cameraZoom || 1.0;
      const t = performance.now() / 1000;

      // 3D Camera Modes
      let eye, target;
      if (this.camMode === 1) {
        // 3D Isometric Diorama View
        eye = [camCenterX - 3.6 + shakeX * 0.02, 7.2 + shakeY * 0.02, 14.5 / zoom];
        target = [camCenterX, 2.2, -0.4];
      } else if (this.camMode === 2) {
        // 3D Dramatic Low-Angle Hero Follow
        const px = (game.player ? game.player.x : 640) * S;
        const py = (game.player ? (groundY - game.player.y) : 0) * S;
        eye = [px - (game.player?.facing || 1) * 2.5 + shakeX * 0.02, 3.4 + py * 0.5 + shakeY * 0.02, 11.2 / zoom];
        target = [px + (game.player?.facing || 1) * 1.4, 2.0 + py * 0.6, 0];
      } else {
        // 3D Action Side-Perspective (matches 2D screen coordinates closely!)
        eye = [camCenterX + shakeX * 0.02, 4.2 + shakeY * 0.02, 15.8 / zoom];
        target = [camCenterX, 2.6, 0];
      }
      this.camPos = eye;
      this.projMat = M4.perspective(0.72, W / H, 0.2, 140.0);
      this.viewMat = M4.lookAt(eye, target, [0, 1, 0]);
      this.vpMat = M4.multiply(this.projMat, this.viewMat);

      if (!this.isSoftware3D) {
        this.gl.uniformMatrix4fv(this.loc.uVP, false, this.vpMat);
        this.gl.uniform3f(this.loc.uCamPos, eye[0], eye[1], eye[2]);
      }

      // 1. 3D Stage Ground Deck & Ocean/Lava Horizon
      const stageW = ((game.player && game.player.stageWidth) || 2600) * S;
      this.drawMesh('cube', stageW * 0.5, -0.5, 0, 0, 0, 0, stageW + 18, 1.0, 6.2, theme.floor);
      // Glowing front battle-lane bevel rail
      this.drawMesh('cube', stageW * 0.5, -0.02, 3.15, 0, 0, 0, stageW + 18, 0.16, 0.22, theme.accent, theme.accent);
      // Distant 3D Ocean / Abyss plane with gentle wave bob
      const waveY = -1.2 + Math.sin(t * 1.8) * 0.12;
      this.drawMesh('cube', stageW * 0.5, waveY, -16, 0, 0, 0, stageW + 40, 0.4, 28, theme.water);

      // 2. 3D Background Architecture: Warp Pad, Temple Pillars & Floating Crystals
      for (let x = 2; x < stageW + 4; x += 6.5) {
        const idx = Math.floor(x);
        const pH = 4.5 + (idx % 3) * 1.8;
        this.drawMesh('cylinder', x, pH * 0.5 - 0.5, -5.2, 0, 0, 0, 0.9, pH, 0.9, theme.pillar);
        this.drawMesh('cube', x, pH - 0.3, -5.2, 0, 0, 0, 1.35, 0.35, 1.35, theme.accent);
        // Floating glowing crystal shard above every second pillar
        if (idx % 2 === 0) {
          this.drawMesh('gem', x, pH + 1.1 + Math.sin(t * 2.2 + x) * 0.25, -5.2, 0, t * 1.4 + x, 0, 0.7, 1.0, 0.7, theme.accent, theme.accent);
        }
      }
      // Iconic Glowing 3D Crystal Warp Pad near start of stage
      this.drawMesh('cylinder', 4.5, 0.08, -1.6, 0, 0, 0, 2.8, 0.18, 2.8, '#38bdf8', '#0284c7');
      this.drawMesh('torus', 4.5, 0.22, -1.6, 0, t * 0.8, 0, 2.6, 0.6, 2.6, '#bae6fd', '#67e8f9', 0.8);

      // 3. 3D Floating Platforms (with real 3D bevel & underside glow)
      const plats = (game.environment && game.environment.getPlatforms)
        ? game.environment.getPlatforms(stageIdx, game.gameMode === 'practice')
        : [];
      for (const pl of plats) {
        const pw = pl.width * S;
        const px = (pl.x + pl.width * 0.5) * S;
        const py = (groundY - pl.y) * S;
        this.drawMesh('cube', px, py - 0.18, 0, 0, 0, 0, pw, 0.36, 2.4, theme.pillar);
        this.drawMesh('cube', px, py + 0.02, 0, 0, 0, 0, pw + 0.08, 0.08, 2.5, theme.accent, theme.accent);
      }

      // 4. 3D Pickups (Spinning Cookie Cats & Hearts!)
      if (game.pickups) {
        for (const p of game.pickups) {
          const px = p.x * S;
          const py = (groundY - p.y) * S + 0.45 + Math.sin(t * 4.5 + px) * 0.14;
          if (p.type === 'cookie') {
            this.drawMesh('cylinder', px, py, 0, Math.PI * 0.5, t * 2.4, 0, 0.55, 0.24, 0.55, '#451a03');
            this.drawMesh('cylinder', px, py, 0, Math.PI * 0.5, t * 2.4, 0, 0.48, 0.28, 0.48, '#f9a8d4', '#f472b6');
          } else {
            this.drawMesh('gem', px, py, 0, 0, t * 3.0, 0, 0.45, 0.65, 0.45, '#f43f5e', '#f43f5e');
          }
        }
      }

      // 5. 3D Enemies, Corrupted Gems & Phase-2 Bosses
      if (game.enemyManager && game.enemyManager.enemies) {
        for (const e of game.enemyManager.enemies) {
          if (e.isPoofed) continue;
          this.drawEnemy3D(e, groundY, S, t);
        }
      }

      // 6. 3D Players (P1 & P2, including all 10 Guardians & 9 Canon Fusions!)
      if (game.player && !game.player.isMergedInFusion) {
        this.drawHero3D(game.player, groundY, S, t);
      }
      if (game.playerMode === '2p' && game.player2 && !game.player2.isMergedInFusion) {
        this.drawHero3D(game.player2, groundY, S, t);
      }

      // 7. 3D Projectiles & Combat Skill VFX
      if (game.projectiles) {
        for (const p of game.projectiles) {
          this.drawProjectile3D(p, groundY, S, t);
        }
      }

      if (this.isSoftware3D) this.flushSoftware3D();
      return true;
    }

    drawHero3D(hero, groundY, S, t) {
      const px = hero.x * S;
      const py = (groundY - hero.y) * S;
      const dir = hero.facing || 1;
      const isFusion = !!(hero.isFusion && hero.fusionData);
      const id = isFusion ? hero.fusionData.id : hero.activeChar;
      const st = isFusion
        ? (FUSION_3D_STYLE[id] || FUSION_3D_STYLE.stevonnie)
        : (HERO_3D_STYLE[id] || HERO_3D_STYLE.steven);

      const isPinkConnie = (!isFusion && id === 'connie' && hero.isPinkRevived);
      const isOd = !!hero.isPinkOverdrive;
      const skinCol = isPinkConnie ? '#f9a8d4' : (isOd && id === 'steven' ? '#ff6097' : st.skin);
      const hairCol = isPinkConnie ? '#f472b6' : st.hair;
      const h = st.h;
      const w = st.w;

      // Ground contact shadow disc
      this.drawMesh('cylinder', px, 0.03, 0, 0, 0, 0, 1.15 * w, 0.04, 0.85 * w, '#090714', null, 0.45);

      // Spin-Dash 3D Buzzsaw Ball (Amethyst / Jasper)
      if (hero.isSpinDashing) {
        const spinCol = id === 'jasper' ? '#ea580c' : '#9333ea';
        this.drawMesh('sphere', px, py + 0.65, 0, t * 18, 0, -t * 22 * dir, 1.25, 1.25, 1.25, spinCol, spinCol);
        this.drawMesh('torus', px, py + 0.65, 0, Math.PI * 0.5, 0, t * 15, 1.5, 0.5, 1.5, '#fde047', '#fde047', 0.85);
        return;
      }

      const moving = Math.abs(hero.vx || 0) > 20;
      const stride = moving ? Math.sin((hero.walkAnim || 0) * 1.1) * 0.55 : 0;
      const bob = moving ? Math.abs(Math.sin((hero.walkAnim || 0) * 1.1)) * 0.08 : Math.sin(t * 3.4) * 0.04;
      const atkSwing = hero.isAttacking ? Math.sin(((hero.actionTimer || 0) / Math.max(0.1, hero.actionDuration || 0.25)) * Math.PI) * 1.15 : 0;
      const yaw = dir > 0 ? 0.35 : (Math.PI - 0.35);

      // 1. Overdrive / Fusion 3D Halo Ring
      if (isOd || isFusion) {
        const auraCol = isOd ? '#ff6097' : (st.gem || '#f472b6');
        this.drawMesh('torus', px, py + 0.14, 0, 0, t * 2.5, 0, 1.55 * w, 0.45, 1.55 * w, auraCol, auraCol, 0.78);
      }

      // 2. 3D Articulated Legs (or Rose's 3D Scalloped Ballgown!)
      if (!isFusion && id === 'rose') {
        this.drawMesh('cone', px, py + 0.68 * h + bob, 0, 0, 0, 0, 1.25, 1.32 * h, 1.15, '#fce7f3');
        this.drawMesh('cone', px, py + 0.92 * h + bob, 0, 0, 0, 0, 0.92, 0.72 * h, 0.88, '#fffbeb');
      } else {
        // Left & Right 3D Legs + Boots
        for (const side of [-1, 1]) {
          const swing = side * stride;
          const lz = side * 0.18 * w;
          const lx = px + Math.sin(swing) * 0.22;
          this.drawMesh('cylinder', lx, py + 0.38 * h + bob, lz, 0, 0, swing * 0.6, 0.22 * w, 0.64 * h, 0.22 * w, st.pants);
          this.drawMesh('cube', lx + dir * 0.08, py + 0.11 + bob, lz, 0, 0, 0, 0.32 * w, 0.22, 0.24 * w, st.boot);
        }
      }

      // 3. 3D Sculpted Torso + Chest Star / Gem
      const torsoY = py + 0.98 * h + bob;
      this.drawMesh('cylinder', px, torsoY, 0, 0, yaw, 0, 0.68 * w, 0.66 * h, 0.46 * w, st.top);
      // Chest Gem / Star Emblem
      this.drawMesh('gem', px + dir * 0.26 * w, torsoY + 0.04, 0.14, 0, t * 2.2, 0, 0.22, 0.26, 0.18, st.gem, st.gem);

      // 4. 3D Articulated Arms (Extra-Buffed for Bismuth/Jasper/Sugilite!)
      const armThick = (id === 'bismuth' || id === 'jasper' || id === 'sugilite') ? 0.28 : 0.18;
      for (const side of [-1, 1]) {
        const isLead = (side === 1);
        const armZ = side * 0.44 * w;
        const armAngle = isLead ? (-0.25 - atkSwing) * dir : (stride * 0.5) * dir;
        const ax = px + (isLead ? dir * (0.22 + atkSwing * 0.35) : -dir * 0.12);
        const ay = torsoY + 0.04 + (isLead ? atkSwing * 0.15 : 0);
        this.drawMesh('cylinder', ax, ay, armZ, 0, 0, armAngle, armThick * w, 0.54 * h, armThick * w, skinCol);
        this.drawMesh('sphere', ax + dir * (isLead ? 0.22 + atkSwing * 0.2 : -0.08), ay - 0.16, armZ, 0, 0, 0, armThick * 1.25, armThick * 1.25, armThick * 1.25, skinCol);
      }

      // 5. 3D Head & Iconic Hair Silhouette
      const headY = py + 1.52 * h + bob;
      this.drawMesh('sphere', px, headY, 0, 0, yaw, 0, 0.62, 0.64, 0.58, skinCol);
      // Expressive 3D Eyes / Visor
      if (id === 'garnet' || id === 'peridot' || id === 'sunstone' || id === 'sugilite' || id === 'sardonyx') {
        this.drawMesh('cube', px + dir * 0.26, headY + 0.04, 0.06, 0, yaw, 0, 0.24, 0.20, 0.56, st.accent, st.accent);
      } else {
        this.drawMesh('sphere', px + dir * 0.26, headY + 0.05, 0.14, 0, 0, 0, 0.14, 0.18, 0.10, '#ffffff');
        this.drawMesh('sphere', px + dir * 0.26, headY + 0.05, -0.14, 0, 0, 0, 0.14, 0.18, 0.10, '#ffffff');
        this.drawMesh('sphere', px + dir * 0.31, headY + 0.05, 0.14, 0, 0, 0, 0.07, 0.10, 0.07, '#18181b');
        this.drawMesh('sphere', px + dir * 0.31, headY + 0.05, -0.14, 0, 0, 0, 0.07, 0.10, 0.07, '#18181b');
      }

      // Hair Geometry matched to each Guardian's iconic silhouette!
      const ht = st.hairType || 'mane';
      if (ht === 'afro') {
        this.drawMesh('cube', px - dir * 0.04, headY + 0.22, 0, 0, yaw, 0, 0.96, 0.92, 0.96, hairCol);
      } else if (ht === 'dorito') {
        this.drawMesh('cone', px - dir * 0.05, headY + 0.26, 0, 0, yaw, 0, 1.25, 0.98, 0.82, hairCol);
      } else if (ht === 'point') {
        this.drawMesh('cone', px - dir * 0.32, headY + 0.16, 0, 0, 0, dir * 1.15, 0.62, 0.92, 0.62, hairCol);
        // Pearl's Forehead Gem + Pointed Nose
        this.drawMesh('sphere', px + dir * 0.28, headY + 0.22, 0, 0, 0, 0, 0.16, 0.18, 0.16, '#ffffff', '#bae6fd');
        this.drawMesh('cone', px + dir * 0.42, headY, 0, 0, 0, -dir * Math.PI * 0.5, 0.10, 0.32, 0.10, skinCol);
      } else if (ht === 'dreads') {
        const dreadCols = ['#22d3ee', '#4ade80', '#fef08a', '#fb923c', '#ec4899'];
        for (let d = 0; d < 5; d++) {
          const ang = (d - 2) * 0.42;
          this.drawMesh('cylinder', px - dir * 0.18, headY + 0.12, ang * 0.65, 0.25 * (d - 2), 0, dir * 0.25, 0.22, 0.78, 0.22, dreadCols[d]);
        }
      } else if (ht === 'cloud') {
        this.drawMesh('sphere', px - dir * 0.06, headY + 0.22, 0, 0, 0, 0, 0.78, 0.62, 0.78, hairCol);
        this.drawMesh('sphere', px - dir * 0.24, headY + 0.10, 0.18, 0, 0, 0, 0.46, 0.46, 0.46, hairCol);
        this.drawMesh('sphere', px - dir * 0.24, headY + 0.10, -0.18, 0, 0, 0, 0.46, 0.46, 0.46, hairCol);
      } else if (ht === 'spiky') {
        this.drawMesh('sphere', px - dir * 0.16, headY + 0.12, 0, 0, 0, 0, 1.05, 1.15, 1.05, hairCol);
        this.drawMesh('cone', px + dir * 0.12, headY + 0.36, 0.18, 0, 0, -dir * 0.3, 0.14, 0.28, 0.14, '#14b8a6');
        this.drawMesh('cone', px + dir * 0.12, headY + 0.36, -0.18, 0, 0, -dir * 0.3, 0.14, 0.28, 0.14, '#14b8a6');
      } else {
        this.drawMesh('sphere', px - dir * 0.14, headY + 0.08, 0, 0, 0, 0, 0.84, 0.88, 0.82, hairCol);
        this.drawMesh('cone', px - dir * 0.26, headY - 0.34, 0, 0, 0, dir * 0.28, 0.72, 0.96, 0.66, hairCol);
      }

      // 6. 3D Iconic Weapons & Passives
      const wX = px + dir * (0.62 * w + atkSwing * 0.42);
      const wY = torsoY + 0.06;
      if (st.weapon === 'shield' || st.weapon === 'swordShield') {
        this.drawMesh('cylinder', wX, wY, 0.35, 0, 0, Math.PI * 0.5, 0.82, 0.12, 0.82, '#ff6097', '#f472b6', 0.88);
        this.drawMesh('torus', wX, wY, 0.35, 0, 0, Math.PI * 0.5, 0.84, 0.35, 0.84, '#bae6fd', '#bae6fd', 0.9);
      }
      if (st.weapon === 'sword' || st.weapon === 'swordShield') {
        this.drawMesh('cube', wX + dir * 0.25, wY + 0.25, -0.32, 0, 0, -dir * (0.45 + atkSwing), 0.14, 1.45, 0.08, '#f9a8d4', '#f472b6');
        this.drawMesh('torus', wX, wY - 0.22, -0.32, 0, 0, 0, 0.26, 0.32, 0.26, '#ec4899');
      } else if (st.weapon === 'gauntlets') {
        this.drawMesh('cube', wX, wY, 0.45, 0, 0, 0, 0.56, 0.52, 0.52, '#dc2626', '#fbbf24');
        this.drawMesh('cube', px - dir * 0.38, wY - 0.05, -0.45, 0, 0, 0, 0.52, 0.48, 0.48, '#be123c');
      } else if (st.weapon === 'spear') {
        this.drawMesh('cylinder', wX + dir * 0.22, wY + 0.1, 0.28, 0, 0, -dir * (1.1 + atkSwing * 0.5), 0.08, 2.2, 0.08, '#f8fafc');
        this.drawMesh('cone', wX + dir * 0.88, wY + 0.35, 0.28, 0, 0, -dir * (1.1 + atkSwing * 0.5), 0.24, 0.85, 0.24, '#67e8f9', '#22d3ee');
      } else if (st.weapon === 'hammer') {
        this.drawMesh('cube', wX + dir * 0.22, wY + 0.08, 0.38, 0, 0, -dir * atkSwing, 0.68, 0.58, 0.58, '#475569', '#f97316');
      } else if (st.weapon === 'wings') {
        const flap = Math.sin(t * 7.5) * 0.22;
        this.drawMesh('cone', px - dir * 0.45, torsoY + 0.45, 0.68, 0.4 + flap, 0, dir * 0.65, 0.55, 1.55, 0.22, '#bae6fd', '#38bdf8', 0.82);
        this.drawMesh('cone', px - dir * 0.45, torsoY + 0.45, -0.68, -0.4 - flap, 0, dir * 0.65, 0.55, 1.55, 0.22, '#bae6fd', '#38bdf8', 0.82);
      } else if (st.weapon === 'shards') {
        // Peridot's 2 Passive Orbiting Ferrokinetic Steel Shards!
        for (let i = 0; i < 2; i++) {
          const a = t * 3.4 + i * Math.PI;
          this.drawMesh('gem', px + Math.cos(a) * 0.95, torsoY + 0.2 + Math.sin(t * 5 + i) * 0.15, Math.sin(a) * 0.95, 0, a, 0, 0.24, 0.42, 0.24, '#94a3b8', '#a3e635');
        }
      }

      // 7. Steven's 3D Spiked Pink Diamond Bubble ([S] Shield Passive!)
      if (hero.isShielding && (id === 'steven' || hero.bubbleTimer > 0)) {
        this.drawMesh('sphere', px, py + 0.95, 0, 0, t, 0, 2.25, 2.25, 2.25, '#ff6097', '#f472b6', 0.38);
        if (id === 'steven') {
          for (let s = 0; s < 8; s++) {
            const a = (s / 8) * Math.PI * 2 + t * 1.4;
            this.drawMesh('cone', px + Math.cos(a) * 1.18, py + 0.95 + Math.sin(a) * 1.18, 0, 0, 0, a - Math.PI * 0.5, 0.26, 0.46, 0.26, '#f43f5e', '#ff6097', 0.9);
          }
        }
      }
    }

    drawEnemy3D(e, groundY, S, t) {
      const px = e.x * S;
      const py = (groundY - e.y) * S;
      const isBoss = !!e.isBoss;
      const sc = isBoss ? 1.85 : 1.0;
      const col = e.hurtTimer > 0 ? '#ffffff' : (e.gemColor || '#22c55e');
      const em = e.hurtTimer > 0 ? '#ffffff' : (isBoss ? '#ef4444' : null);

      this.drawMesh('cylinder', px, 0.03, 0, 0, 0, 0, 1.3 * sc, 0.04, 0.95 * sc, '#090714', null, 0.45);

      if (e.type && e.type.includes('white_diamond')) {
        // Towering 3D White Diamond Boss!
        this.drawMesh('cone', px, py + 2.2, 0, 0, 0, 0, 2.4, 4.4, 2.0, '#f8fafc', '#cbd5e1');
        this.drawMesh('sphere', px, py + 4.4, 0, 0, 0, 0, 1.35, 1.45, 1.25, '#ffffff', '#e2e8f0');
        for (let sp = 0; sp < 5; sp++) {
          const a = -0.9 + sp * 0.45;
          this.drawMesh('cone', px + Math.sin(a) * 1.1, py + 5.2 + Math.cos(a) * 0.5, -0.2, 0, 0, -a, 0.45, 1.6, 0.35, '#ffffff', '#ffffff');
        }
        this.drawMesh('gem', px, py + 4.85, 0.55, 0, 0, 0, 0.42, 0.55, 0.32, '#ffffff', '#ffffff');
      } else if (e.type && e.type.includes('centipeetle')) {
        // Multi-segment 3D Corrupted Centipeetle!
        const dir = e.facing || -1;
        for (let seg = 0; seg < 4; seg++) {
          const bob = Math.sin(t * 7 + seg * 1.1) * 0.1;
          this.drawMesh('sphere', px - dir * seg * 0.52 * sc, py + 0.52 * sc + bob, 0, 0, 0, 0, 0.72 * sc, 0.65 * sc, 0.68 * sc, seg === 0 ? '#15803d' : '#166534');
        }
        // Glowing Acid Gem Eye!
        this.drawMesh('gem', px + dir * 0.35 * sc, py + 0.58 * sc, 0.18 * sc, 0, t * 2, 0, 0.38 * sc, 0.38 * sc, 0.38 * sc, '#4ade80', '#4ade80');
      } else {
        // Corrupted Quartz Beast / Cluster Titan / Elemental Guardian 3D Rig
        const bob = Math.sin(t * 5.2 + px) * 0.08;
        this.drawMesh('sphere', px, py + 0.88 * sc + bob, 0, 0, 0, 0, 1.1 * sc, 1.15 * sc, 0.95 * sc, col, em);
        this.drawMesh('cone', px - 0.35 * sc, py + 1.52 * sc + bob, 0.2, 0, 0, 0.35, 0.25 * sc, 0.62 * sc, 0.25 * sc, '#fde047', '#f59e0b');
        this.drawMesh('cone', px + 0.35 * sc, py + 1.52 * sc + bob, -0.2, 0, 0, -0.35, 0.25 * sc, 0.62 * sc, 0.25 * sc, '#fde047', '#f59e0b');
        this.drawMesh('gem', px, py + 0.92 * sc + bob, 0.48 * sc, 0, t * 2.5, 0, 0.34 * sc, 0.42 * sc, 0.28 * sc, '#f43f5e', '#f43f5e');
        if (isBoss) {
          // Orbiting Phase-2 Corruption Shards!
          for (let k = 0; k < 4; k++) {
            const a = t * 2.8 + (k * Math.PI) / 2;
            this.drawMesh('gem', px + Math.cos(a) * 1.55, py + 1.3 + Math.sin(t * 4 + k) * 0.25, Math.sin(a) * 1.55, 0, a, 0, 0.3, 0.55, 0.3, '#ef4444', '#ef4444');
          }
        }
      }
    }

    drawProjectile3D(p, groundY, S, t) {
      const px = p.x * S;
      const py = (groundY - p.y) * S;
      const col = p.color || '#f472b6';
      const r = Math.max(0.28, (p.radius || 20) * S);
      if (p.type === 'stevenShield' || p.type === 'roseShield') {
        this.drawMesh('cylinder', px, py, 0, 0, t * 14, 0, r * 2.1, 0.16, r * 2.1, col, col, 0.92);
        this.drawMesh('torus', px, py, 0, 0, t * 14, 0, r * 2.1, 0.35, r * 2.1, '#bae6fd', '#bae6fd', 0.95);
      } else if (p.type === 'bismuthAnvil') {
        this.drawMesh('cube', px, py, 0, 0, 0, -t * 10, r * 1.8, r * 1.4, r * 1.4, '#475569', '#f97316');
      } else if (p.type === 'pearlLaser' || p.type === 'fusionOpalArrow') {
        this.drawMesh('cylinder', px, py, 0, 0, 0, Math.PI * 0.5, 0.16, r * 3.4, 0.16, col, '#ffffff');
      } else {
        this.drawMesh('sphere', px, py, 0, t * 6, t * 8, 0, r * 1.6, r * 1.6, r * 1.6, col, col, 0.9);
      }
    }
  }

  window.Crystal3DEngine = Crystal3DEngine;

  // Hook into GameController cleanly once loaded!
  window.addEventListener('DOMContentLoaded', () => {
    const c3d = document.getElementById('gameCanvas3D');
    if (!c3d || typeof GameController === 'undefined') return;
    const engine3D = new Crystal3DEngine(c3d);
    window.__crystal3DEngine = engine3D;
    if (!engine3D.ready) return;

    // Keyboard [V] cycles 3D camera angles
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'v' || ev.key === 'V') {
        engine3D.cycleCamera();
      }
    });

    // Replace GameController.prototype.draw with WebGL 3D world + crisp 2D HUD/damage overlay!
    const origDraw = GameController.prototype.draw;
    GameController.prototype.draw = function () {
      if (!engine3D.ready) {
        return origDraw.call(this);
      }
      // Compute screen shake identical to 2D
      let shakeX = 0, shakeY = 0;
      if (this.screenShake > 0.05) {
        const t = performance.now() * 0.05;
        const amp = Math.min(18, this.screenShake);
        shakeX = Math.sin(t) * amp;
        shakeY = Math.cos(t * 1.7) * amp * 0.7;
      }

      // 1. Render full 3D WebGL Scene on #gameCanvas3D
      engine3D.renderWorld(this, shakeX, shakeY);

      // 2. Render crisp transparent 2D HUD overlays (damage text, particles, boss arrow) on #gameCanvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.save();
      this.ctx.translate(shakeX, shakeY);
      const viewCenterX = this.canvas.width / 2;
      const viewCenterY = this.canvas.height * 0.58;
      this.ctx.translate(viewCenterX, viewCenterY);
      this.ctx.scale(this.cameraZoom, this.cameraZoom);
      this.ctx.translate(-viewCenterX, -viewCenterY);
      this.ctx.translate(-Math.round(this.cameraX), 0);

      if (this.isWaitingForBoss && typeof this.drawBossGateArrow === 'function') {
        this.drawBossGateArrow(this.ctx);
      }
      if (this.particles && typeof this.particles.draw === 'function') {
        this.particles.draw(this.ctx, this.cameraX - 240, this.cameraX + this.canvas.width + 240);
      }
      this.ctx.restore();
    };
  });
})();
