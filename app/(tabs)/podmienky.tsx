import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';

// Dummy dáta pre wireframe — nahradené reálnymi v Phase 3
const DUMMY_CONDITIONS = {
  temp: '14°C',
  pressure: '1018 hPa',
  wind: '12 km/h',
  moonPhase: 'Ubúdajúci polmesiac',
  aiScore: 7,
  aiTip: 'Rastúci tlak, teplota 14°C — kapor aktívny ráno. Voľte boilies 18mm.',
};

export default function PodmienkyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Podmienky</Text>
        <Text style={styles.date}>Dnes, 12. marca</Text>
      </View>

      {/* AI Score card */}
      <Card style={styles.aiCard}>
        <View style={styles.aiScoreRow}>
          <View>
            <Text style={styles.aiScoreLabel}>Skóre rybolovu</Text>
            <Text style={styles.aiScore}>{DUMMY_CONDITIONS.aiScore}/10</Text>
          </View>
          <Badge label="AI tip" variant="primary" />
        </View>
        <Text style={styles.aiTip}>{DUMMY_CONDITIONS.aiTip}</Text>
        <Badge label="Čoskoro — živé dáta" variant="neutral" size="sm" />
      </Card>

      {/* Weather grid */}
      <View style={styles.weatherGrid}>
        <WeatherTile icon="thermometer-outline" label="Teplota" value={DUMMY_CONDITIONS.temp} />
        <WeatherTile icon="speedometer-outline" label="Tlak" value={DUMMY_CONDITIONS.pressure} />
        <WeatherTile icon="navigate-outline" label="Vietor" value={DUMMY_CONDITIONS.wind} />
        <WeatherTile icon="moon-outline" label="Mesiac" value={DUMMY_CONDITIONS.moonPhase} small />
      </View>

      {/* Skeleton pre budúce sekcie */}
      <View style={styles.skeletonSection}>
        <Text style={styles.skeletonLabel}>7-dňový výhľad</Text>
        <Skeleton height={80} borderRadius={theme.radius.md} style={{ marginBottom: theme.spacing.sm }} />
        <Badge label="Premium funkcia" variant="accent" size="sm" />
      </View>
    </ScrollView>
  );
}

interface WeatherTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  small?: boolean;
}

function WeatherTile({ icon, label, value, small }: WeatherTileProps) {
  return (
    <Card style={styles.weatherTile}>
      <Ionicons name={icon} size={22} color={theme.colors.primaryMid} />
      <Text style={styles.weatherValue} numberOfLines={small ? 2 : 1}>{value}</Text>
      <Text style={styles.weatherLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.lg, gap: theme.spacing.lg },
  header: { gap: 2 },
  title: { ...(theme.typography.headingLg as object), color: theme.colors.textPrimary },
  date: { ...(theme.typography.body as object), color: theme.colors.textMuted },
  aiCard: { gap: theme.spacing.sm, borderColor: `${theme.colors.primaryMid}30` },
  aiScoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  aiScoreLabel: { ...(theme.typography.bodySm as object), color: theme.colors.textMuted },
  aiScore: { ...(theme.typography.monoLg as object), color: theme.colors.primaryMid },
  aiTip: { ...(theme.typography.body as object), color: theme.colors.textSecondary, lineHeight: 22 },
  weatherGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  weatherTile: { flex: 1, minWidth: '45%', gap: theme.spacing.xs, alignItems: 'center', padding: theme.spacing.md },
  weatherValue: { ...(theme.typography.headingSm as object), color: theme.colors.textPrimary, textAlign: 'center' },
  weatherLabel: { ...(theme.typography.caption as object), color: theme.colors.textMuted, textAlign: 'center' },
  skeletonSection: { gap: theme.spacing.sm },
  skeletonLabel: { ...(theme.typography.headingSm as object), color: theme.colors.textSecondary },
});
