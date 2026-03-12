import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const STATS = {
  totalCatches: 23,
  totalWeight: '142.5 kg',
  biggest: '14.5 kg',
  species: 8,
};

const CATCHES = [
  { id: '1', fish: 'Kapor', weight: '8.2 kg', length: '72 cm', location: 'VN Orava', date: '12. mar', score: 'Osobný rekord' },
  { id: '2', fish: 'Sumec', weight: '14.5 kg', length: '118 cm', location: 'Dunaj — Komárno', date: '10. mar', score: 'Top úlovok' },
  { id: '3', fish: 'Amur', weight: '11.8 kg', length: '89 cm', location: 'Štrkovisko Senec', date: '8. mar', score: null },
  { id: '4', fish: 'Šťuka', weight: '4.1 kg', length: '68 cm', location: 'Váh — Piešťany', date: '5. mar', score: null },
  { id: '5', fish: 'Kapor', weight: '6.9 kg', length: '64 cm', location: 'VN Orava', date: '2. mar', score: null },
];

export default function DennikScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.lg }]}
    >
      <Text style={styles.title}>Denník</Text>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatBox label="Úlovky" value={String(STATS.totalCatches)} icon="fish-outline" />
        <StatBox label="Hmotnosť" value={STATS.totalWeight} icon="scale-outline" />
        <StatBox label="Najväčší" value={STATS.biggest} icon="trophy-outline" />
        <StatBox label="Druhy" value={String(STATS.species)} icon="leaf-outline" />
      </View>

      {/* Catches list */}
      <View style={styles.catchesSection}>
        <Text style={styles.sectionTitle}>Posledné úlovky</Text>
        {CATCHES.map((c) => (
          <Card key={c.id} style={styles.catchCard}>
            <View style={styles.catchRow}>
              <View style={styles.catchIconWrap}>
                <Ionicons name="fish-outline" size={20} color={theme.colors.primaryMid} />
              </View>
              <View style={styles.catchInfo}>
                <View style={styles.catchTopRow}>
                  <Text style={styles.catchFish}>{c.fish}</Text>
                  {c.score && <Badge label={c.score} variant="accent" size="sm" />}
                </View>
                <View style={styles.catchDetailRow}>
                  <Text style={styles.catchStat}>{c.weight}</Text>
                  <Text style={styles.catchDivider}>·</Text>
                  <Text style={styles.catchStat}>{c.length}</Text>
                  <Text style={styles.catchDivider}>·</Text>
                  <Text style={styles.catchLocation}>{c.location}</Text>
                </View>
              </View>
              <Text style={styles.catchDate}>{c.date}</Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

function StatBox({ label, value, icon }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap }) {
  return (
    <Card style={styles.statBox}>
      <Ionicons name={icon} size={18} color={theme.colors.accent} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.lg, gap: theme.spacing.lg },
  title: { ...(theme.typography.headingLg as object), color: theme.colors.textPrimary },

  // Stats
  statsRow: { flexDirection: 'row', gap: theme.spacing.sm },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: theme.spacing.sm + 2,
  },
  statValue: { ...(theme.typography.mono as object), color: theme.colors.textPrimary, fontSize: 15 },
  statLabel: { ...(theme.typography.caption as object), color: theme.colors.textMuted, fontSize: 10 },

  // Catches
  catchesSection: { gap: theme.spacing.sm },
  sectionTitle: { ...(theme.typography.headingSm as object), color: theme.colors.textSecondary },
  catchCard: { padding: theme.spacing.sm + 4 },
  catchRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  catchIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(82,183,136,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  catchInfo: { flex: 1, gap: 4 },
  catchTopRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  catchFish: { ...(theme.typography.bodyMedium as object), color: theme.colors.textPrimary },
  catchDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  catchStat: { ...(theme.typography.monoSm as object), color: theme.colors.textSecondary },
  catchDivider: { color: theme.colors.textMuted, fontSize: 10 },
  catchLocation: { ...(theme.typography.caption as object), color: theme.colors.textMuted },
  catchDate: { ...(theme.typography.caption as object), color: theme.colors.textMuted },
});
