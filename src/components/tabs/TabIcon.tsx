import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}

export function TabIcon({ name, label, focused }: TabIconProps) {
  const color = focused ? theme.colors.tabActive : theme.colors.tabInactive;
  return (
    <View style={styles.container}>
      <Ionicons name={name} size={24} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 2 },
  label: { fontSize: 10, ...(theme.typography.caption as object) },
});
