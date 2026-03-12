import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '@/theme/theme';

interface CardProps extends ViewProps {
  elevated?: boolean;
  glowing?: boolean;
  children: React.ReactNode;
}

export function Card({ elevated = false, glowing = false, style, children, ...props }: CardProps) {
  return (
    <View
      {...props}
      style={[
        styles.card,
        elevated && styles.elevated,
        glowing && styles.glowing,
        style,
      ]}
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
    borderColor: theme.colors.cardBorder,
  },
  elevated: {
    shadowColor: theme.shadow.md.shadowColor,
    shadowOffset: theme.shadow.md.shadowOffset,
    shadowOpacity: theme.shadow.md.shadowOpacity,
    shadowRadius: theme.shadow.md.shadowRadius,
    elevation: theme.shadow.md.elevation,
  },
  glowing: {
    borderColor: theme.colors.cardBorderActive,
    shadowColor: theme.colors.primaryMid,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 4,
  },
});
