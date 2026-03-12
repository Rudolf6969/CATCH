export const theme = {
  colors: {
    // Backgrounds — deep forest dark
    bg: '#0A120D',
    surface: '#111A14',
    surfaceHigh: '#1A2A1F',

    // Brand greens — forest & water
    primary: '#2D6A4F',
    primaryMid: '#52B788',

    // Accent — golden dawn
    accent: '#E9A84C',
    accentWarm: '#F4C97A',

    // Text — warm tones, nie studené
    textPrimary: '#F0EDE8',
    textSecondary: '#8A9E8F',
    textMuted: '#5A6E5F',

    // Semantic
    error: '#EF4444',
    errorSurface: 'rgba(239,68,68,0.1)',
    success: '#22C55E',
    warning: '#F59E0B',

    // Tab bar
    tabActive: '#52B788',
    tabInactive: '#5A6E5F',
    tabBar: '#0D1610',
    tabBorder: '#1A2A1F',

    // Dividers
    divider: '#1A2A1F',
    overlay: 'rgba(0,0,0,0.6)',

    // Borders — subtle forest glow
    cardBorder: 'rgba(82,183,136,0.12)',
    cardBorderActive: 'rgba(82,183,136,0.25)',
    inputBorderFocus: 'rgba(82,183,136,0.4)',
  },

  gradients: {
    card: ['rgba(82,183,136,0.05)', 'rgba(82,183,136,0)'],
    fab: ['#E9A84C', '#F4C97A'],
    primaryButton: ['#52B788', '#2D6A4F'],
    heroCard: ['rgba(82,183,136,0.08)', 'rgba(233,168,76,0.04)', 'rgba(82,183,136,0)'],
  },

  typography: {
    // Headings — Syne (bold, charakterný)
    heading: { fontFamily: 'Syne-Bold', fontSize: 24, lineHeight: 30 },
    headingLg: { fontFamily: 'Syne-Bold', fontSize: 28, lineHeight: 36 },
    headingSemi: { fontFamily: 'Syne-SemiBold', fontSize: 20, lineHeight: 26 },
    headingSm: { fontFamily: 'Syne-SemiBold', fontSize: 16, lineHeight: 22 },

    // Body — DM Sans (čistý, čitateľný)
    body: { fontFamily: 'DMSans-Regular', fontSize: 15, lineHeight: 22 },
    bodyMedium: { fontFamily: 'DMSans-Medium', fontSize: 15, lineHeight: 22 },
    bodySm: { fontFamily: 'DMSans-Regular', fontSize: 13, lineHeight: 18 },
    bodySmMedium: { fontFamily: 'DMSans-Medium', fontSize: 13, lineHeight: 18 },
    caption: { fontFamily: 'DMSans-Regular', fontSize: 11, lineHeight: 16 },

    // Mono — JetBrains Mono (čísla, štatistiky)
    mono: { fontFamily: 'JetBrainsMono-Regular', fontSize: 14, lineHeight: 20 },
    monoLg: { fontFamily: 'JetBrainsMono-Regular', fontSize: 20, lineHeight: 26 },
    monoSm: { fontFamily: 'JetBrainsMono-Regular', fontSize: 12, lineHeight: 16 },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 999,
  },

  shadow: {
    sm: {
      shadowColor: '#0A120D',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#0A120D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 6,
    },
    accent: {
      shadowColor: '#E9A84C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: {
      shadowColor: '#52B788',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
  },
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
