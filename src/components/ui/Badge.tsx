import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';

type BadgeVariant = 'primary' | 'accent' | 'success' | 'error' | 'neutral' | 'live';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'neutral', size = 'md' }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], size === 'sm' && styles.small]}>
      {variant === 'live' && <View style={styles.liveDot} />}
      <Text style={[styles.label, styles[`label_${variant}` as keyof typeof styles], size === 'sm' && styles.labelSmall]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: theme.spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  small: { paddingHorizontal: 8, paddingVertical: 2 },
  primary: { backgroundColor: 'rgba(0,212,126,0.15)' },
  accent: { backgroundColor: 'rgba(255,215,0,0.15)' },
  success: { backgroundColor: 'rgba(0,212,126,0.15)' },
  error: { backgroundColor: theme.colors.errorSurface },
  neutral: { backgroundColor: theme.colors.surfaceHigh },
  live: {
    backgroundColor: 'rgba(0,212,126,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(0,212,126,0.25)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
  },
  label: { ...(theme.typography.caption as object), fontWeight: '500' as const },
  label_primary: { color: theme.colors.primary },
  label_accent: { color: theme.colors.accent },
  label_success: { color: theme.colors.success },
  label_error: { color: theme.colors.error },
  label_neutral: { color: theme.colors.textMuted },
  label_live: { color: theme.colors.primary },
  labelSmall: { fontSize: 10 },
});
