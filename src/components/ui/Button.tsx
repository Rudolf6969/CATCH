import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet, PressableProps } from 'react-native';
import { theme } from '@/theme/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[`size_${size}` as keyof typeof styles],
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? theme.colors.bg : theme.colors.textPrimary}
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}` as keyof typeof styles], styles[`labelSize_${size}` as keyof typeof styles]]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.md,
  },
  // Varianty — primary: gradient-like solid, ghost: border glow
  primary: {
    backgroundColor: theme.colors.primaryMid,
    shadowColor: theme.colors.primaryMid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  secondary: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.cardBorderActive,
    shadowColor: theme.colors.primaryMid,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  danger: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  // Velkosti
  size_sm: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md, minHeight: 36 },
  size_md: { paddingVertical: theme.spacing.sm + 4, paddingHorizontal: theme.spacing.lg, minHeight: 48 },
  size_lg: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.xl, minHeight: 56 },
  // Stavy
  fullWidth: { width: '100%' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.4 },
  // Labely
  label: { ...(theme.typography.bodyMedium as object) },
  label_primary: { color: theme.colors.bg, fontWeight: '600' as const },
  label_secondary: { color: theme.colors.textPrimary },
  label_ghost: { color: theme.colors.primaryMid },
  label_danger: { color: theme.colors.error },
  labelSize_sm: { fontSize: 13 },
  labelSize_md: { fontSize: 15 },
  labelSize_lg: { fontSize: 16 },
});
