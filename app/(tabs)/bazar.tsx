import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Badge } from '@/components/ui/Badge';

export default function BazarScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.lg }]}>
      <Text style={styles.title}>Bazár</Text>
      <View style={styles.emptyState}>
        <Ionicons name="storefront-outline" size={64} color={theme.colors.surfaceHigh} />
        <Text style={styles.emptyTitle}>Zatiaľ prázdny</Text>
        <Text style={styles.emptyText}>
          Tu nájdeš rybárske vybavenie od iných rybárov v tvojom okolí
        </Text>
        <Badge label="Čoskoro — Phase 6" variant="neutral" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.lg,
  },
  title: {
    ...(theme.typography.heading as object),
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
  },
  emptyTitle: {
    ...(theme.typography.headingSemi as object),
    color: theme.colors.textSecondary,
  },
  emptyText: {
    ...(theme.typography.body as object),
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
