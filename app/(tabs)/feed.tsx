import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/theme/theme';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

export default function FeedScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <Badge label="Čoskoro" variant="neutral" size="sm" />
      </View>

      {/* Dummy post skeletony */}
      {[1, 2, 3].map((i) => (
        <Card key={i} style={styles.postCard}>
          <View style={styles.postHeader}>
            <Avatar size={36} name="Ján Rybár" />
            <View style={styles.postMeta}>
              <Skeleton width={120} height={12} />
              <Skeleton width={80} height={10} style={{ marginTop: 4 }} />
            </View>
          </View>
          <Skeleton height={200} borderRadius={theme.radius.md} style={{ marginTop: theme.spacing.sm }} />
          <Skeleton width="60%" height={14} style={{ marginTop: theme.spacing.sm }} />
        </Card>
      ))}

      <Text style={styles.comingSoon}>
        Tu sa budú zobrazovať úlovky komunity.{'\n'}Pridaj prvý!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.md, gap: theme.spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  title: { ...(theme.typography.heading as object), color: theme.colors.textPrimary },
  postCard: { gap: theme.spacing.sm },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  postMeta: { flex: 1, gap: 4 },
  comingSoon: {
    ...(theme.typography.body as object),
    color: theme.colors.textMuted,
    textAlign: 'center',
    padding: theme.spacing.xl,
    lineHeight: 24,
  },
});
