const DIFFICULTY_CONFIG = {
  easy: {
    name: 'EASY',
    hearts: 7,
    enemyHpMultiplier: 0.70,
    enemySpeedMult: 0.85,
    cookieDropRate: 0.50,
    enemyTelegraphMult: 1.55,
    maxConcurrentAttackers: 1,
    enemyEvasion: 0,
    aiUnpredictability: 0.0,
    eliteChance: 0,
    enemyAggression: 0.90,
    attackCooldownMult: 1.25,
    waveSizeBonus: 0,
    bossHpMult: 0.90,
    eliteHpMult: 1.30,
    stageHeal: -1,          // -1 = restore every heart on stage clear
    knockbackResist: 0,
    pillColor: '#22c55e'
  },
  medium: {
    name: 'MEDIUM',
    hearts: 5,
    enemyHpMultiplier: 1.0,
    enemySpeedMult: 1.0,
    cookieDropRate: 0.34,
    enemyTelegraphMult: 1.0,
    maxConcurrentAttackers: 2,
    enemyEvasion: 0.05,
    aiUnpredictability: 0.35,
    eliteChance: 0.08,
    enemyAggression: 1.0,
    attackCooldownMult: 1.0,
    waveSizeBonus: 0,
    bossHpMult: 1.0,
    eliteHpMult: 1.60,
    stageHeal: -1,
    knockbackResist: 0,
    pillColor: '#eab308'
  },
  hard: {
    name: 'HARD',
    hearts: 4,
    enemyHpMultiplier: 1.40,
    enemySpeedMult: 1.18,
    cookieDropRate: 0.20,
    enemyTelegraphMult: 0.72,
    maxConcurrentAttackers: 3,
    enemyEvasion: 0.12,
    aiUnpredictability: 0.65,
    eliteChance: 0.20,
    enemyAggression: 1.15,
    attackCooldownMult: 0.88,
    waveSizeBonus: 1,
    bossHpMult: 1.20,
    eliteHpMult: 1.80,
    stageHeal: 1,
    knockbackResist: 0.15,
    pillColor: '#f97316'
  },
  extreme: {
    name: 'EXTREME',
    hearts: 3,
    enemyHpMultiplier: 1.90,
    enemySpeedMult: 1.40,
    cookieDropRate: 0.09,
    enemyTelegraphMult: 0.48,
    maxConcurrentAttackers: 4,
    enemyEvasion: 0.19,
    aiUnpredictability: 0.88,
    eliteChance: 0.36,
    enemyAggression: 1.38,
    attackCooldownMult: 0.74,
    waveSizeBonus: 2,
    bossHpMult: 1.45,
    eliteHpMult: 2.00,
    stageHeal: 1,
    knockbackResist: 0.30,
    pillColor: '#ef4444'
  },
  diamond: {
    name: 'DIAMOND',
    hearts: 2,
    enemyHpMultiplier: 2.50,
    enemySpeedMult: 1.55,
    cookieDropRate: 0.03,
    enemyTelegraphMult: 0.36,
    maxConcurrentAttackers: 4,
    enemyEvasion: 0.28,
    aiUnpredictability: 1.0,
    eliteChance: 0.55,
    enemyAggression: 1.60,
    attackCooldownMult: 0.62,
    waveSizeBonus: 3,
    bossHpMult: 1.80,
    eliteHpMult: 2.20,
    stageHeal: 0,           // no recovery between episodes
    knockbackResist: 0.45,
    pillColor: '#a855f7'
  }
};

// Canonical order used by the quick-cycle button and the difficulty panel.
const DIFFICULTY_ORDER = ['easy', 'medium', 'hard', 'extreme', 'diamond'];

// ============================================================================
// 6.1. CANONICAL SAVE THE LIGHT / UNLEASH THE LIGHT CHARACTER PORTRAITS (SVG)
// ============================================================================
const GUARDIAN_PORTRAITS = {
  steven: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Steven Sculpted Cloud-Curl Crown (Espresso Brown with inner C-swirls) -->
    <path d="M 12 36 C 8 28 10 18 18 14 C 22 10 30 8 35 12 C 40 8 49 10 52 16 C 58 22 57 32 52 38 C 50 44 44 48 38 48 C 30 50 20 48 14 42 Z" fill="#26151c"/>
    <path d="M 18 19 Q 24 14 30 18" stroke="#3b252c" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 33 14 Q 40 12 46 17" stroke="#3b252c" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 14 28 Q 11 20 18 22" stroke="#3b252c" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Face / Head -->
    <ellipse cx="32" cy="33" rx="18.5" ry="17.5" fill="#fbd0be"/>
    <ellipse cx="19" cy="37" rx="5" ry="3.5" fill="#f43f5e" opacity="0.35"/>
    <ellipse cx="45" cy="37" rx="5" ry="3.5" fill="#f43f5e" opacity="0.35"/>
    <!-- Big Expressive Cartoon Eyes (Save the Light Style) -->
    <ellipse cx="25" cy="30" rx="4.5" ry="6" fill="#1e102d"/>
    <ellipse cx="39" cy="30" rx="4.5" ry="6" fill="#1e102d"/>
    <ellipse cx="26" cy="28.5" rx="1.8" ry="2.5" fill="#ffffff"/>
    <ellipse cx="40" cy="28.5" rx="1.8" ry="2.5" fill="#ffffff"/>
    <circle cx="24" cy="32" r="0.8" fill="#ffffff"/>
    <circle cx="38" cy="32" r="0.8" fill="#ffffff"/>
    <!-- Arched Eyebrows -->
    <path d="M 20 22 Q 25 18 29 21" stroke="#1e102d" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 44 22 Q 39 18 35 21" stroke="#1e102d" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <!-- Huge Open Teeny Smile with Upper Teeth Band & Crimson Depth -->
    <path d="M 23 37 Q 32 37 41 37 Q 41 49 32 49 Q 23 49 23 37 Z" fill="#881337"/>
    <path d="M 23 37 Q 32 37 41 37 Q 40 42 32 42 Q 24 42 23 37 Z" fill="#ffffff"/>
    <path d="M 27 45 Q 32 43 37 45 Q 35 48 32 48 Q 29 48 27 45 Z" fill="#f472b6"/>
    <!-- Red Shirt & Star -->
    <path d="M 16 50 Q 32 54 48 50 L 52 64 L 12 64 Z" fill="#ff5975"/>
    <polygon points="32,49 34.5,55 40,55 35.5,58.5 37,64 32,60.5 27,64 28.5,58.5 24,55 29.5,55" fill="#fde047"/>
  </svg>`,

  garnet: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- 3D Beveled Cubic Box Afro -->
    <rect x="11" y="9" width="42" height="30" rx="5" fill="#200a2e"/>
    <path d="M 11 14 L 32 10 L 53 14" stroke="#701a75" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    <polygon points="11,9 53,9 49,15 15,15" fill="#4a044e" opacity="0.6"/>
    <!-- Face / Jaw -->
    <polygon points="19,30 45,30 42,48 22,48" fill="#78350f"/>
    <!-- Iconic Angular Visor (Ruby & Sapphire Shimmer) -->
    <defs>
      <linearGradient id="garnetVisorGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#f43f5e"/>
        <stop offset="50%" stop-color="#ec4899"/>
        <stop offset="100%" stop-color="#38bdf8"/>
      </linearGradient>
    </defs>
    <polygon points="15,26 49,26 44,38 20,38" fill="url(#garnetVisorGrad)"/>
    <polygon points="17,27 47,27 44,30 20,30" fill="#ffffff" opacity="0.6"/>
    <!-- Golden Star Specular Glint (Unleash the Light) -->
    <polygon points="32,27 33.5,31 37,32 33.5,33 32,37 30.5,33 27,32 30.5,31" fill="#fde047" opacity="0.95"/>
    <!-- Stoic Mouth / Lips -->
    <rect x="28" y="43" width="8" height="2" rx="1" fill="#be185d"/>
    <!-- Asymmetrical Bodysuit Collar -->
    <path d="M 12 48 L 32 50 L 32 64 L 10 64 Z" fill="#881337"/>
    <path d="M 32 50 L 52 48 L 54 64 L 32 64 Z" fill="#1e1b4b"/>
    <!-- Cubic Shoulder Armor -->
    <polygon points="8,48 16,46 14,56 6,56" fill="#be123c"/>
    <polygon points="56,48 48,46 50,56 58,56" fill="#312e81"/>
  </svg>`,

  pearl: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Conical Peach Hair Sweeping Gracefully BACKWARD (-X) -->
    <path d="M 30 7 Q 12 11 4 22 Q 13 32 25 28 Z" fill="#fed7aa"/>
    <path d="M 28 9 Q 14 13 7 22 Q 15 29 24 26 Z" fill="#fbcfe8"/>
    <!-- Porcelain Head in Profile -->
    <ellipse cx="32" cy="30" rx="14" ry="15" fill="#fff7ed"/>
    <!-- Sharp Pointed Nose pointing FORWARD (+X) -->
    <polygon points="38,28 50,31 38,34" fill="#fed7aa"/>
    <!-- Forehead Luminous Oval Pearl Gemstone -->
    <ellipse cx="32" cy="18" rx="4.5" ry="6.5" fill="#ffffff" stroke="#38bdf8" stroke-width="1.2"/>
    <ellipse cx="31" cy="16.5" rx="1.6" ry="2.5" fill="#e0f2fe"/>
    <!-- Expressive Cyan Anime Eye in Profile -->
    <ellipse cx="34" cy="29" rx="4" ry="5.5" fill="#0284c7"/>
    <ellipse cx="35" cy="28.5" rx="2.5" ry="3.8" fill="#082f49"/>
    <circle cx="36" cy="27.5" r="1.3" fill="#ffffff"/>
    <path d="M 30 22 Q 35 20 40 23" stroke="#0284c7" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <!-- Peach Blush & Cheerful Smile -->
    <ellipse cx="34" cy="35" rx="3.5" ry="2" fill="rgba(251, 146, 60, 0.4)"/>
    <path d="M 32 37 Q 37 40 41 37" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <!-- Cyan Ballerina Tunic & Gold Star -->
    <path d="M 18 46 Q 32 50 46 46 L 49 64 L 15 64 Z" fill="#38bdf8"/>
    <polygon points="32,48 34,53 39,53 35,56 36.5,61 32,58 27.5,61 29,56 25,53 30,53" fill="#fde047"/>
    <!-- Translucent Pink Sash -->
    <path d="M 14 56 Q 32 60 50 56 L 48 60 Q 32 64 16 60 Z" fill="rgba(255, 148, 186, 0.8)"/>
  </svg>`,

  amethyst: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Long Voluminous Flowing WAVY Pale-Lilac Hair Cascading Past Shoulders -->
    <path d="M 32 8 C 14 8 6 22 6 36 C 6 48 10 58 14 62 C 18 54 18 46 22 38 C 24 30 28 20 32 18 C 36 20 42 30 44 40 C 46 48 48 56 52 62 C 58 56 60 44 60 34 C 60 18 48 8 32 8 Z" fill="#e9d5ff"/>
    <path d="M 10 32 C 8 44 14 54 18 60 C 16 52 14 44 18 36" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 54 32 C 56 44 50 54 46 60 C 48 52 50 44 46 36" stroke="#c084fc" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <!-- Purple Face -->
    <circle cx="34" cy="33" r="15.5" fill="#d8b4fe"/>
    <!-- Mischievous Smirking Quartz Grin with White Teeth -->
    <path d="M 28 39 Q 36 41 43 37 Q 40 45 33 45 Q 28 45 28 39 Z" fill="#3b0764"/>
    <path d="M 28 39 Q 36 41 43 37 Q 38 41 33 41 Q 29 41 28 39 Z" fill="#ffffff"/>
    <!-- Dark Purple Eye (Right Eye visible) -->
    <ellipse cx="38" cy="31" rx="4" ry="5.5" fill="#3b0764"/>
    <circle cx="39.5" cy="29.5" r="1.6" fill="#ffffff"/>
    <path d="M 33 24 Q 38 21 43 23" stroke="#3b0764" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <!-- Flowing Wavy Mane Cascading OVER Left Eye (Signature S-Curve Lock) -->
    <path d="M 22 10 Q 32 14 28 26 Q 22 36 24 50 Q 16 40 18 24 Z" fill="#d8b4fe"/>
    <path d="M 26 12 Q 34 20 30 32 Q 26 40 28 54 Q 22 44 24 28 Z" fill="#e9d5ff"/>
    <!-- Hexagonal Faceted Amethyst Gem on Chest -->
    <polygon points="32,49 35,51 35,55 32,57 29,55 29,51" fill="#7e22ce" stroke="#f3e8ff" stroke-width="1"/>
    <!-- Dark Tank Top with Star Strap -->
    <path d="M 18 52 Q 32 56 46 52 L 48 64 L 16 64 Z" fill="#1e1b4b"/>
  </svg>`,

  connie: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Flowing Dark Wavy Hair Cascading Past Shoulders -->
    <path d="M 32 10 C 16 10 8 22 8 36 C 8 48 12 56 16 62 C 20 54 20 44 22 34 C 24 22 40 22 42 34 C 44 44 44 54 48 62 C 52 56 56 48 56 36 C 56 22 48 10 32 10 Z" fill="#1c1917"/>
    <path d="M 12 36 C 10 46 16 54 20 60" stroke="#292524" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 52 36 C 54 46 48 54 44 60" stroke="#292524" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <!-- Warm Brown Skin Face -->
    <ellipse cx="32" cy="34" rx="16" ry="16" fill="#a16207"/>
    <!-- Signature Turquoise / Teal Headband across Hair (Save the Light Key Item!) -->
    <path d="M 18 24 Q 32 16 46 24" stroke="#0d9488" stroke-width="4.2" stroke-linecap="round" fill="none"/>
    <!-- Expressive Dark Eyes & Determined Eyebrows -->
    <ellipse cx="26" cy="32" rx="4" ry="5.5" fill="#1c1917"/>
    <ellipse cx="38" cy="32" rx="4" ry="5.5" fill="#1c1917"/>
    <circle cx="27" cy="30.5" r="1.5" fill="#ffffff"/>
    <circle cx="39" cy="30.5" r="1.5" fill="#ffffff"/>
    <path d="M 21 24 Q 26 21 30 23" stroke="#1c1917" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 43 24 Q 38 21 34 23" stroke="#1c1917" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Confident Warrior Smile with Teeth -->
    <path d="M 26 40 Q 32 45 38 40 Z" fill="#ffffff" stroke="#78350f" stroke-width="1.2"/>
    <!-- Salmon Pink Polo Shirt with White Pointed Collar -->
    <path d="M 18 50 Q 32 54 46 50 L 48 64 L 16 64 Z" fill="#fb7185"/>
    <polygon points="26,50 32,56 30,50" fill="#ffffff"/>
    <polygon points="38,50 32,56 34,50" fill="#ffffff"/>
  </svg>`,

  lapis: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Liquid Translucent Cyan Hydro Wings Flanking Head -->
    <path d="M 16 32 Q 4 16 2 32 Q 10 38 16 36 Z" fill="rgba(56, 189, 248, 0.75)" stroke="#e0f2fe" stroke-width="1.2"/>
    <path d="M 48 32 Q 60 16 62 32 Q 54 38 48 36 Z" fill="rgba(56, 189, 248, 0.75)" stroke="#e0f2fe" stroke-width="1.2"/>
    <!-- Fluid Feathered Navy Bob Hair -->
    <ellipse cx="32" cy="28" rx="18" ry="18" fill="#1e3a8a"/>
    <path d="M 14 30 L 16 44 L 22 34 Z" fill="#1e3a8a"/>
    <path d="M 50 30 L 48 44 L 42 34 Z" fill="#1e3a8a"/>
    <!-- Azure Blue Skin Face -->
    <ellipse cx="32" cy="33" rx="14" ry="15" fill="#38bdf8"/>
    <!-- Angular Windswept Bangs -->
    <polygon points="20,20 26,30 32,22 38,30 44,20" fill="#1e3a8a"/>
    <!-- Serene / Mystical Blue Eyes -->
    <ellipse cx="26" cy="32" rx="3.5" ry="4.5" fill="#0c4a6e"/>
    <ellipse cx="38" cy="32" rx="3.5" ry="4.5" fill="#0c4a6e"/>
    <circle cx="27" cy="31" r="1.3" fill="#ffffff"/>
    <circle cx="39" cy="31" r="1.3" fill="#ffffff"/>
    <!-- Gentle Smile -->
    <path d="M 28 41 Q 32 44 36 41" stroke="#0284c7" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    <!-- Royal Blue Halter Top & Golden Ribbon Tie -->
    <path d="M 20 48 Q 32 52 44 48 L 46 64 L 18 64 Z" fill="#1d4ed8"/>
    <polygon points="32,48 30,53 34,53" fill="#fbbf24"/>
  </svg>`,

  peridot: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Sculpted 3D Tetrahedral Chartreuse Hair (Iconic Faceted Dorito Shape!) -->
    <polygon points="32,6 54,34 10,34" fill="#d9f99d"/>
    <polygon points="32,8 52,33 32,24" fill="#bef264"/>
    <polygon points="32,8 32,24 12,33" fill="#a3e635" opacity="0.75"/>
    <!-- Lime Green Face -->
    <polygon points="20,28 44,28 40,46 24,46" fill="#a3e635"/>
    <!-- Forehead Triangular Peridot Gem -->
    <polygon points="32,21 35,26 29,26" fill="#4ade80" stroke="#15803d" stroke-width="0.8"/>
    <!-- Winged Yellow Visor Glasses (Change Your Mind / Save the Light) -->
    <polygon points="16,28 32,32 48,28 46,38 32,40 18,38" fill="rgba(250, 204, 21, 0.95)" stroke="#ffffff" stroke-width="1.2"/>
    <circle cx="26" cy="33" r="1.3" fill="#ffffff"/>
    <circle cx="38" cy="33" r="1.3" fill="#ffffff"/>
    <!-- Smug Smirk -->
    <path d="M 28 42 Q 33 45 37 42" stroke="#15803d" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <!-- Tech Uniform with Yellow Diamond Insignia -->
    <path d="M 18 48 Q 32 52 46 48 L 48 64 L 16 64 Z" fill="#15803d"/>
    <polygon points="32,50 35,54 32,58 29,54" fill="#facc15"/>
  </svg>`,

  bismuth: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Thick Curved Tubular Rainbow Dreadlocks Bundled by Headband -->
    <path d="M 14 26 C 10 18 16 10 24 10 C 22 16 20 22 18 28 Z" fill="#ef4444"/>
    <path d="M 22 12 C 22 8 28 6 34 8 C 32 14 30 20 28 26 Z" fill="#f97316"/>
    <path d="M 32 8 C 36 6 42 8 44 12 C 40 18 38 24 36 28 Z" fill="#eab308"/>
    <path d="M 42 12 C 48 10 52 14 52 20 C 48 24 44 28 42 32 Z" fill="#22c55e"/>
    <path d="M 48 20 C 54 22 56 28 54 34 C 50 36 46 36 44 38 Z" fill="#3b82f6"/>
    <path d="M 52 32 C 56 36 56 42 52 46 C 48 46 46 42 46 40 Z" fill="#a855f7"/>
    <!-- Dark Leather Hair Tie -->
    <path d="M 18 22 Q 34 16 50 22" stroke="#1e293b" stroke-width="3" stroke-linecap="round" fill="none"/>
    <!-- Muscular Slate-Blue Face -->
    <circle cx="32" cy="33" r="16" fill="#94a3b8"/>
    <!-- Big Friendly Eyes & Bushy Brows -->
    <ellipse cx="26" cy="28" rx="3.5" ry="4.5" fill="#1e293b"/>
    <ellipse cx="38" cy="28" rx="3.5" ry="4.5" fill="#1e293b"/>
    <circle cx="27" cy="27" r="1.2" fill="#ffffff"/>
    <circle cx="39" cy="27" r="1.2" fill="#ffffff"/>
    <path d="M 22 22 Q 26 20 30 22" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 42 22 Q 38 20 34 22" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <!-- Broad Grin with Big White Teeth -->
    <path d="M 23 37 Q 32 46 41 37 Z" fill="#ffffff" stroke="#475569" stroke-width="1.5"/>
    <!-- 98-Facet Stepped-Pyramid Chest Gemstone -->
    <rect x="27" y="50" width="10" height="10" fill="#ec4899"/>
    <rect x="29" y="52" width="6" height="6" fill="#06b6d4"/>
    <rect x="31" y="54" width="2" height="2" fill="#eab308"/>
    <!-- Blacksmith Apron & Star Strap -->
    <path d="M 14 50 L 50 50 L 52 64 L 12 64 Z" fill="#78350f"/>
    <line x1="16" y1="50" x2="38" y2="64" stroke="#f59e0b" stroke-width="2"/>
  </svg>`,

  jasper: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Massive Swept-Back WAVY Pale Peach-Cream Lion's Mane Cascading Behind Shoulders -->
    <path d="M 32 6 C 14 6 6 18 6 34 C 6 48 10 58 14 62 C 16 52 18 44 20 36 C 22 26 26 18 32 16 C 38 18 42 26 44 36 C 46 44 48 52 50 62 C 54 58 58 48 58 34 C 58 18 50 6 32 6 Z" fill="#fed7aa"/>
    <path d="M 10 32 C 8 44 12 54 16 60 C 14 50 14 42 18 34" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 54 32 C 56 44 52 54 48 60 C 50 50 50 42 46 34" stroke="#fcd34d" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <!-- Widow's Peak Crown Crest -->
    <polygon points="32,12 36,20 28,20" fill="#fed7aa"/>
    <!-- Broad Orange Face with Dark Red Tiger Stripes -->
    <polygon points="18,24 46,24 42,48 22,48" fill="#ea580c"/>
    <path d="M 18 28 L 26 30 L 18 34 Z" fill="#991b1b"/>
    <path d="M 46 28 L 38 30 L 46 34 Z" fill="#991b1b"/>
    <path d="M 28 24 L 32 30 L 36 24 Z" fill="#991b1b"/>
    <!-- Faceted Amber Gemstone ON NOSE -->
    <polygon points="32,32 36,37 32,41 28,37" fill="#b45309" stroke="#f59e0b" stroke-width="1"/>
    <!-- Fierce Golden Eyes -->
    <ellipse cx="24" cy="29" rx="3.5" ry="4" fill="#fbbf24"/>
    <ellipse cx="40" cy="29" rx="3.5" ry="4" fill="#fbbf24"/>
    <ellipse cx="24" cy="29" rx="1.8" ry="3" fill="#450a0a"/>
    <ellipse cx="40" cy="29" rx="1.8" ry="3" fill="#450a0a"/>
    <!-- Fierce Warrior Scowl -->
    <path d="M 26 44 L 38 43" stroke="#450a0a" stroke-width="2" stroke-linecap="round"/>
    <!-- Maroon Tunic with Yellow Diamond -->
    <path d="M 16 50 Q 32 54 48 50 L 50 64 L 14 64 Z" fill="#7f1d1d"/>
    <polygon points="32,51 35,55 32,59 29,55" fill="#fde047"/>
  </svg>`,

  rose: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <!-- Cascading Voluminous Pink Spiral Rose-Tube Ringlets with Hollow Centers -->
    <path d="M 32 8 C 16 8 8 20 8 36 C 8 48 12 56 16 62 C 20 54 20 44 22 36 C 24 24 40 24 42 36 C 44 44 44 54 48 62 C 52 56 56 48 56 36 C 56 20 48 8 32 8 Z" fill="#f472b6"/>
    <!-- Hollow Center Spirals -->
    <path d="M 12 28 C 10 36 14 44 18 42 C 20 40 18 34 16 36" stroke="#db2777" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 52 28 C 54 36 50 44 46 42 C 44 40 46 34 48 36" stroke="#db2777" stroke-width="2.2" stroke-linecap="round" fill="none"/>
    <path d="M 16 46 C 14 52 18 58 22 56" stroke="#db2777" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 48 46 C 50 52 46 58 42 56" stroke="#db2777" stroke-width="2" stroke-linecap="round" fill="none"/>
    <!-- Gentle Romantic Curtain Bangs -->
    <path d="M 22 18 Q 32 22 42 18 Q 32 26 22 18 Z" fill="#fbcfe8"/>
    <!-- Gentle Peach Face -->
    <ellipse cx="32" cy="33" rx="15" ry="16" fill="#fed7aa"/>
    <!-- Gentle Eyes with Eyelashes -->
    <ellipse cx="26" cy="31" rx="3.5" ry="4.5" fill="#1e102d"/>
    <ellipse cx="38" cy="31" rx="3.5" ry="4.5" fill="#1e102d"/>
    <circle cx="27" cy="30" r="1.3" fill="#ffffff"/>
    <circle cx="39" cy="30" r="1.3" fill="#ffffff"/>
    <!-- Sweet Pink Smile -->
    <path d="M 27 40 Q 32 44 37 40" stroke="#db2777" stroke-width="1.8" stroke-linecap="round" fill="none"/>
    <!-- Tiered White Gown with Star Cutout & Navel Gem -->
    <path d="M 16 50 Q 32 54 48 50 L 52 64 L 12 64 Z" fill="#ffffff"/>
    <polygon points="32,52 34,56 38,56 35,59 36,63 32,60 28,63 29,59 26,56 30,56" fill="#f43f5e"/>
    <circle cx="32" cy="58" r="2.2" fill="#fbcfe8"/>
  </svg>`
};

const VILLAIN_PORTRAITS = {
  boss_centipeetle: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#0b1f14"/>
    <path d="M 12 18 L 6 10 L 18 14 Z" fill="#84cc16"/>
    <path d="M 52 18 L 58 10 L 46 14 Z" fill="#84cc16"/>
    <path d="M 10 34 L 4 28 L 14 28 Z" fill="#65a30d"/>
    <path d="M 54 34 L 60 28 L 50 28 Z" fill="#65a30d"/>
    <ellipse cx="32" cy="36" rx="22" ry="19" fill="#14532d" stroke="#84cc16" stroke-width="2.2"/>
    <ellipse cx="32" cy="34" rx="15" ry="13" fill="#052e16"/>
    <circle cx="32" cy="33" r="10.5" fill="#bef264"/>
    <ellipse cx="32" cy="33" rx="2.8" ry="8.5" fill="#0f172a"/>
    <circle cx="34.5" cy="30" r="2" fill="#ffffff" opacity="0.85"/>
    <path d="M 18 46 L 23 51 L 27 46 L 32 52 L 37 46 L 41 51 L 46 46" stroke="#d9f99d" stroke-width="2.2" fill="none" stroke-linejoin="round"/>
  </svg>`,
  boss_giant_bird: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#0b162c"/>
    <path d="M 8 24 L 22 10 L 32 18 L 42 10 L 56 24 L 48 44 L 16 44 Z" fill="#1e3a8a" stroke="#38bdf8" stroke-width="2"/>
    <polygon points="32,6 26,18 38,18" fill="#67e8f9"/>
    <circle cx="24" cy="27" r="4" fill="#fde047"/>
    <circle cx="40" cy="27" r="4" fill="#fde047"/>
    <circle cx="24" cy="27" r="1.6" fill="#0f172a"/>
    <circle cx="40" cy="27" r="1.6" fill="#0f172a"/>
    <polygon points="32,29 24,42 32,48 40,42" fill="#f59e0b" stroke="#78350f" stroke-width="1.6"/>
    <polygon points="32,50 26,56 32,62 38,56" fill="#22d3ee" stroke="#083344" stroke-width="1.4"/>
  </svg>`,
  boss_cluster_titan: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#1f0a2c"/>
    <polygon points="12,18 26,8 38,12 52,20 50,52 14,52" fill="#581c87" stroke="#c084fc" stroke-width="2"/>
    <path d="M 26 8 L 31 30 L 18 46" stroke="#f0abfc" stroke-width="2" fill="none"/>
    <path d="M 38 12 L 35 32 L 48 44" stroke="#f472b6" stroke-width="2" fill="none"/>
    <circle cx="23" cy="28" r="4.2" fill="#fde047"/>
    <circle cx="41" cy="26" r="3.6" fill="#38bdf8"/>
    <circle cx="33" cy="40" r="3.2" fill="#f43f5e"/>
    <rect x="22" y="47" width="20" height="4" rx="2" fill="#1e1b4b"/>
  </svg>`,
  boss_cluster_core: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#240b06"/>
    <circle cx="32" cy="32" r="22" fill="#7c2d12" stroke="#fb923c" stroke-width="2.2"/>
    <polygon points="32,8 40,22 56,24 44,36 48,54 32,45 16,54 20,36 8,24 24,22" fill="#f97316" opacity="0.88"/>
    <polygon points="32,16 42,26 38,44 26,44 22,26" fill="#fde047" stroke="#ffffff" stroke-width="1.4"/>
    <circle cx="27" cy="30" r="2.6" fill="#0f172a"/>
    <circle cx="37" cy="30" r="2.6" fill="#0f172a"/>
  </svg>`,
  boss_forge_guardian: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#1c0d09"/>
    <polygon points="14,14 50,14 54,44 42,56 22,56 10,44" fill="#334155" stroke="#f97316" stroke-width="2.2"/>
    <rect x="16" y="25" width="32" height="10" rx="4" fill="#0f172a" stroke="#fb923c" stroke-width="1.4"/>
    <rect x="20" y="28" width="9" height="4" rx="1" fill="#fde047"/>
    <rect x="35" y="28" width="9" height="4" rx="1" fill="#fde047"/>
    <polygon points="32,40 24,49 40,49" fill="#ef4444" stroke="#fed7aa" stroke-width="1.2"/>
  </svg>`,
  boss_jasper: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#2b1206"/>
    <path d="M 10 20 L 20 8 L 28 16 L 36 16 L 44 8 L 54 20 L 49 54 L 15 54 Z" fill="#fff7ed" stroke="#f97316" stroke-width="1.8"/>
    <ellipse cx="32" cy="34" rx="16" ry="17" fill="#ea580c"/>
    <path d="M 18 26 L 26 30 L 18 35 Z" fill="#9a3412"/>
    <path d="M 46 26 L 38 30 L 46 35 Z" fill="#9a3412"/>
    <circle cx="22" cy="43" r="3" fill="#2dd4bf" opacity="0.9"/>
    <circle cx="43" cy="21" r="2.6" fill="#2dd4bf" opacity="0.9"/>
    <ellipse cx="25" cy="31" rx="3.4" ry="2.8" fill="#fef08a"/>
    <ellipse cx="39" cy="31" rx="3.4" ry="2.8" fill="#fef08a"/>
    <circle cx="25" cy="31" r="1.4" fill="#451a03"/>
    <circle cx="39" cy="31" r="1.4" fill="#451a03"/>
    <polygon points="32,33 35.5,37 32,41 28.5,37" fill="#fb923c" stroke="#7c2d12" stroke-width="1.4"/>
    <path d="M 24 46 L 32 43 L 40 46" stroke="#451a03" stroke-width="2.2" fill="none"/>
  </svg>`,
  boss_agate_warden: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#0c1c38"/>
    <polygon points="18,8 28,24 10,24" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5"/>
    <polygon points="46,8 54,24 36,24" fill="#bae6fd" stroke="#0284c7" stroke-width="1.5"/>
    <ellipse cx="32" cy="34" rx="15" ry="16" fill="#38bdf8" stroke="#0369a1" stroke-width="1.6"/>
    <path d="M 21 27 L 29 30" stroke="#0c4a6e" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M 43 27 L 35 30" stroke="#0c4a6e" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="26" cy="32" r="2.5" fill="#0f172a"/>
    <circle cx="38" cy="32" r="2.5" fill="#0f172a"/>
    <path d="M 26 42 Q 32 39 38 42" stroke="#0c4a6e" stroke-width="2" fill="none"/>
    <ellipse cx="32" cy="54" rx="5" ry="3.5" fill="#7dd3fc" stroke="#0c4a6e" stroke-width="1.4"/>
  </svg>`,
  boss_topaz_fusion: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#271d06"/>
    <rect x="13" y="10" width="38" height="14" rx="4" fill="#fef08a" stroke="#ca8a04" stroke-width="1.6"/>
    <rect x="12" y="21" width="40" height="33" rx="8" fill="#eab308" stroke="#854d0e" stroke-width="2"/>
    <circle cx="15" cy="37" r="4.5" fill="#fde047" stroke="#854d0e" stroke-width="1.5"/>
    <circle cx="49" cy="37" r="4.5" fill="#fde047" stroke="#854d0e" stroke-width="1.5"/>
    <rect x="21" y="30" width="7" height="3.2" rx="1" fill="#422006"/>
    <rect x="36" y="30" width="7" height="3.2" rx="1" fill="#422006"/>
    <line x1="25" y1="43" x2="39" y2="43" stroke="#422006" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,
  boss_robonoid_titan: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#0d1720"/>
    <circle cx="32" cy="32" r="21" fill="#334155" stroke="#94a3b8" stroke-width="2.2"/>
    <circle cx="32" cy="32" r="14" fill="#0f172a"/>
    <polygon points="32,20 43,39 21,39" fill="#22c55e" stroke="#86efac" stroke-width="1.8"/>
    <circle cx="32" cy="32" r="4.2" fill="#ffffff"/>
    <line x1="11" y1="32" x2="18" y2="32" stroke="#38bdf8" stroke-width="2.5"/>
    <line x1="46" y1="32" x2="53" y2="32" stroke="#38bdf8" stroke-width="2.5"/>
  </svg>`,
  boss_white_diamond: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#0f172a"/>
    <polygon points="32,4 38,18 54,10 43,24 58,32 42,38 48,52 32,44 16,52 22,38 6,32 21,24 10,10 26,18" fill="#e2e8f0" opacity="0.28"/>
    <ellipse cx="32" cy="35" rx="16" ry="18" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.8"/>
    <polygon points="32,18 37,24 32,30 27,24" fill="#ffffff" stroke="#64748b" stroke-width="1.5"/>
    <path d="M 21 34 L 28 36 L 22 37 Z" fill="#0f172a"/>
    <path d="M 43 34 L 36 36 L 42 37 Z" fill="#0f172a"/>
    <path d="M 27 45 Q 32 43 37 45" stroke="#334155" stroke-width="1.8" fill="none"/>
  </svg>`,
  corrupted_gem: `<svg viewBox="0 0 64 64" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" rx="14" fill="#1e0b16"/>
    <polygon points="32,8 52,22 46,52 18,52 12,22" fill="#be123c" stroke="#fda4af" stroke-width="2.2"/>
    <polygon points="32,16 42,26 38,44 26,44 22,26" fill="#f43f5e"/>
    <path d="M 22 28 L 29 33 L 22 37 Z" fill="#fef08a"/>
    <path d="M 42 28 L 35 33 L 42 37 Z" fill="#fef08a"/>
  </svg>`
};

function getGuardianAvatarHtml(charId, size = 44) {
  const cId = (charId || 'steven').toLowerCase();
  const imgUrl = (typeof PORTRAIT_IMAGES !== 'undefined' && PORTRAIT_IMAGES[cId]) ? PORTRAIT_IMAGES[cId] : '';
  const theme = (typeof OVERDRIVE_THEMES !== 'undefined' && OVERDRIVE_THEMES[cId]) ? OVERDRIVE_THEMES[cId].color :
                (typeof CANON_FUSIONS !== 'undefined' && CANON_FUSIONS[cId]) ? CANON_FUSIONS[cId].color : '#f472b6';
  const radius = Math.round(size * 0.22);

  if (imgUrl) {
    return `<div class="guardian-avatar-frame" data-char="${cId}" style="width:${size}px;height:${size}px;border-radius:${radius}px;background:radial-gradient(circle at 50% 25%, ${theme}33, rgba(15,23,42,0.92));border:1.5px solid ${theme}88;overflow:hidden;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 3px 10px rgba(0,0,0,0.45);">
      <img src="${imgUrl}" alt="${cId}" style="width:108%;height:108%;object-fit:cover;object-position:50% 22%;display:block;pointer-events:none;" />
    </div>`;
  }
  const villainSvg = VILLAIN_PORTRAITS[cId] ||
    ((cId.startsWith('boss_') || cId.includes('corrupt') || cId === 'villain') ? VILLAIN_PORTRAITS.corrupted_gem : '');
  if (villainSvg) {
    return `<span class="guardian-svg-wrap villain-portrait-wrap" data-char="${cId}" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;border-radius:${radius}px;overflow:hidden;">${villainSvg}</span>`;
  }
  const svg = GUARDIAN_PORTRAITS[cId] || GUARDIAN_PORTRAITS.steven;
  return `<span class="guardian-svg-wrap" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">${svg}</span>`;
}

function getGuardianSvg(charId, size = 44) {
  return getGuardianAvatarHtml(charId, size);
}

const CHARACTER_STATS = {
  // Balanced Roles:
  // Defenders/Healers (Steven, Rose): High HP & DEF + strong healing, modest raw Attack
  // Power Strikers/Juggernauts (Garnet, Jasper, Bismuth): High ATK & solid DEF, NO healing
  // Speed/Precision Duelists (Pearl, Connie): High Speed & Crit, lower HP/DEF
  // Elemental/Tech Controllers (Lapis, Peridot): High Magic/Zoning, lower melee ATK
  // Wild Rushdown (Amethyst): Balanced momentum bruiser
  steven:   { hp: 165, attack: 25, magic: 40, defense: 56, critChance: 0.14, critDamage: 1.55 },
  garnet:   { hp: 155, attack: 52, magic: 34, defense: 44, critChance: 0.20, critDamage: 1.75 },
  amethyst: { hp: 140, attack: 42, magic: 32, defense: 36, critChance: 0.22, critDamage: 1.70 },
  pearl:    { hp: 115, attack: 38, magic: 46, defense: 28, critChance: 0.32, critDamage: 1.95 },
  bismuth:  { hp: 170, attack: 54, magic: 30, defense: 52, critChance: 0.16, critDamage: 1.75 },
  peridot:  { hp: 145, attack: 25, magic: 48, defense: 46, critChance: 0.16, critDamage: 1.55 },
  lapis:    { hp: 120, attack: 26, magic: 60, defense: 26, critChance: 0.18, critDamage: 1.75 },
  rose:     { hp: 180, attack: 28, magic: 46, defense: 58, critChance: 0.16, critDamage: 1.60 },
  connie:   { hp: 108, attack: 44, magic: 20, defense: 24, critChance: 0.38, critDamage: 2.10 },
  jasper:   { hp: 175, attack: 58, magic: 22, defense: 46, critChance: 0.18, critDamage: 1.85 }
};

const FUSION_STATS = {
  stevonnie:      { hp: 230, attack: 58, magic: 52, defense: 54, critChance: 0.34, critDamage: 2.05 },
  smoky:          { hp: 245, attack: 54, magic: 56, defense: 56, critChance: 0.26, critDamage: 1.85 },
  rainbow2:       { hp: 220, attack: 48, magic: 68, defense: 50, critChance: 0.30, critDamage: 1.95 },
  sunstone:       { hp: 270, attack: 64, magic: 60, defense: 64, critChance: 0.24, critDamage: 1.85 },
  sugilite:       { hp: 295, attack: 78, magic: 48, defense: 62, critChance: 0.25, critDamage: 2.00 },
  sardonyx:       { hp: 260, attack: 64, magic: 66, defense: 58, critChance: 0.28, critDamage: 1.95 },
  opal:           { hp: 235, attack: 52, magic: 70, defense: 48, critChance: 0.36, critDamage: 2.05 },
  malachite:      { hp: 310, attack: 72, magic: 76, defense: 66, critChance: 0.24, critDamage: 1.95 },
  rainbowClassic: { hp: 255, attack: 56, magic: 72, defense: 54, critChance: 0.32, critDamage: 1.95 }
};

function getHeroCombatStats(charId, fusionData = null, isPinkRevived = false) {
  let base;
  if (fusionData && fusionData.id && FUSION_STATS[fusionData.id]) {
    base = FUSION_STATS[fusionData.id];
  } else if (fusionData && Array.isArray(fusionData.gems)) {
    const a = CHARACTER_STATS[fusionData.gems[0]] || CHARACTER_STATS.steven;
    const b = CHARACTER_STATS[fusionData.gems[1]] || CHARACTER_STATS.garnet;
    base = {
      hp: Math.round((a.hp + b.hp) * 0.85),
      attack: Math.round((a.attack + b.attack) * 0.78),
      magic: Math.round((a.magic + b.magic) * 0.78),
      defense: Math.round((a.defense + b.defense) * 0.72),
      critChance: Math.min(0.45, Math.max(a.critChance, b.critChance) + 0.06),
      critDamage: Math.max(a.critDamage, b.critDamage) + 0.10
    };
  } else {
    base = CHARACTER_STATS[charId] || CHARACTER_STATS.steven;
  }
  const out = { ...base };
  if (isPinkRevived && charId === 'connie' && !fusionData) {
    out.hp += 25;
    out.magic += 18;
    out.defense += 6;
    out.critChance = Math.min(0.50, out.critChance + 0.05);
  }
  return out;
}

const GUARDIAN_DATA = {
  steven: {
    id: 'steven',
    name: 'Steven Universe',
    icon: '⭐',
    types: ['FAIRY', 'PSYCHIC'],
    title: 'The Heart of the Crystal Gems',
    desc: 'Rose Punch Combo • Bouncing Shield Throw • Crystalline Bubble & Healing Saliva (+1 Heart)',
    lore: 'Half-human, half-gem hero. Uses Rose Quartz\'s magical shield, his canon healing saliva, and channels his terrifying Pink Overdrive state — plus a well-earned Cookie Cat snack when things get rough!',
    j: { name: 'Shield Strike', icon: '🛡️', desc: 'Fast shield bash and punch combo with pink star sparks' },
    k: { name: 'Shield Throw', icon: '💫', desc: 'Bouncing Rose Shield projectile ricocheting off foes (35 DMG)' },
    l: { name: 'Bubble & Heal', icon: '🫧', desc: 'Spawns a crystalline Bubble Shield shockwave and restores +1 Heart with his healing saliva (canon power)' }
  },
  garnet: {
    id: 'garnet',
    name: 'Garnet',
    icon: '🥊',
    types: ['FIGHT', 'PSYCHIC'],
    title: 'Leader of the Crystal Gems (Ruby & Sapphire Fusion)',
    desc: 'Heavy Gauntlet Combo • Rocket Gauntlet Blast • Giant Gauntlets Seismic Slam',
    lore: 'Physical powerhouse and leader of the Crystal Gems. Made of love, packing twin spiked rocket gauntlets and the ability to enlarge them into titanic Giant Gauntlets that crush the earth!',
    j: { name: 'Gauntlet Combo', icon: '🥊', desc: 'Heavy dual spiked gauntlet punch flurry with KAPOW! impact' },
    k: { name: 'Rocket Gauntlet', icon: '🚀', desc: 'Fires rocket-propelled spiked gauntlets across the screen (40 DMG)' },
    l: { name: 'Giant Gauntlets Slam', icon: '💥', desc: 'Enlarges gauntlets to titanic size and slams downward with high-voltage seismic tremor (65 DMG)' }
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst',
    icon: '🟣',
    types: ['FIGHT', 'DARK'],
    title: 'Wild Earth-Born Quartz Warrior',
    desc: 'Spiked Dual Whip Flurry • Sonic Spin Dash (Quartz Buzzsaw) • Dual Whip Violet Energy Geysers',
    lore: 'Earth-born warrior from Prime Kindergarten. Attacks with spiked dual whips, curls into a high-speed rotating Quartz Buzzsaw ball, and erupts 4 rising violet volcanic energy geysers!',
    j: { name: 'Whip Flurry', icon: '🟣', desc: 'Dual whip slashing combo sweeping through nearby enemies' },
    k: { name: 'Sonic Spin Dash', icon: '🌀', desc: 'Authentic Quartz Buzzsaw roll charging through enemy ranks at high speed (45 DMG)' },
    l: { name: 'Whip Quake', icon: '🔥', desc: 'Slams both whips into the ground, cracking the arena in four violet shockwaves (40 DMG each)' }
  },
  pearl: {
    id: 'pearl',
    name: 'Pearl',
    icon: '🗡️',
    types: ['PSYCHIC', 'FIGHT'],
    title: 'Elegant Tactician & Master Spearwoman',
    desc: 'Spear Flurry • Laser Blast • Holo-Pearl Training Clone',
    lore: 'Graceful swordmaster and spear prodigy. Summons holographic Holo-Pearl sparring clones and pierces corruptions with laser beams!',
    j: { name: 'Spear Flurry', icon: '🗡️', desc: 'Rapid thrusting spear combo piercing enemy defenses' },
    k: { name: 'Holo-Spear Volley', icon: '✨', desc: 'Projects three hard-light Holo-Pearl spears that pierce through the corruption (35 DMG)' },
    l: { name: 'Holo-Pearl Clone', icon: '🤺', desc: 'Summons an animated holographic sparring clone that dashes forward lunging with fencing thrusts (55 DMG)' }
  },
  bismuth: {
    id: 'bismuth',
    name: 'Bismuth',
    icon: '🔨',
    types: ['STEEL', 'FIGHT'],
    title: 'Master Blacksmith & Weapon Forger',
    desc: 'Heavy Knockback Hammers • Forged Anvil Toss • Breaking Point Molten Fissure',
    lore: 'Legendary Crystal Gem blacksmith with a 98-facet rainbow crystal. Her brutal hammer swings and anvil launches send enemies flying backward, while the Breaking Point ruptures molten fissures!',
    j: { name: 'Heavy Hammer Combo', icon: '🔨', desc: 'Shapeshifting 4-hit blacksmith chain: Hammer Swing → Battle-Axe Cleave → Forge Upper → Molten Anvil Slam' },
    k: { name: 'Molten Hammer Leap', icon: '⚒️', desc: '[MELEE LEAP] Vaults forward with a titanic shapeshifted Forge Hammer, crashing down in a close-range molten shockwave!' },
    l: { name: 'Breaking Point', icon: '🌋', desc: 'Shatters the ground with the Breaking Point, catapulting enemies into the air with lava plumes (70 DMG)' }
  },
  peridot: {
    id: 'peridot',
    name: 'Peridot',
    icon: '🔩',
    types: ['STEEL', 'ELECTR'],
    title: 'Certified Kindergartener & Metal Master',
    desc: 'Ferrokinetic Swipes • Scrap Metal Salvo (3 Magnetic Scraps) • Flask Robonoid Drone & EMP Vortex',
    lore: 'Former Homeworld technician who discovered ferrokinesis on Earth! Controls metal scraps, hurls levitating scrap salvos, and deploys Homeworld Flask Robonoids with EMP magnetic vortex fields!',
    j: { name: 'Magnetic Swipe', icon: '🔩', desc: 'Quick ferrokinetic scrap swipe combo knocking back targets' },
    k: { name: 'Scrap Salvo', icon: '⚙️', desc: 'Levitates and hurls 3 magnetic scrap chunks: steel girder, gear, and trash lid (24 DMG each)' },
    l: { name: 'Flask Robonoid', icon: '🤖', desc: 'Deploys a walking Homeworld Flask Robonoid drone & concentric Magnetic EMP Vortex (55 DMG)' }
  },
  lapis: {
    id: 'lapis',
    name: 'Lapis Lazuli',
    icon: '💧',
    types: ['WATER', 'FLYING'],
    title: 'Powerful Hydrokinetic Gem',
    desc: 'Water Scythe Combo • Hydro Fist • Giant Tidal Wave Surge',
    lore: 'Powerful Gem capable of controlling Earth\'s oceans. Manifests majestic liquid water wings and summons tidal waves!',
    j: { name: 'Water Scythe', icon: '💧', desc: 'Fluid liquid blade slash combo cutting through multiple monsters' },
    k: { name: 'Hydro Fist', icon: '🌊', desc: 'Launches a massive pressurized water fist projectile (40 DMG)' },
    l: { name: 'Tidal Wave', icon: '🌀', desc: 'Summons a roaring ocean tidal wave crashing across the battlefield (60 DMG)' }
  },
  rose: {
    id: 'rose',
    name: 'Rose Quartz',
    icon: '🌹',
    types: ['FIGHT', 'FAIRY'],
    title: 'Founder & Commander of the Rebellion',
    desc: 'Rose Broadsword Slash • Bouncing Rose Crest • Sacred Tears of Resurrection (+2 Hearts)',
    lore: 'Rebel leader who fought for organic life on Earth. Wields her custom broadsword, throws her indestructible spinning crest shield, and weeps Sacred Tears of Life that blossom into a pink mandala restoring +2 Hearts and dropping 2 Cookie Cats!',
    j: { name: 'Rose Sword', icon: '🌹', desc: 'Graceful broadsword strikes with rose petal flurry and impact stars' },
    k: { name: 'Rose Crest Shield', icon: '🛡️', desc: 'Hurls high-speed spinning Rose Quartz crest shield (40 DMG)' },
    l: { name: 'Sacred Tears of Life', icon: '💖', desc: 'Blossoms an 8-petaled Rose Mandala shockwave, restoring +2 Hearts and spawning 2 Cookie Cats (50 DMG)' }
  },
  connie: {
    id: 'connie',
    name: 'Connie Maheswaran',
    icon: '⚔️',
    types: ['NORMAL', 'FIGHT'],
    title: 'Swordmaster & Knight of the Crystal Gems',
    desc: 'Knight Fencing Flurry • Pink Sword Flying Arc • Shadow Step Blade Dash',
    lore: 'Human sword prodigy trained in classical fencing and combat choreography by Pearl. Armed with the custom Pink Sword forged by Bismuth, Connie dashes swiftly across battlefields, parrying corruptions and executing high-velocity sword flurries!',
    j: { name: 'Iaido Sword Flurry', icon: '⚔️', desc: 'Lightning 4-hit swordmaster chain: Quick Draw → Diagonal Cross → Vaulting Crescent → Helm-Splitter!' },
    k: { name: 'Sworn Iai-Lunge', icon: '💨', desc: "[MELEE DASH] Pure human swordcraft — dashes straight through enemies with a razor-close crescent cut & deflects shots!" },
    l: { name: 'Tactical Parry', icon: '⚡', desc: 'The guard stance Pearl drilled into her — slips through every strike, then answers it (60 DMG)' }
  },
  jasper: {
    id: 'jasper',
    name: 'Jasper',
    icon: '💥',
    types: ['FIGHT', 'DRAGON'],
    title: 'Supreme Beta Quartz Juggernaut',
    desc: 'Beta Brawler Flurry • Crash Helmet Bull-Rush • Quartz Tornado Spin Dash',
    lore: 'The ultimate Quartz soldier born from the Beta Kindergarten. Pure physical brutality with zero ranged gimmicks — overwhelms enemies with armored Crash Helmet bull-rushes, seismic haymakers, and unstoppable Quartz Spin Dashes!',
    j: { name: 'Beta Juggernaut', icon: '👊', desc: 'Brutal 4-hit brawler chain: Crushing Haymaker → Shoulder Ram → Horned Uppercut → Seismic Helmet Crash!' },
    k: { name: 'Crash Helmet Bull-Rush', icon: '🪖', desc: '[MELEE CHARGE] Summons her spiked Crash Helmet and physically rockets forward as an armored battering ram (no ranged shot!)' },
    l: { name: 'Quartz Tornado', icon: '🔥', desc: 'Curls into a flaming spiked Beta Spin Dash ball erupting seismic shockwaves (65 DMG)' }
  }
};

// ============================================================================
// 6.2. CANONICAL GEM FUSION REGISTRY (OFFICIAL STEVEN UNIVERSE LORE)
// ============================================================================
const CANON_FUSIONS = {
  'connie+steven': {
    id: 'stevonnie',
    name: 'Stevonnie',
    title: 'Knight & Guardian',
    gems: ['steven', 'connie'],
    icon: '⚔️🛡️',
    weapon: 'Rose’s Sword & Shield',
    color: '#ec4899',
    glowColor: '#f472b6',
    scale: 1.25,
    maxHpBonus: 100,
    quote: '"I am an experience! Stevonnie, sword and shield!"',
    j: { name: 'Sword & Shield Strikes', desc: 'Rapid blade slashes and shield bash' },
    k: { name: 'Shield Hover Dropkick', desc: 'Glides on shield and dropkicks' },
    l: { name: 'Rose Sword Wave', desc: 'Giant crescent blade shockwave' }
  },
  'amethyst+steven': {
    id: 'smoky',
    name: 'Smoky Quartz',
    title: 'Yo-Yo Brawler',
    gems: ['steven', 'amethyst'],
    icon: '🪀🌪️',
    weapon: 'Triple Yo-Yo',
    color: '#a855f7',
    glowColor: '#c084fc',
    scale: 1.35,
    maxHpBonus: 120,
    quote: '"What does a fusion of an Amethyst and a Steven make? Smoky Quartz!"',
    j: { name: 'Triple Yo-Yo Flurry', desc: 'Sweeping 3-armed yo-yo swings' },
    k: { name: 'Yo-Yo Grapple Slam', desc: 'Pulls enemies in and slams them' },
    l: { name: 'Cyclone Tornado', desc: 'Supersonic yo-yo vacuum whirlwind' }
  },
  'pearl+steven': {
    id: 'rainbow2',
    name: 'Rainbow Quartz 2.0',
    title: 'Acrobatic Showman',
    gems: ['steven', 'pearl'],
    icon: '☂️🌈',
    weapon: 'Magic Rainbow Parasol',
    color: '#38bdf8',
    glowColor: '#f472b6',
    scale: 1.3,
    maxHpBonus: 115,
    quote: '"Well, hello there! Did you miss us?"',
    j: { name: 'Parasol Fencing', desc: 'Rapier thrusts and umbrella spin' },
    k: { name: 'Rocket Parasol Float', desc: 'Rockets forward with rainbow trail' },
    l: { name: 'Prism Laser Cannon', desc: 'Giant rainbow laser cannon' }
  },
  'garnet+steven': {
    id: 'sunstone',
    name: 'Sunstone',
    title: 'Solar Superhero',
    gems: ['steven', 'garnet'],
    icon: '☀️🔥',
    weapon: 'Flame Suction Gauntlets',
    color: '#f97316',
    glowColor: '#fde047',
    scale: 1.45,
    maxHpBonus: 140,
    quote: '"Always remember to stay in school and check both ways before crossing!"',
    j: { name: 'Solar Flame Punches', desc: 'Rapid flaming fist strikes' },
    k: { name: 'Solar Rocket Fist', desc: 'Launches rocket gauntlet forward' },
    l: { name: 'Supernova Burst', desc: 'Full-screen solar flare blast' }
  },
  'amethyst+garnet': {
    id: 'sugilite',
    name: 'Sugilite',
    title: 'Power Titan',
    gems: ['garnet', 'amethyst'],
    icon: '🟣⛓️',
    weapon: 'Spiked Wrecking Flail',
    color: '#7e22ce',
    glowColor: '#9333ea',
    scale: 1.65,
    maxHpBonus: 180,
    quote: '"You like that, little man? You want some more?!"',
    j: { name: 'Spiked Flail Smash', desc: 'Heavy crushing flail swings' },
    k: { name: 'Earthquake Stomp', desc: 'Ground shockwaves in both directions' },
    l: { name: 'Flail Cataclysm', desc: 'Crater explosion on the ground' }
  },
  'garnet+pearl': {
    id: 'sardonyx',
    name: 'Sardonyx',
    title: 'Theatrical Showstopper',
    gems: ['garnet', 'pearl'],
    icon: '🔨✨',
    weapon: 'Colossal War Hammer',
    color: '#fb7185',
    glowColor: '#fdba74',
    scale: 1.55,
    maxHpBonus: 150,
    quote: '"Good evening, everybody! It is I, the lovely Sardonyx!"',
    j: { name: 'War Hammer Swings', desc: 'Hammer strikes with spinning waist' },
    k: { name: 'Hammer Drill Charge', desc: 'Spins 360 degrees drilling forward' },
    l: { name: 'Showstopper Finale', desc: 'Spotlight fireworks stage blast' }
  },
  'amethyst+pearl': {
    id: 'opal',
    name: 'Opal',
    title: 'The Giant Woman Archer',
    gems: ['pearl', 'amethyst'],
    icon: '🏹🌟',
    weapon: 'Giant Recurve Bow',
    color: '#818cf8',
    glowColor: '#c084fc',
    scale: 1.55,
    maxHpBonus: 135,
    quote: '"Stay low... All you wanna do is see me turn into a giant woman..."',
    j: { name: 'Bow & Arrow Strikes', desc: '4-armed palm and arrow strikes' },
    k: { name: '5-Arrow Light Volley', desc: 'Fires 5 fanning light arrows' },
    l: { name: 'Celestial Light Rain', desc: '24 golden arrows rain from above' }
  },
  'jasper+lapis': {
    id: 'malachite',
    name: 'Malachite',
    title: 'Abyssal Juggernaut',
    gems: ['lapis', 'jasper'],
    icon: '🌊🧊',
    weapon: 'Water Wings & Ice Claws',
    color: '#0d9488',
    glowColor: '#2dd4bf',
    scale: 1.75,
    maxHpBonus: 190,
    quote: '"I\'m done being everyone\'s prisoner. Now you\'re my prisoner! And I\'m never letting you go!"',
    j: { name: 'Six-Arm Hydro Claws', desc: 'Crushing water claw thrashes' },
    k: { name: 'Glacial Ice Slam', desc: 'Summons frozen ice fist from below' },
    l: { name: 'Abyssal Tsunami Cage', desc: 'Two tidal waves crash together' }
  },
  'pearl+rose': {
    id: 'rainbowClassic',
    name: 'Rainbow Quartz',
    title: 'Rebellion Dancer',
    gems: ['rose', 'pearl'],
    icon: '🌹🩰',
    weapon: 'Rose Parasol & Rapier',
    color: '#f43f5e',
    glowColor: '#fda4af',
    scale: 1.45,
    maxHpBonus: 135,
    quote: '"What can I do for you? What can I do that no one else can do?"',
    j: { name: 'Ballet Blade Pirouette', desc: 'Spinning blade and parasol dance' },
    k: { name: 'Petal Barrier Thrust', desc: 'Charges with glowing rose shield' },
    l: { name: 'Prismatic Tears Dance', desc: 'Rose petal storm and team heal' }
  }
};

Object.values(GUARDIAN_DATA).forEach(g => {
  if (g && CHARACTER_STATS[g.id]) g.stats = { ...CHARACTER_STATS[g.id] };
});
Object.values(CANON_FUSIONS).forEach(f => {
  if (f && FUSION_STATS[f.id]) f.stats = { ...FUSION_STATS[f.id] };
});

const COOP_FUSION_MOVES = {
  stevonnie: {
    p1: {
      j: { icon: '⚔️', name: 'Knight Rapier', type: 'ATTACK' },
      k: { icon: '🛡️', name: 'Hover Dropkick', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '🛡️', name: 'Shield Bash Rush', type: 'ATTACK' },
      k: { icon: '⚔️', name: 'Rose Sword Wave', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  smoky: {
    p1: {
      j: { icon: '🪀', name: 'Yo-Yo Whip Flurry', type: 'ATTACK' },
      k: { icon: '💫', name: 'Yo-Yo Grapple Slam', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '🛡️', name: 'Shield Yo-Yo Spin', type: 'ATTACK' },
      k: { icon: '🌪️', name: 'Cyclone Whirlwind', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  rainbow2: {
    p1: {
      j: { icon: '☂️', name: 'Parasol Thrust', type: 'ATTACK' },
      k: { icon: '🚀', name: 'Rocket Parasol', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '✨', name: 'Rainbow Flourish', type: 'ATTACK' },
      k: { icon: '🌈', name: 'Prismatic Laser', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  sunstone: {
    p1: {
      j: { icon: '☀️', name: 'Suction Slap', type: 'ATTACK' },
      k: { icon: '🥊', name: 'Solar Rocket Punch', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '🛡️', name: 'Solar Shield Slam', type: 'ATTACK' },
      k: { icon: '🛹', name: 'Safety PSA Wave', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  sugilite: {
    p1: {
      j: { icon: '🟣', name: 'Giant Flail Sweep', type: 'ATTACK' },
      k: { icon: '💥', name: 'Earthquake Stomp', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '🥊', name: 'Dual Fist Smash', type: 'ATTACK' },
      k: { icon: '☄️', name: 'Wrecking Catapult', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  sardonyx: {
    p1: {
      j: { icon: '🔨', name: 'War Hammer Smash', type: 'ATTACK' },
      k: { icon: '💫', name: 'Spinning Drill', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '✨', name: 'Stage Bow & Clap', type: 'ATTACK' },
      k: { icon: '💥', name: 'Colossal Slam', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  opal: {
    p1: {
      j: { icon: '🏹', name: 'Bow Slash Combo', type: 'ATTACK' },
      k: { icon: '✨', name: '5-Arrow Volley', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '💫', name: 'Piercing Light Shot', type: 'ATTACK' },
      k: { icon: '🌧️', name: 'Grand Light Rain', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  malachite: {
    p1: {
      j: { icon: '🌊', name: 'Hydro Crash Claws', type: 'ATTACK' },
      k: { icon: '🧊', name: 'Glacial Ice Slam', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '💧', name: 'Water Wing Whirl', type: 'ATTACK' },
      k: { icon: '🌊', name: 'Water Tomb Blast', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  },
  rainbowClassic: {
    p1: {
      j: { icon: '🌹', name: 'Rose Petal Rapier', type: 'ATTACK' },
      k: { icon: '🛡️', name: 'Barrier Thrust', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    },
    p2: {
      j: { icon: '✨', name: 'Elegant Pirouette', type: 'ATTACK' },
      k: { icon: '🌸', name: 'Celestial Mandala', type: 'SPECIAL' },
      l: { icon: '🌟', name: 'Harmony [H+L]', type: 'HARMONY' },
      i: { icon: '💨', name: 'Flash Step', type: 'EVADE' }
    }
  }
};

function getCanonFusion(charA, charB) {
  if (!charA || !charB || charA === charB) return null;
  const k1 = `${charA}+${charB}`;
  const k2 = `${charB}+${charA}`;
  return CANON_FUSIONS[k1] || CANON_FUSIONS[k2] || null;
}

function getCompatibleFusionPartners(charId) {
  const partners = [];
  const allChars = ['steven', 'garnet', 'amethyst', 'pearl', 'bismuth', 'peridot', 'lapis', 'rose', 'connie', 'jasper'];
  for (const other of allChars) {
    if (other !== charId) {
      const f = getCanonFusion(charId, other);
      if (f) partners.push({ partnerId: other, fusion: f });
    }
  }
  return partners;
}

// ============================================================================
// 6.5. BULLETPROOF PERSISTENT STORAGE (FALLS BACK TO MEMORY ON file:/// ORIGIN)
// ============================================================================
// ============================================================================
// 6.2. STORY SCRIPT — one beat per wave, following the show's own arc.
// Episodes 1-10 map onto Seasons 1-5, so the cast talks about what they are
// actually going through in that part of the story. `party` / `partner` resolve
// to whoever the player brought, so the lines stay in character for any roster.
// ============================================================================
// ============================================================================
// CONCEPT UI: ARCADE MAPS, STORY CUTSCENES, FINALE & LORE PUZZLES
// ============================================================================
const ARCADE_MAPS = [
  { stage: 1, name: 'Beach City Boardwalk', tag: 'EPISODE 1', boss: 'boss_spitter', bossName: 'ALPHA CENTIPEETLE MOTHER', mobs: ['centipeetle', 'acid_centipeetle', 'winged_centipeetle'] },
  { stage: 2, name: 'Galaxy Warp & Spire', tag: 'EPISODE 2', boss: 'boss_giant_bird', bossName: 'ANCIENT SPIRE COLOSSUS', mobs: ['blade_quartz', 'spire_harpy', 'centipeetle'] },
  { stage: 3, name: 'Prime Kindergarten', tag: 'EPISODE 3', boss: 'boss_cluster_titan', bossName: 'KINDERGARTEN AMALGAM TITAN', mobs: ['cluster', 'blade_quartz', 'acid_centipeetle'] },
  { stage: 4, name: "Earth's Mantle Core", tag: 'EPISODE 4', boss: 'boss_cluster_core', bossName: 'GEO-WEAPON CLUSTER CORE', mobs: ['cluster', 'obsidian', 'volcanic_firebird'] },
  { stage: 5, name: "Bismuth's Burning Forge", tag: 'EPISODE 5', boss: 'boss_forge_guardian', bossName: 'ANCIENT FORGE SENTINEL', mobs: ['forge_automaton', 'volcanic_firebird', 'carnelian_enforcer'] },
  { stage: 6, name: 'The Frozen North', tag: 'EPISODE 6', boss: 'boss_jasper', bossName: 'CORRUPTED JASPER', mobs: ['ice_monster', 'snow_monster', 'ice_gargoyle'] },
  { stage: 7, name: "Pink Diamond's Zoo", tag: 'EPISODE 7', boss: 'boss_agate_warden', bossName: 'HOLLY BLUE AGATE', mobs: ['carnelian_enforcer', 'destabilizer_soldier', 'blade_quartz'] },
  { stage: 8, name: 'Homeworld Abduction Shore', tag: 'EPISODE 8', boss: 'boss_topaz_fusion', bossName: 'TOPAZ FUSION GUARD', mobs: ['destabilizer_soldier', 'robonoid_scout', 'obsidian'] },
  { stage: 9, name: 'Homeworld Trial & Off-Colors', tag: 'EPISODE 9', boss: 'boss_robonoid_titan', bossName: 'ROBONOID HUNTER COLOSSUS', mobs: ['robonoid_scout', 'destabilizer_soldier', 'forge_automaton'] },
  { stage: 10, name: 'Diamond Mecha Throne', tag: 'EPISODE 10', boss: 'boss_white_diamond', bossName: 'WHITE DIAMOND SUPREME MECHA', mobs: ['obsidian', 'destabilizer_soldier', 'robonoid_scout', 'cluster'] }
];

const STORY_CUTSCENES = {
  1: {
    tag: 'EPISODE 1 · GEM GLOW & BEACH CITY',
    lines: [
      { scene: 'beach', w: 'pearl', t: "Steven! Another cluster of Centipeetle corruptions warped onto Beach City beach!" },
      { scene: 'beach', w: 'amethyst', t: "Chill, P! Steven's got Cookie Cats ready and we've got backup!" },
      { scene: 'beach', w: 'garnet', t: "Stay sharp. Before we breach the shore ruins, align the Crystal Temple glyph seal." }
    ]
  },
  2: {
    tag: 'EPISODE 2 · GALAXY WARP & SEA SPIRE',
    lines: [
      { scene: 'warp', w: 'garnet', t: "These ancient warp streams link Earth to Homeworld's fallen outposts." },
      { scene: 'warp', w: 'steven', t: "Look at those cracked shard murals! If we match them, the Sea Spire bridge opens!" }
    ]
  },
  4: {
    tag: 'EPISODE 4 · INTO THE CLUSTER',
    lines: [
      { scene: 'mantle', w: 'peridot', t: "We're miles under Earth's crust! Align Steven's prism mirrors or the Cluster tears the mantle apart!" },
      { scene: 'mantle', w: 'steven', t: "Hold tight, Peridot — we can calm them just like real Gems!" }
    ]
  },
  6: {
    tag: 'EPISODE 6 · CRACK OF THE FROZEN NORTH',
    lines: [
      { scene: 'ice', w: 'amethyst', t: "Jasper's tracking corrupted beasts out in the blizzard... she won't listen to reason!" },
      { scene: 'ice', w: 'steven', t: "Then we stand together—no Gem has to shatter today!" }
    ]
  },
  8: {
    tag: 'EPISODE 8 · ARE YOU MY DAD?',
    lines: [
      { scene: 'homeworld', w: 'connie', t: "Aquamarine and Topaz captured half our friends on Beach City shore!" },
      { scene: 'homeworld', w: 'steven', t: "Not on our watch. Let's crack this Homeworld lock and rescue them all!" }
    ]
  },
  10: {
    tag: 'EPISODE 10 · CHANGE YOUR MIND',
    lines: [
      { scene: 'mecha', w: 'steven', t: "White Diamond's colossal ship looms ahead! Everything Rose left behind leads here." },
      { scene: 'mecha', w: 'garnet', t: "Steven, whatever happens in her throne room... you already know who you truly are." }
    ]
  }
};

const STORY_FINALE_CUTSCENE = {
  tag: 'FINALE · CHANGE YOUR MIND — ERA 3 PEACE',
  lines: [
    { scene: 'pink_merge', w: 'steven', t: "\"SHE'S GONE!!\" When White Diamond pulled my gem out, my Pink half held me tight... I don't need to be anyone else. I'm Steven." },
    { scene: 'white_blush', w: 'pearl', t: "Look! White Diamond finally saw color—even she isn't flawless, and now she wants to understand!" },
    { scene: 'fountain', w: 'garnet', t: "Back at Rose's Healing Fountain on Earth, all four Diamonds poured their essence together. Centipeetle, Jasper, and every corrupted Gem are finally free!" },
    { scene: 'era3', w: 'steven', t: "No more fighting. Welcome to Era 3, everyone—and thank you for believing in Steven!" }
  ]
};

const STORY_PUZZLE_CONFIGS = {
  1: {
    kind: 'pattern',
    title: 'TEMPLE DOOR HARMONY SEAL',
    desc: 'Watch the 4 Crystal Gems glow one by one, then click them back in that exact order.',
    hint: 'Say the order aloud by Gem color (Pink -> Red -> Blue -> Purple). Press RESET PUZZLE anytime to rewatch.'
  },
  2: {
    kind: 'memory',
    title: 'GALAXY WARP PRISM RESONANCE',
    desc: 'Click two tiles to flip them over. Find all 4 matching Gem pairs to unlock the warp.',
    hint: 'Go row by row from top-left to bottom-right so you always remember where each symbol sits.'
  },
  3: {
    kind: 'conduit',
    title: 'KINDERGARTEN INJECTOR BYPASS',
    desc: 'Rotate the pipes to link ➔ IN (top-left) to OUT ➔ (bottom-right). Pink glow shows live power!',
    hint: 'Step 1: Rotate top-left (➔ IN) until it catches the left arrow and glows pink. Step 2: Rotate the dark pipe right next to the pink end until power reaches OUT ➔.'
  },
  4: {
    kind: 'mirrors',
    title: 'MANTLE CLUSTER LIGHT PRISM',
    desc: 'Click mirrors (/ or \\) to bounce the Starlight beam from top-left ➔ into bottom-right LOCK.',
    hint: 'Top-left fires light RIGHT. Set the first lit mirror to "\\" to turn the beam DOWN, then use another "\\" at the bottom to aim RIGHT into LOCK.'
  },
  5: {
    kind: 'conduit',
    title: "BISMUTH'S LAVA FORGE GATE",
    desc: 'Rotate pipes so power flows unbroken from ➔ IN (top-left) to OUT ➔ (bottom-right).',
    hint: 'Follow the glowing pink tip! Wherever the pink pipe points into a dark tile, click that dark tile to connect it toward OUT ➔.'
  },
  6: {
    kind: 'memory',
    title: 'NORTH SEA ICE SHARD SEAL',
    desc: 'Flip two tiles at a time and match all 4 ancient Gem insignia pairs.',
    hint: 'Focus on pairing the Ice Crystal and Forge Flame emblems first to clear half the board quickly.'
  },
  7: {
    kind: 'pattern',
    title: 'SPACE ZOO CONTAINMENT CODE',
    desc: 'Watch the 4-step Crystal chime sequence, then repeat the exact same order.',
    hint: 'All 4 Gem tiles light up once per sequence—track each step cleanly and tap RESET PUZZLE if you want another preview.'
  },
  8: {
    kind: 'mirrors',
    title: 'AQUAMARINE SHUTTLE PRISM LOCK',
    desc: 'Click mirrors (/ or \\) to guide the yellow light beam around stone pillars into LOCK.',
    hint: 'Follow the yellow beam: flip the mirror at the end of a lit beam to "\\" to steer RIGHT -> DOWN or DOWN -> RIGHT toward LOCK.'
  },
  9: {
    kind: 'conduit',
    title: 'OFF-COLORS ESCAPE CONDUIT',
    desc: 'Click pipes to rotate 90° and carry power from ➔ IN (top-left) all the way to OUT ➔ (bottom-right).',
    hint: 'Start at ➔ IN on the top-left so its left end turns pink, then chase the lit end step by step down-right until OUT ➔ turns green!'
  },
  10: {
    kind: 'mirrors',
    title: 'DIAMOND STARLIGHT NEXUS',
    desc: 'Click prism mirrors (/ or \\) to deflect the Starlight beam past pillars into White Diamond’s LOCK.',
    hint: 'Keep "\\" mirrors at corners where you want RIGHT -> DOWN or DOWN -> RIGHT turns, skipping over any dark rock pillar.'
  }
};

const STORY_SCRIPT = {
  1: {
    map: 'Beach City Boardwalk',
    waves: [
      [{ w: 'garnet', t: "Centipeetles. Three of them, right on the boardwalk." },
       { w: 'steven',  t: "Three?! Okay. Okay okay okay. I can do three." },
       { w: 'amethyst', t: "You can do one. We'll take the other two." }],
      [{ w: 'pearl', t: "They're nesting behind the fry stand — mind the civilians!" },
       { w: 'amethyst', t: "Ohhh, so THAT'S why we don't just smash everything." },
       { w: 'pearl', t: "It has literally always been why, Amethyst." }],
      [{ w: 'steven', t: "Hey... that little one isn't attacking. It's guarding something." },
       { w: 'garnet', t: "Corrupted gems aren't evil, Steven. They're frightened." },
       { w: 'steven', t: "Then we bubble them gently. Nobody gets hurt." }],
      [{ w: 'amethyst', t: "Uh, guys? The big one's awake. Like, tower-of-mother big." },
       { w: 'pearl', t: "Formation! Backs to the water!" },
       { w: 'steven', t: "I've got the shield — let's finish this on the sand!" }]
    ],
    boss: [
      { w: 'villain', n: 'MOTHER CENTIPEETLE', i: '🐛', t: 'SCREEEEEE!' },
      { w: 'steven', t: "She's protecting her babies. We are NOT the enemy here." },
      { w: 'garnet', t: "Then show her, Steven. Kindness first. Shield second." }
    ]
  },
  2: {
    map: 'Galaxy Warp & Spire',
    waves: [
      [{ w: 'pearl', t: "The Galaxy Warp is cracked. Every pad we cross could fling us anywhere in the galaxy." },
       { w: 'garnet', t: "Then we walk. Slowly." },
       { w: 'amethyst', t: "Booooring. I vote fling." }],
      [{ w: 'steven', t: "This place is ancient. Like, before-Beach-City ancient." },
       { w: 'garnet', t: "Older than the town. Older than the coastline. Older than me." }],
      [{ w: 'pearl', t: "Blade Quartzes. They were soldiers once — Rose's own allies." },
       { w: 'steven', t: "Do they remember her?" },
       { w: 'pearl', t: "...I don't think they remember anything at all." }],
      [{ w: 'amethyst', t: "Spire's waking up. That's a LOT of stairs, even for me." },
       { w: 'steven', t: "Race you to the top?" },
       { w: 'amethyst', t: "You're on, chubs. Loser buys Cookie Cats." }]
    ],
    boss: [
      { w: 'villain', n: 'ANCIENT SPIRE GIANT BIRD', i: '🦅', t: 'KRAAAAA!' },
      { w: 'garnet', t: "It slept through the war. It doesn't even know it lost." },
      { w: 'steven', t: "Then let's put it back to sleep. Gently this time." }
    ]
  },
  3: {
    map: 'The Prime Kindergarten',
    waves: [
      [{ w: 'amethyst', t: "Welcome to my birthplace. Home sweet hole." },
       { w: 'steven', t: "You were... made here? Out of that wall?" },
       { w: 'amethyst', t: "Every hole is a gem. One of 'em's me." }],
      [{ w: 'pearl', t: "The injectors are still humming. This place should have died a thousand years ago." },
       { w: 'amethyst', t: "It's not dead, P. It's just empty. There's a difference." }],
      [{ w: 'amethyst', t: "Homeworld used this place up, then left it to rot — with us inside." },
       { w: 'steven', t: "That's horrible." },
       { w: 'amethyst', t: "Yeah. But I got you guys out of it. So. There's that." }],
      [{ w: 'amethyst', t: "Cluster mutants. Gems that didn't make it out of the ground right." },
       { w: 'steven', t: "Then we bubble every single one of them." },
       { w: 'amethyst', t: "Now you're talking like a Crystal Gem." }]
    ],
    boss: [
      { w: 'villain', n: 'KINDERGARTEN AMALGAM TITAN', i: '🪨', t: 'GRRRRAAAH!' },
      { w: 'amethyst', t: "That titan's the Kindergarten's last tantrum." },
      { w: 'steven', t: "Then let's give it a hug." },
      { w: 'amethyst', t: "A punch-hug. My favourite kind." }
    ]
  },
  4: {
    map: "Earth's Mantle — The Cluster",
    waves: [
      [{ w: 'peridot', t: "The Cluster is gestating at the planet's core. We have HOURS, not days!" },
       { w: 'steven', t: "Then we drill. Right now." },
       { w: 'peridot', t: "I hate that that's the plan. I hate that it's a GOOD plan!" }],
      [{ w: 'peridot', t: "Warning: mantle unstable. Also warning: I am extremely not built for this!" },
       { w: 'steven', t: "You're doing amazing, Peridot." },
       { w: 'peridot', t: "I know! Keep saying it!" }],
      [{ w: 'steven', t: "They're all fused together down here. Millions of them." },
       { w: 'peridot', t: "They didn't choose it. Nobody asked them. That's what Homeworld DOES." }],
      [{ w: 'peridot', t: "If the Cluster wakes, Earth cracks like an egg and we are the YOLK!" },
       { w: 'garnet', t: "Then it stays asleep. Permanently." },
       { w: 'peridot', t: "Garnet said 'permanently' and I felt that in my gem." }]
    ],
    boss: [
      { w: 'villain', n: 'GEO-WEAPON CLUSTER CORE', i: '🌋', t: '...who... am... I...' },
      { w: 'peridot', t: "It's aware! It's confused! It's ALSO enormous!" },
      { w: 'steven', t: "Then we talk to it. Gems can be talked to." }
    ]
  },
  5: {
    map: "Bismuth's Burning Forge",
    waves: [
      [{ w: 'bismuth', t: "Welcome to my workshop! Best forge on Earth — mind the lava, it bites." },
       { w: 'steven', t: "You made ALL of Rose's weapons here?" },
       { w: 'bismuth', t: "Every last one. Even the ones she never used." }],
      [{ w: 'bismuth', t: "Rose's sword? My finest work. Built it to cut anything except a gem." },
       { w: 'pearl', t: "We agreed never to speak about the Breaking Point." },
       { w: 'bismuth', t: "Yeah, well. We agreed a lot of things, Pearl." }],
      [{ w: 'bismuth', t: "These automatons were mine — turned on us the day Homeworld took the forge." },
       { w: 'steven', t: "Can you fix them?" },
       { w: 'bismuth', t: "Fix? Buddy, I'm gonna BREAK 'em." }],
      [{ w: 'garnet', t: "Bismuth, focus. The forge is fighting back." },
       { w: 'bismuth', t: "Forge is MINE. It knows better than to fight me." },
       { w: 'garnet', t: "...It's a building, Bismuth." }]
    ],
    boss: [
      { w: 'villain', n: 'ANCIENT FORGE SENTINEL', i: '🔥', t: 'SYSTEM: INTRUDER.' },
      { w: 'bismuth', t: "Big, hot, ugly. My specialty." },
      { w: 'steven', t: "Together?" },
      { w: 'bismuth', t: "Always, little man." }
    ]
  },
  6: {
    map: 'The Frozen North',
    waves: [
      [{ w: 'lapis', t: "I can feel him under the ice. Jasper." },
       { w: 'steven', t: "You don't have to do this." },
       { w: 'lapis', t: "I know. That's exactly why I'm doing it." }],
      [{ w: 'lapis', t: "When we were Malachite, I held us both at the bottom of the ocean. For months." },
       { w: 'steven', t: "Lapis..." },
       { w: 'lapis', t: "I'm not that person anymore. I need him to know that." }],
      [{ w: 'garnet', t: "The corruption is eating him alive." },
       { w: 'lapis', t: "He asked for power. He got it." },
       { w: 'garnet', t: "Nobody deserves this. Not even him." }],
      [{ w: 'jasper', t: "You think you can beat me, runt?!" },
       { w: 'steven', t: "I think we can SAVE you!" },
       { w: 'jasper', t: "SAVE THIS!" }]
    ],
    boss: [
      { w: 'villain', n: 'CORRUPTED JASPER', i: '🐯', t: "BETA'S FINEST DOESN'T LOSE!" },
      { w: 'garnet', t: "You already did, Jasper. You lost yourself." },
      { w: 'steven', t: "But you can still come back. I've seen it." }
    ]
  },
  7: {
    map: "Pink Diamond's Space Zoo",
    waves: [
      [{ w: 'pearl', t: "A Human Zoo. They kept people in here. Like collectibles." },
       { w: 'steven', t: "That's... really messed up." },
       { w: 'pearl', t: "Yes. That's one word for it." }],
      [{ w: 'garnet', t: "Blue Diamond's gems still run this place." },
       { w: 'pearl', t: "Then we go quietly. Or loudly. I'm flexible." },
       { w: 'garnet', t: "You're never quiet." }],
      [{ w: 'steven', t: "These Zoomans are happy. They don't know anything else exists." },
       { w: 'lapis', t: "Freedom you don't know you're missing isn't freedom. It's a cage with nice wallpaper." }],
      [{ w: 'garnet', t: "Agate's wardens hold the control room." },
       { w: 'pearl', t: "I'll take the controls. You take the smashy part." },
       { w: 'garnet', t: "Finally. A plan I like." }]
    ],
    boss: [
      { w: 'villain', n: 'HOLY BLUE AGATE WARDEN', i: '🔷', t: 'HOW DARE YOU TOUCH MY ZOO!' },
      { w: 'pearl', t: "Cruel, petty, and loud." },
      { w: 'garnet', t: "Then she'll be very loud when she loses." }
    ]
  },
  8: {
    map: 'Homeworld Abduction Shore',
    waves: [
      [{ w: 'steven', t: "They're taking humans. Like they took Dad." },
       { w: 'connie', t: "Not on our beach. Not today." },
       { w: 'steven', t: "Connie, you're terrifying." },
       { w: 'connie', t: "Thank you!" }],
      [{ w: 'connie', t: "Pearl taught me to hold a sword. She didn't teach me to lose." },
       { w: 'steven', t: "That's... actually a little scary, Connie." },
       { w: 'connie', t: "Good!" }],
      [{ w: 'garnet', t: "Topaz fusion. Two gems, one body, and no choice in the matter." },
       { w: 'steven', t: "That's not a fusion. That's a prison." },
       { w: 'garnet', t: "Exactly." }],
      [{ w: 'steven', t: "Aquamarine's ship is lifting! If it clears the beach, those people are gone!" },
       { w: 'connie', t: "Then it doesn't clear the beach." },
       { w: 'steven', t: "I love it when you say things like that!" }]
    ],
    boss: [
      { w: 'villain', n: 'FUSED TOPAZ ENFORCER', i: '💛', t: 'ORDERS ARE ORDERS.' },
      { w: 'connie', t: "They're not evil. They're scared." },
      { w: 'steven', t: "Then let's be brave enough for both of them!" }
    ]
  },
  9: {
    map: 'Homeworld Trial & Off-Colors',
    waves: [
      [{ w: 'steven', t: "The courtroom. Last time I stood here, I was on trial for Mom's murder." },
       { w: 'connie', t: "And this time?" },
       { w: 'steven', t: "This time I brought backup." }],
      [{ w: 'steven', t: "I'm not alone anymore." },
       { w: 'pearl', t: "You never were, Steven." },
       { w: 'garnet', t: "We're right here." }],
      [{ w: 'garnet', t: "Off-Colors. Rhodonite, Padparadscha, Fluorite. Gems Homeworld threw away." },
       { w: 'steven', t: "Then they're Crystal Gems now." },
       { w: 'garnet', t: "That's the whole idea, yes." }],
      [{ w: 'garnet', t: "The Robonoid Hunter was built to find runaway gems." },
       { w: 'steven', t: "Good! Let it find us!" },
       { w: 'pearl', t: "Steven, that is NOT a strategy!" },
       { w: 'steven', t: "It's a LITTLE bit of a strategy!" }]
    ],
    boss: [
      { w: 'villain', n: 'ROBONOID HUNTER COLOSSUS', i: '🤖', t: 'TARGETS ACQUIRED.' },
      { w: 'pearl', t: "Aim for the core!" },
      { w: 'steven', t: "Every gem deserves a chance. Even the one hunting us." }
    ]
  },
  10: {
    map: 'Change Your Mind — Era 3',
    waves: [
      [{ w: 'steven', t: "White Diamond's mecha is the size of a CITY." },
       { w: 'garnet', t: "Then we make ourselves the size of a problem." },
       { w: 'amethyst', t: "Now THAT I can work with!" }],
      [{ w: 'connie', t: "Everyone's here. All of us." },
       { w: 'bismuth', t: "All of us is what Homeworld is afraid of." },
       { w: 'steven', t: "Then let's give them something to be afraid of!" }],
      [{ w: 'pearl', t: "White Diamond believes she is perfect. Perfection doesn't bend." },
       { w: 'steven', t: "Then I'll bend it." },
       { w: 'pearl', t: "...That's either very brave or very stupid." },
       { w: 'steven', t: "Both! It's both!" }],
      [{ w: 'steven', t: "I'm not Rose Quartz. I'm not Pink Diamond. I'm Steven." },
       { w: 'garnet', t: "And that's enough." },
       { w: 'amethyst', t: "Yeah it is!" }]
    ],
    boss: [
      { w: 'villain', n: 'WHITE DIAMOND SUPREME MECHA', i: '💎', t: 'I AM PERFECTION.' },
      { w: 'steven', t: "No. You're just scared of being wrong." },
      { w: 'garnet', t: "Era 3 starts here." }
    ]
  }
};

// Boss portraits we do not have art for are represented by an emoji crest.
const STORY_VILLAIN_COLORS = {
  1: '#22c55e', 2: '#06b6d4', 3: '#a855f7', 4: '#f97316', 5: '#ef4444',
  6: '#ea580c', 7: '#3b82f6', 8: '#eab308', 9: '#94a3b8', 10: '#f8fafc'
};

const SafeStorage = {
  _mem: {},
  getItem(key) {
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        const val = window.localStorage.getItem(key);
        if (val !== null && val !== undefined) return val;
      }
    } catch (e) {
      // Chrome blocks localStorage access on file:/// origin with SecurityError
    }
    return Object.prototype.hasOwnProperty.call(this._mem, key) ? this._mem[key] : null;
  },
  setItem(key, value) {
    const strVal = String(value);
    this._mem[key] = strVal;
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.setItem(key, strVal);
      }
    } catch (e) {
      // LocalStorage access is blocked or quota exceeded
    }
  },
  removeItem(key) {
    delete this._mem[key];
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
  }
};

function safeJsonParse(str, fallback) {
  if (!str) return fallback;
  try {
    return JSON.parse(str);
  } catch (e) {
    return fallback;
  }
}

// ============================================================================
// 7. MAIN GAME CONTROLLER & HUD SYNCHRONIZER
// ============================================================================
// ============================================================================
// 7.0. SUPER-MOVE PORTRAITS
// Painted bust portraits for the Overdrive / Fusion cut-ins. Drawn with Canvas so
// they scale cleanly to the 340px cut-in frame, and cached as data URLs.
// ============================================================================
const PORTRAIT_SPECS = {
  steven:   { skin: '#f7d3bd', shade: '#e6b49b', hair: '#2a1720', hairType: 'curls',  outfit: '#e8453c', collar: '#f4766f', gem: '#f472b6', accent: '#ffd166', star: true,  freckles: true,  eyes: '#2b1b3a' },
  garnet:   { skin: '#8b4a42', shade: '#73372f', hair: '#1b0d26', hairType: 'cube',   outfit: '#7f1d3a', collar: '#a32448', gem: '#ef4444', accent: '#f472b6', visor: '#2a1050', eyes: '#fde047' },
  amethyst: { skin: '#c99ae8', shade: '#a875cc', hair: '#e9d5ff', hairType: 'long',   outfit: '#1f1235', collar: '#31224f', gem: '#7c3aed', accent: '#c084fc', star: true, eyes: '#2b1b3a' },
  pearl:    { skin: '#fff3e6', shade: '#f2d6bd', hair: '#f7dcc4', hairType: 'peak',   outfit: '#38bdf8', collar: '#7dd3fc', gem: '#f8fafc', accent: '#f9a8d4', gemHead: true, eyes: '#1e3a5f' },
  bismuth:  { skin: '#94a3b8', shade: '#6f7c8f', hair: '#7c3aed', hairType: 'dreads', outfit: '#475569', collar: '#64748b', gem: '#ec4899', accent: '#f59e0b', eyes: '#1f2937' },
  peridot:  { skin: '#b7f27a', shade: '#8fd456', hair: '#d9f99d', hairType: 'triangle', outfit: '#14532d', collar: '#166534', gem: '#a3e635', accent: '#4ade80', gemHead: true, visor: '#0f2b1c', eyes: '#052e16' },
  lapis:    { skin: '#7cc7e8', shade: '#5aa7cc', hair: '#172554', hairType: 'bob',   outfit: '#1e3a8a', collar: '#2563eb', gem: '#38bdf8', accent: '#bae6fd', eyes: '#082f49' },
  rose:     { skin: '#f9b9d0', shade: '#e694b3', hair: '#f472b6', hairType: 'bigcurls', outfit: '#fdf2f8', collar: '#fbcfe8', gem: '#fb7185', accent: '#fda4af', eyes: '#3f1226' },
  connie:   { skin: '#a9714b', shade: '#8a5738', hair: '#1c1917', hairType: 'wavy',  outfit: '#f9a8d4', collar: '#fbcfe8', gem: null,      accent: '#2dd4bf', eyes: '#1c1917' },
  jasper:   { skin: '#f2a65a', shade: '#d98a3c', hair: '#fde9d2', hairType: 'mane',   outfit: '#7f1d1d', collar: '#991b1b', gem: '#fbbf24', accent: '#f97316', noseGem: true, stripes: true, eyes: '#3f1d0b' },
  stevonnie:      { skin: '#b8794f', shade: '#98603b', hair: '#241a17', hairType: 'wavy',    outfit: '#e8453c', collar: '#f9a8d4', gem: '#f472b6', accent: '#f9a8d4', star: true, eyes: '#241a17' },
  smoky:          { skin: '#b98bdd', shade: '#9668bb', hair: '#e9d5ff', hairType: 'long',    outfit: '#e8453c', collar: '#c084fc', gem: '#a855f7', accent: '#c084fc', star: true, eyes: '#2b1b3a' },
  rainbow2:       { skin: '#fff3e6', shade: '#f2d6bd', hair: '#f7dcc4', hairType: 'peak',    outfit: '#f9a8d4', collar: '#38bdf8', gem: '#ffffff', accent: '#38bdf8', eyes: '#1e3a5f' },
  sunstone:       { skin: '#c66a3c', shade: '#a8542c', hair: '#1b0d26', hairType: 'cube',    outfit: '#f97316', collar: '#fbbf24', gem: '#ef4444', accent: '#fbbf24', star: true, eyes: '#3f1d0b' },
  sugilite:       { skin: '#a06bd0', shade: '#7f4fae', hair: '#e9d5ff', hairType: 'long',    outfit: '#a21caf', collar: '#d946ef', gem: '#7c3aed', accent: '#f472b6', eyes: '#2b1b3a' },
  sardonyx:       { skin: '#a35a4a', shade: '#864438', hair: '#f7dcc4', hairType: 'peak',    outfit: '#7f1d3a', collar: '#14b8a6', gem: '#fb923c', accent: '#14b8a6', eyes: '#3f1226' },
  opal:           { skin: '#dcc7ea', shade: '#c0a6d4', hair: '#f8fafc', hairType: 'peak',    outfit: '#0f766e', collar: '#2dd4bf', gem: '#22d3ee', accent: '#a5f3fc', eyes: '#164e63' },
  malachite:      { skin: '#7cc7e8', shade: '#59a3c4', hair: '#f8fafc', hairType: 'mane',    outfit: '#0f766e', collar: '#38bdf8', gem: '#38bdf8', accent: '#67e8f9', eyes: '#082f49' },
  rainbowClassic: { skin: '#f9b9d0', shade: '#e694b3', hair: '#f472b6', hairType: 'bigcurls',outfit: '#fdf2f8', collar: '#fbcfe8', gem: '#ffffff', accent: '#fda4af', eyes: '#3f1226' }
};

function portraitHairBack(ctx, spec, W, H) {
  const c = spec.hair;
  ctx.fillStyle = c;
  if (spec.hairType === 'cube' || spec.hairType === 'afro') {
    ctx.beginPath(); ctx.roundRect(W * 0.16, H * 0.05, W * 0.68, H * 0.50, W * 0.10); ctx.fill();
  } else if (spec.hairType === 'long' || spec.hairType === 'wavy' || spec.hairType === 'bigcurls' || spec.hairType === 'mane') {
    const spread = spec.hairType === 'bigcurls' ? 0.10 : 0.06;
    ctx.beginPath();
    ctx.moveTo(W * 0.33, H * 0.16);
    ctx.bezierCurveTo(W * (0.20 - spread), H * 0.34, W * (0.19 - spread), H * 0.62, W * (0.27 - spread * 0.7), H * 0.78);
    ctx.lineTo(W * (0.73 + spread * 0.7), H * 0.78);
    ctx.bezierCurveTo(W * (0.81 + spread), H * 0.62, W * (0.80 + spread), H * 0.34, W * 0.67, H * 0.16);
    ctx.closePath(); ctx.fill();
  } else if (spec.hairType === 'dreads') {
    for (let i = 0; i < 7; i++) {
      const t = i / 6;
      ctx.fillStyle = ['#ef4444','#f97316','#eab308','#22c55e','#3b82f6','#a855f7','#ec4899'][i];
      ctx.beginPath();
      ctx.ellipse(W * (0.16 + t * 0.68), H * (0.22 + Math.sin(t * Math.PI) * 0.10), W * 0.055, H * 0.24, t * 0.5 - 0.25, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.hairType === 'bob') {
    ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.35, W * 0.29, H * 0.30, 0, 0, Math.PI * 2); ctx.fill();
  } else if (spec.hairType === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(W * 0.5, H * 0.02); ctx.lineTo(W * 0.86, H * 0.42);
    ctx.lineTo(W * 0.14, H * 0.42); ctx.closePath(); ctx.fill();
  } else if (spec.hairType === 'peak') {
    ctx.beginPath(); ctx.ellipse(W * 0.5, H * 0.31, W * 0.26, H * 0.26, 0, 0, Math.PI * 2); ctx.fill();
  } else { // curls
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (0.15 + i * 0.12);
      ctx.beginPath();
      ctx.arc(W * 0.5 + Math.cos(a) * W * 0.30, H * 0.34 - Math.sin(a) * H * 0.16, W * 0.13, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

function drawPortrait(ctx, id, size = 512) {
  const spec = PORTRAIT_SPECS[id] || PORTRAIT_SPECS.steven;
  const W = size, H = size;
  const ink = 'rgba(42, 16, 32, 0.92)';
  const lw = W * 0.016;
  ctx.clearRect(0, 0, W, H);

  const cx = W * 0.48;
  const headY = H * 0.385;
  const headRX = W * 0.225;
  const headRY = H * 0.245;

  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // ---- Raised arm (waving) behind the torso --------------------------------
  ctx.save();
  ctx.strokeStyle = spec.outfit;
  ctx.lineWidth = W * 0.115;
  ctx.beginPath();
  ctx.moveTo(W * 0.70, H * 0.80);
  ctx.quadraticCurveTo(W * 0.86, H * 0.68, W * 0.83, H * 0.47);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(42,16,32,0.55)';
  ctx.lineWidth = W * 0.012;
  ctx.stroke();
  // hand
  ctx.fillStyle = spec.skin;
  ctx.beginPath();
  ctx.arc(W * 0.83, H * 0.44, W * 0.052, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();
  ctx.restore();

  // ---- Shoulders / torso ---------------------------------------------------
  const torso = () => {
    ctx.beginPath();
    ctx.moveTo(W * 0.04, H * 1.02);
    ctx.quadraticCurveTo(W * 0.10, H * 0.72, W * 0.32, H * 0.64);
    ctx.lineTo(W * 0.64, H * 0.64);
    ctx.quadraticCurveTo(W * 0.86, H * 0.72, W * 0.92, H * 1.02);
    ctx.closePath();
  };
  ctx.fillStyle = spec.outfit;
  torso(); ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();

  // collar / neckline
  ctx.fillStyle = spec.collar || spec.outfit;
  ctx.beginPath();
  ctx.moveTo(W * 0.33, H * 0.655);
  ctx.quadraticCurveTo(cx, H * 0.86, W * 0.63, H * 0.655);
  ctx.quadraticCurveTo(cx, H * 0.75, W * 0.33, H * 0.655);
  ctx.fill();

  if (spec.star) {
    ctx.fillStyle = '#ffd166';
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7;
    const sx = cx, sy = H * 0.85, r = W * 0.062;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * (Math.PI * 2 / 5);
      ctx.lineTo(sx + Math.cos(a) * r, sy + Math.sin(a) * r);
      ctx.lineTo(sx + Math.cos(a + Math.PI / 5) * r * 0.45, sy + Math.sin(a + Math.PI / 5) * r * 0.45);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
  }

  // ---- Neck ---------------------------------------------------------------
  ctx.fillStyle = spec.shade;
  ctx.beginPath();
  ctx.roundRect(cx - W * 0.062, H * 0.545, W * 0.124, H * 0.135, W * 0.03);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();

  // ---- Hair (back volume) -------------------------------------------------
  portraitHairBack(ctx, spec, W, H);

  // ---- Head ---------------------------------------------------------------
  ctx.fillStyle = spec.skin;
  ctx.beginPath();
  ctx.ellipse(cx, headY, headRX, headRY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw; ctx.stroke();

  // cheek shading
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = spec.shade;
  ctx.beginPath();
  ctx.ellipse(cx, headY + headRY * 0.55, headRX * 0.72, headRY * 0.3, 0, 0, Math.PI);
  ctx.fill();
  ctx.restore();

  // ---- Face ---------------------------------------------------------------
  const eyeY = headY + H * 0.005;
  const eyeDX = W * 0.088;
  // whites
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(cx - eyeDX, eyeY, W * 0.055, H * 0.068, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + eyeDX, eyeY, W * 0.055, H * 0.068, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.8;
  ctx.beginPath();
  ctx.ellipse(cx - eyeDX, eyeY, W * 0.055, H * 0.068, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + eyeDX, eyeY, W * 0.055, H * 0.068, 0, 0, Math.PI * 2);
  ctx.stroke();
  // irises
  const irisGrad = ctx.createRadialGradient(cx - eyeDX, eyeY, 2, cx - eyeDX, eyeY, W * 0.05);
  irisGrad.addColorStop(0, spec.eyes || '#1f2937');
  irisGrad.addColorStop(1, '#0b0714');
  ctx.fillStyle = irisGrad;
  ctx.beginPath();
  ctx.ellipse(cx - eyeDX + W * 0.004, eyeY + H * 0.004, W * 0.033, H * 0.048, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + eyeDX + W * 0.004, eyeY + H * 0.004, W * 0.033, H * 0.048, 0, 0, Math.PI * 2);
  ctx.fill();
  // highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx - eyeDX - W * 0.008, eyeY - H * 0.016, W * 0.014, 0, Math.PI * 2);
  ctx.arc(cx + eyeDX - W * 0.008, eyeY - H * 0.016, W * 0.014, 0, Math.PI * 2);
  ctx.arc(cx - eyeDX + W * 0.016, eyeY + H * 0.020, W * 0.007, 0, Math.PI * 2);
  ctx.arc(cx + eyeDX + W * 0.016, eyeY + H * 0.020, W * 0.007, 0, Math.PI * 2);
  ctx.fill();

  // brows
  ctx.strokeStyle = spec.hair; ctx.lineWidth = W * 0.016;
  ctx.beginPath();
  ctx.moveTo(cx - eyeDX - W * 0.048, eyeY - H * 0.082);
  ctx.quadraticCurveTo(cx - eyeDX, eyeY - H * 0.105, cx - eyeDX + W * 0.048, eyeY - H * 0.080);
  ctx.moveTo(cx + eyeDX - W * 0.048, eyeY - H * 0.080);
  ctx.quadraticCurveTo(cx + eyeDX, eyeY - H * 0.105, cx + eyeDX + W * 0.048, eyeY - H * 0.082);
  ctx.stroke();

  // blush
  ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
  ctx.beginPath();
  ctx.ellipse(cx - W * 0.135, eyeY + H * 0.062, W * 0.042, H * 0.024, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + W * 0.135, eyeY + H * 0.062, W * 0.042, H * 0.024, 0, 0, Math.PI * 2);
  ctx.fill();

  // nose
  ctx.strokeStyle = spec.shade; ctx.lineWidth = W * 0.011;
  ctx.beginPath();
  ctx.moveTo(cx, headY + H * 0.072);
  ctx.quadraticCurveTo(cx + W * 0.018, headY + H * 0.10, cx - W * 0.004, headY + H * 0.108);
  ctx.stroke();

  // open, joyful smile
  ctx.fillStyle = '#7f1d3a';
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.075, headY + H * 0.135);
  ctx.quadraticCurveTo(cx, headY + H * 0.225, cx + W * 0.075, headY + H * 0.135);
  ctx.quadraticCurveTo(cx, headY + H * 0.165, cx - W * 0.075, headY + H * 0.135);
  ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.7; ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(cx - W * 0.062, headY + H * 0.140);
  ctx.quadraticCurveTo(cx, headY + H * 0.170, cx + W * 0.062, headY + H * 0.140);
  ctx.quadraticCurveTo(cx, headY + H * 0.152, cx - W * 0.062, headY + H * 0.140);
  ctx.fill();
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.ellipse(cx, headY + H * 0.185, W * 0.028, H * 0.016, 0, 0, Math.PI * 2);
  ctx.fill();

  // ---- Hair (front) -------------------------------------------------------
  ctx.fillStyle = spec.hair;
  ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.9;
  if (spec.hairType === 'peak') {
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.22, headY - H * 0.12);
    ctx.quadraticCurveTo(cx, headY - H * 0.42, cx + W * 0.22, headY - H * 0.12);
    ctx.quadraticCurveTo(cx, headY - H * 0.24, cx - W * 0.22, headY - H * 0.12);
    ctx.fill(); ctx.stroke();
  } else if (spec.hairType === 'triangle') {
    ctx.beginPath();
    ctx.moveTo(cx, headY - H * 0.36); ctx.lineTo(cx + W * 0.28, headY - H * 0.06);
    ctx.quadraticCurveTo(cx, headY - H * 0.20, cx - W * 0.28, headY - H * 0.06);
    ctx.closePath(); ctx.fill(); ctx.stroke();
  } else if (spec.hairType === 'cube') {
    ctx.beginPath();
    ctx.roundRect(cx - W * 0.26, headY - H * 0.34, W * 0.52, H * 0.20, W * 0.05);
    ctx.fill(); ctx.stroke();
  } else if (['bob', 'wavy', 'long', 'mane', 'bigcurls'].includes(spec.hairType)) {
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.23, headY - H * 0.08);
    ctx.quadraticCurveTo(cx - W * 0.14, headY - H * 0.38, cx, headY - H * 0.34);
    ctx.quadraticCurveTo(cx + W * 0.14, headY - H * 0.38, cx + W * 0.23, headY - H * 0.08);
    ctx.quadraticCurveTo(cx + W * 0.10, headY - H * 0.24, cx, headY - H * 0.21);
    ctx.quadraticCurveTo(cx - W * 0.10, headY - H * 0.24, cx - W * 0.23, headY - H * 0.08);
    ctx.fill(); ctx.stroke();
  } else {
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(cx + W * (i - 2) * 0.085, headY - H * 0.22 + Math.sin(i) * H * 0.02, W * 0.072, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
  }

  // ---- Gem ----------------------------------------------------------------
  if (spec.gem) {
    const gx = cx, gy = spec.gemHead ? headY - H * 0.245 : H * 0.755;
    const r = W * (spec.gemHead ? 0.045 : 0.058);
    ctx.save();
    ctx.translate(gx, gy);
    const g = ctx.createLinearGradient(-r, -r, r, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.45, spec.gem); g.addColorStop(1, spec.shade);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, -r); ctx.lineTo(r * 0.9, -r * 0.3); ctx.lineTo(r * 0.5, r);
    ctx.lineTo(-r * 0.5, r); ctx.lineTo(-r * 0.9, -r * 0.3);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = lw * 0.8; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath(); ctx.moveTo(0, -r * 0.8); ctx.lineTo(r * 0.34, -r * 0.2); ctx.lineTo(0, r * 0.1); ctx.lineTo(-r * 0.34, -r * 0.2);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  if (spec.noseGem) {
    ctx.fillStyle = spec.gem || '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(cx, headY + H * 0.055); ctx.lineTo(cx + W * 0.028, headY + H * 0.082);
    ctx.lineTo(cx, headY + H * 0.108); ctx.lineTo(cx - W * 0.028, headY + H * 0.082);
    ctx.closePath(); ctx.fill();
  }

  // ---- Accessories --------------------------------------------------------
  if (spec.visor) {
    ctx.fillStyle = spec.visor;
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.215, eyeY - H * 0.038);
    ctx.lineTo(cx + W * 0.215, eyeY - H * 0.038);
    ctx.lineTo(cx + W * 0.16, eyeY + H * 0.050);
    ctx.lineTo(cx - W * 0.16, eyeY + H * 0.050);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = spec.accent; ctx.lineWidth = lw; ctx.stroke();
    ctx.fillStyle = spec.eyes;
    ctx.beginPath();
    ctx.ellipse(cx - eyeDX, eyeY + H * 0.004, W * 0.026, H * 0.022, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + eyeDX, eyeY + H * 0.004, W * 0.026, H * 0.022, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  if (spec.stripes) {
    ctx.fillStyle = spec.accent;
    ctx.beginPath();
    ctx.moveTo(cx - W * 0.215, eyeY - H * 0.105); ctx.lineTo(cx - W * 0.115, eyeY - H * 0.075); ctx.lineTo(cx - W * 0.215, eyeY - H * 0.045);
    ctx.moveTo(cx + W * 0.215, eyeY - H * 0.105); ctx.lineTo(cx + W * 0.115, eyeY - H * 0.075); ctx.lineTo(cx + W * 0.215, eyeY - H * 0.045);
    ctx.fill();
  }
  if (spec.freckles) {
    ctx.fillStyle = 'rgba(190, 90, 90, 0.55)';
    [[-0.155, 0.055], [-0.115, 0.078], [-0.185, 0.082], [0.155, 0.055], [0.115, 0.078], [0.185, 0.082]].forEach(([dx, dy]) => {
      ctx.beginPath(); ctx.arc(cx + W * dx, headY + H * dy, W * 0.0085, 0, Math.PI * 2); ctx.fill();
    });
  }

  // ---- Rim light ----------------------------------------------------------
  ctx.save();
  ctx.globalAlpha = 0.4;
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = W * 0.02;
  ctx.beginPath();
  ctx.ellipse(cx, headY, headRX, headRY, 0, Math.PI * 1.10, Math.PI * 1.72);
  ctx.stroke();
  ctx.restore();

  // ---- Sparkles -----------------------------------------------------------
  const sparkle = (sx, sy, r) => {
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.moveTo(sx, sy - r); ctx.quadraticCurveTo(sx + r * 0.22, sy - r * 0.22, sx + r, sy);
    ctx.quadraticCurveTo(sx + r * 0.22, sy + r * 0.22, sx, sy + r);
    ctx.quadraticCurveTo(sx - r * 0.22, sy + r * 0.22, sx - r, sy);
    ctx.quadraticCurveTo(sx - r * 0.22, sy - r * 0.22, sx, sy - r);
    ctx.fill();
  };
  sparkle(W * 0.16, H * 0.18, W * 0.045);
  sparkle(W * 0.84, H * 0.22, W * 0.035);
  sparkle(W * 0.10, H * 0.62, W * 0.028);
  sparkle(W * 0.90, H * 0.70, W * 0.032);
}

// Official reference portraits (generated by tools/make_portraits.py) are drawn when
// available; the vector portrait is only a fallback.
const _portraitImages = {};
if (typeof PORTRAIT_IMAGES !== 'undefined') {
  Object.keys(PORTRAIT_IMAGES).forEach(id => {
    const img = new Image();
    img.decoding = 'async';
    img.src = PORTRAIT_IMAGES[id];
    _portraitImages[id] = img;
  });
}

// Official reference fusion sprites (full-body canon artwork)
const _fusionSprites = {};
if (typeof FUSION_SPRITES !== 'undefined') {
  Object.keys(FUSION_SPRITES).forEach(id => {
    const img = new Image();
    img.decoding = 'async';
    img.src = FUSION_SPRITES[id];
    _fusionSprites[id] = img;
  });
}

function drawPortraitCard(ctx, id, size = 512) {
  ctx.clearRect(0, 0, size, size);
  const img = _portraitImages[id];
  if (img && img.complete && img.naturalWidth > 0) {
    const theme = (typeof OVERDRIVE_THEMES !== 'undefined' && OVERDRIVE_THEMES[id]) ? OVERDRIVE_THEMES[id].color :
                  (typeof CANON_FUSIONS !== 'undefined' && CANON_FUSIONS[id]) ? CANON_FUSIONS[id].color : '#f472b6';

    // 1. Dynamic rotating energy rays behind character
    ctx.save();
    ctx.translate(size / 2, size * 0.50);
    ctx.globalAlpha = 0.28;
    ctx.fillStyle = theme;
    for (let i = 0; i < 16; i++) {
      ctx.rotate((Math.PI * 2) / 16);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(size * 0.035, -size * 0.85);
      ctx.lineTo(-size * 0.035, -size * 0.85);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();

    // 2. High-speed action slash stripes in signature gem color
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = theme;
    ctx.beginPath();
    ctx.moveTo(0, size * 0.36);
    ctx.lineTo(size, size * 0.16);
    ctx.lineTo(size, size * 0.29);
    ctx.lineTo(0, size * 0.49);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, size * 0.74);
    ctx.lineTo(size, size * 0.54);
    ctx.lineTo(size, size * 0.67);
    ctx.lineTo(0, size * 0.87);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 3. Draw pristine HD character portrait
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight) * 0.96;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (size - w) / 2, size - h - size * 0.02, w, h);
    ctx.restore();

    // 4. Sparkling four-point gem stars
    const spark = (sx, sy, r, a = 1.0) => {
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(sx, sy - r);
      ctx.quadraticCurveTo(sx + r * 0.18, sy - r * 0.18, sx + r, sy);
      ctx.quadraticCurveTo(sx + r * 0.18, sy + r * 0.18, sx, sy + r);
      ctx.quadraticCurveTo(sx - r * 0.18, sy + r * 0.18, sx - r, sy);
      ctx.quadraticCurveTo(sx - r * 0.18, sy - r * 0.18, sx, sy - r);
      ctx.fill();
      ctx.restore();
    };
    spark(size * 0.14, size * 0.22, size * 0.05, 0.95);
    spark(size * 0.86, size * 0.28, size * 0.038, 0.85);
    spark(size * 0.12, size * 0.65, size * 0.032, 0.75);
    spark(size * 0.88, size * 0.70, size * 0.042, 0.9);
    return true;
  }
  drawPortrait(ctx, id, size);
  return false;
}

const _portraitCache = {};
function getPortraitDataUrl(id, size = 512) {
  if (typeof PORTRAIT_IMAGES !== 'undefined' && PORTRAIT_IMAGES[id]) {
    return PORTRAIT_IMAGES[id];
  }
  const key = `${id}@${size}`;
  if (_portraitCache[key]) return _portraitCache[key];
  try {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    drawPortraitCard(canvas.getContext('2d'), id, size);
    _portraitCache[key] = canvas.toDataURL('image/png');
  } catch (e) {
    _portraitCache[key] = '';
  }
  return _portraitCache[key];
}

