export const theme = {
  colors: {
    // Backgrounds
    bg: '#0A1628',
    surface: '#112240',
    surfaceHigh: '#1A2F52',

    // Brand greens
    primary: '#1B4332',
    primaryMid: '#40916C',

    // Accent
    accent: '#F4A261',
    accentBlue: '#1E6091',

    // Text
    textPrimary: '#F8F9FA',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',

    // Semantic
    error: '#EF4444',
    errorSurface: 'rgba(239,68,68,0.1)',
    success: '#22C55E',
    warning: '#F59E0B',

    // Tab bar
    tabActive: '#40916C',
    tabInactive: '#6B7280',
    tabBar: '#0A1628',
    tabBorder: '#1A2F52',

    // Dividers
    divider: '#1A2F52',
    overlay: 'rgba(0,0,0,0.6)',
  },

  typography: {
    // Headings — Outfit
    heading: { fontFamily: 'Outfit-Bold', fontSize: 24, lineHeight: 30 },
    headingLg: { fontFamily: 'Outfit-Bold', fontSize: 28, lineHeight: 36 },
    headingSemi: { fontFamily: 'Outfit-SemiBold', fontSize: 20, lineHeight: 26 },
    headingSm: { fontFamily: 'Outfit-SemiBold', fontSize: 16, lineHeight: 22 },

    // Body — Inter
    body: { fontFamily: 'Inter-Regular', fontSize: 15, lineHeight: 22 },
    bodyMedium: { fontFamily: 'Inter-Medium', fontSize: 15, lineHeight: 22 },
    bodySm: { fontFamily: 'Inter-Regular', fontSize: 13, lineHeight: 18 },
    bodySmMedium: { fontFamily: 'Inter-Medium', fontSize: 13, lineHeight: 18 },
    caption: { fontFamily: 'Inter-Regular', fontSize: 11, lineHeight: 16 },

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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
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
      shadowColor: '#F4A261',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme;
export type ThemeColors = typeof theme.colors;
