export const theme = {
  colors: {
    // Backgrounds — clean white like Instagram
    bg: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceHigh: '#FAFAFA',

    // Brand — vibrant green (OnlyFish identity)
    primary: '#00B876',
    primaryMid: '#00B876',

    // Accent — warm orange/gold for premium/special
    accent: '#FF9500',
    accentWarm: '#FFB84D',

    // Text — dark on white like IG
    textPrimary: '#262626',
    textSecondary: '#8E8E8E',
    textMuted: '#C7C7C7',

    // Semantic
    error: '#ED4956',
    errorSurface: 'rgba(237,73,86,0.08)',
    success: '#00B876',
    warning: '#FFBB33',

    // Tab bar
    tabActive: '#262626',
    tabInactive: '#C7C7C7',
    tabBar: '#FFFFFF',
    tabBorder: '#EFEFEF',

    // Dividers
    divider: '#EFEFEF',
    overlay: 'rgba(0,0,0,0.4)',

    // Borders
    cardBorder: '#EFEFEF',
    cardBorderActive: '#DBDBDB',
    inputBorderFocus: 'rgba(0,184,118,0.5)',

    // Like
    likeRed: '#FF3040',

    // Story ring gradient colors
    storyGradientStart: '#00B876',
    storyGradientEnd: '#00A8FF',
  },

  gradients: {
    card: ['rgba(0,0,0,0.01)', 'rgba(0,0,0,0)'],
    fab: ['#00B876', '#009960'],
    primaryButton: ['#00B876', '#009960'],
    heroCard: ['rgba(0,184,118,0.04)', 'rgba(0,168,255,0.02)', 'transparent'],
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
      shadowOpacity: 0.06,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    accent: {
      shadowColor: '#00B876',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 4,
    },
    glow: {
      shadowColor: '#00B876',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
  },
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
