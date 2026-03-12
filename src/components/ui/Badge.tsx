import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';

type BadgeVariant = 'primary' | 'accent' | 'success' | 'error' | 'neutral';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
}

export function Badge({ label, variant = 'neutral', size = 'md' }: BadgeProps) {
  return (
    <View style={[styles.base, styles[variant], size === 'sm' && styles.small]}>
      <Text style={[styles.label, styles[`label_${variant}` as keyof typeof styles], size === 'sm' && styles.labelSmall]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    alignSelf: 'flex-start',
  },
  small: { paddingHorizontal: 6, paddingVertical: 2 },
  primary: { backgroundColor: `${theme.colors.primaryMid}20` },
  accent: { backgroundColor: `${theme.colors.accent}20` },
  success: { backgroundColor: 'rgba(34,197,94,0.15)' },
  error: { backgroundColor: theme.colors.errorSurface },
  neutral: { backgroundColor: theme.colors.surfaceHigh },
  label: { ...(theme.typography.caption as object) },
  label_primary: { color: theme.colors.primaryMid },
  label_accent: { color: theme.colors.accent },
  label_success: { color: theme.colors.success },
  label_error: { color: theme.colors.error },
  label_neutral: { color: theme.colors.textMuted },
  labelSmall: { fontSize: 10 },
});
