import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';

interface TabIconProps {
  name: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}

export function TabIcon({ name, focused }: TabIconProps) {
  const color = focused ? theme.colors.tabActive : theme.colors.tabInactive;
  return (
    <View style={styles.container}>
      <Ionicons name={name} size={26} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
});
