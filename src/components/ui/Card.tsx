import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../../theme/theme';

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
    borderRadius: 14,
    padding: theme.spacing.md,
    borderWidth: 0,
    ...theme.shadow.sm,
  },
  elevated: {
    ...theme.shadow.md,
  },
  glowing: {
    ...theme.shadow.glow,
  },
});
