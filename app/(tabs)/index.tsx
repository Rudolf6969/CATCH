import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';

// Placeholder pre Podmienky tab — reálny obsah príde v Phase 3
export default function PodmienkyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{'\u2614'} Podmienky</Text>
      <Text style={styles.subtitle}>Live počasie a AI tip na rybolov</Text>
      <Text style={styles.badge}>{'\u23F0'} Čoskoro</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.lg,
  },
  title: { ...(theme.typography.headingSemi as object), color: theme.colors.textPrimary },
  subtitle: { ...(theme.typography.body as object), color: theme.colors.textMuted, textAlign: 'center' },
  badge: { ...(theme.typography.caption as object), color: theme.colors.textSecondary },
});
