import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '@/theme/theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  children: React.ReactNode;
}

export function Card({ elevated = false, style, children, ...props }: CardProps) {
  return (
    <View
      {...props}
      style={[styles.card, elevated && styles.elevated, style]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.surfaceHigh,
  },
  elevated: {
    shadowColor: theme.shadow.md.shadowColor,
    shadowOffset: theme.shadow.md.shadowOffset,
    shadowOpacity: theme.shadow.md.shadowOpacity,
    shadowRadius: theme.shadow.md.shadowRadius,
    elevation: theme.shadow.md.elevation,
  },
});
