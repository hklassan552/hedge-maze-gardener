/**
 * Visual preset: TROPICAL (from design-system/presets-index.md).
 * The brief overrides the accent colours only — the preset `name` stays untouched.
 * Style treatment: CLAYMORPHISM (soft inflated surfaces, double shadows, round corners).
 */
export const theme = {
  name: 'tropical',

  colors: {
    bg: {
      primary: '#132210', // deep garden backdrop
      secondary: '#1B3317',
      tertiary: '#265936', // raised panels, grass
      accent: '#0F2A18',
    },
    garden: {
      hedge: '#40AB2A', // fresh hedge green
      hedgeDeep: '#2E7D1E',
      leaf: '#7FD16A',
      magenta: '#C028E0', // main action accent
      magentaDeep: '#8C199F',
      petal: '#F2B6FF',
      stone: '#0B1509',
    },
    text: {
      primary: '#EAF0E9',
      secondary: '#D0DDCC',
      muted: '#A7B8A2',
      onBright: '#132210',
    },
    ui: {
      border: '#40AB2A55',
      borderStrong: '#40AB2A99',
      divider: '#40AB2A33',
      overlay: '#132210CC',
      glass: 'rgba(38, 89, 54, 0.78)',
      shadow: '#132210',
    },
  },

  gradients: {
    loader: ['#132210', '#265936', '#132210'] as string[],
    menu: ['#132210', '#265936', '#132210'] as string[],
    game: ['#132210', '#265936', '#132210'] as string[],
    walk: ['#265936', '#132210', '#265936'] as string[],
    result: ['#132210', '#265936', '#40AB2A'] as string[],
    panel: ['#2D6840', '#214E2E'] as string[],
    action: ['#C028E0', '#8C199F'] as string[],
    hedge: ['#55C93B', '#2E7D1E'] as string[],
    header: ['#132210', '#0F2A18'] as string[],
  },

  typography: {
    hero: { fontSize: 40, fontWeight: '700' as const, lineHeight: 44, letterSpacing: 0 },
    title: { fontSize: 24, fontWeight: '700' as const, lineHeight: 30, letterSpacing: 0 },
    section: { fontSize: 20, fontWeight: '700' as const, lineHeight: 26, letterSpacing: 0.2 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 22, letterSpacing: 0 },
    support: { fontSize: 15, fontWeight: '400' as const, lineHeight: 20, letterSpacing: 0 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16, letterSpacing: 0.6 },
    counter: { fontSize: 22, fontWeight: '700' as const, lineHeight: 26, letterSpacing: 0 },
    button: { fontSize: 18, fontWeight: '700' as const, lineHeight: 24, letterSpacing: 1 },
  },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  radius: { sm: 10, tile: 14, md: 16, panel: 18, lg: 22, pill: 100 },

  shadows: {
    panel: {
      shadowColor: '#132210',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
      elevation: 4,
    },
    action: {
      shadowColor: '#C028E0',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.45,
      shadowRadius: 14,
      elevation: 6,
    },
    clay: {
      shadowColor: '#0B1509',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.45,
      shadowRadius: 6,
      elevation: 3,
    },
  },

  animation: {
    press: { tension: 120, friction: 10 },
    bounce: { tension: 200, friction: 8 },
    quick: { duration: 180 },
    enter: { duration: 220 },
  },
};

export type Theme = typeof theme;
export default theme;
