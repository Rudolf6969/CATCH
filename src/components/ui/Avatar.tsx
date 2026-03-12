import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function Avatar({ uri, name, size = 40 }: AvatarProps) {
  const dynamicStyle = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.base, dynamicStyle]} />;
  }

  return (
    <View style={[styles.base, styles.fallback, dynamicStyle]}>
      <Text style={[styles.initials, { fontSize: size * 0.35 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: { overflow: 'hidden' },
  fallback: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: { color: theme.colors.primaryMid, ...(theme.typography.bodyMedium as object) },
});
