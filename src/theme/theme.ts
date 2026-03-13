export const theme = {
  colors: {
    // Backgrounds — pure dark like Instagram
    bg: '#000000',
    surface: '#000000',
    surfaceHigh: '#1A1A1A',

    // Brand — vibrant green (OnlyFish identity)
    primary: '#00D47E',
    primaryMid: '#00D47E',

    // Accent — warm gold for premium/special
    accent: '#FFD700',
    accentWarm: '#FFEB80',

    // Text — clean whites like IG
    textPrimary: '#FAFAFA',
    textSecondary: '#A8A8A8',
    textMuted: '#737373',

    // Semantic
    error: '#ED4956',
    errorSurface: 'rgba(237,73,86,0.1)',
    success: '#00D47E',
    warning: '#FFBB33',

    // Tab bar
    tabActive: '#FAFAFA',
    tabInactive: '#737373',
    tabBar: '#000000',
    tabBorder: '#262626',

    // Dividers
    divider: '#262626',
    overlay: 'rgba(0,0,0,0.85)',

    // Borders
    cardBorder: '#262626',
    cardBorderActive: '#363636',
    inputBorderFocus: 'rgba(0,212,126,0.5)',

    // Like
    likeRed: '#FF3040',

    // Story ring gradient colors
    storyGradientStart: '#00D47E',
    storyGradientEnd: '#00A8FF',
  },

  gradients: {
    card: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0)'],
    fab: ['#00D47E', '#00B86B'],
    primaryButton: ['#00D47E', '#00B86B'],
    heroCard: ['rgba(0,212,126,0.06)', 'rgba(0,168,255,0.03)', 'transparent'],
  },

  typography: {
    // Headings — Syne (brand identity)
    heading: { fontFamily: 'Syne-Bold', fontSize: 24, lineHeight: 30 },
    headingLg: { fontFamily: 'Syne-Bold', fontSize: 28, lineHeight: 36 },
    headingSemi: { fontFamily: 'Syne-SemiBold', fontSize: 20, lineHeight: 26 },
    headingSm: { fontFamily: 'Syne-SemiBold', fontSize: 16, lineHeight: 22 },

    // Body — DM Sans
    body: { fontFamily: 'DMSans-Regular', fontSize: 15, lineHeight: 22 },
    bodyMedium: { fontFamily: 'DMSans-Medium', fontSize: 15, lineHeight: 22 },
    bodySm: { fontFamily: 'DMSans-Regular', fontSize: 13, lineHeight: 18 },
    bodySmMedium: { fontFamily: 'DMSans-Medium', fontSize: 13, lineHeight: 18 },
    caption: { fontFamily: 'DMSans-Regular', fontSize: 11, lineHeight: 16 },

    // Mono — JetBrains Mono (stats)
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 6,
    },
    accent: {
      shadowColor: '#00D47E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    glow: {
      shadowColor: '#00D47E',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
  },
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
