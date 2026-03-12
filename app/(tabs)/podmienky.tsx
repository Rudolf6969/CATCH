import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const CONDITIONS = {
  temp: '14°C',
  tempFeel: '11°C',
  pressure: '1018 hPa',
  pressureTrend: 'rastie',
  wind: '12 km/h',
  windDir: 'JV',
  moonPhase: 'Ubud. polmesiac',
  humidity: '78%',
  aiScore: 7,
  aiTip: 'Rastúci tlak a teplota 14°C — kapor aktívny ráno. Skús boilies 18mm pri pobrežnej hrane, hĺbka 2-3m.',
};

const FORECAST = [
  { day: 'Ut', temp: '15°C', icon: 'partly-sunny-outline' as const, score: 7 },
  { day: 'St', temp: '13°C', icon: 'rainy-outline' as const, score: 4 },
  { day: 'Št', temp: '12°C', icon: 'rainy-outline' as const, score: 3 },
  { day: 'Pi', temp: '14°C', icon: 'cloud-outline' as const, score: 6 },
  { day: 'So', temp: '16°C', icon: 'sunny-outline' as const, score: 8 },
  { day: 'Ne', temp: '17°C', icon: 'partly-sunny-outline' as const, score: 9 },
  { day: 'Po', temp: '15°C', icon: 'cloud-outline' as const, score: 6 },
];

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
        <Text style={styles.date}>Dnes, 12. marca 2026</Text>
      </View>

      {/* Hero AI Score Card */}
      <Card glowing style={styles.heroCard}>
        <View style={styles.heroTop}>
          <View style={styles.heroScoreWrap}>
            <Text style={styles.heroScoreLabel}>Rybolov dnes</Text>
            <View style={styles.heroScoreRow}>
              <Text style={styles.heroScore}>{CONDITIONS.aiScore}</Text>
              <Text style={styles.heroScoreMax}>/10</Text>
            </View>
          </View>
          <View style={styles.heroScoreBadgeWrap}>
            <Badge label="AI tip" variant="live" />
            <ScoreBar score={CONDITIONS.aiScore} />
          </View>
        </View>
        <View style={styles.heroDivider} />
        <Text style={styles.heroTip}>{CONDITIONS.aiTip}</Text>
      </Card>

      {/* Weather Grid 2x2 */}
      <View style={styles.weatherGrid}>
        <WeatherTile icon="thermometer-outline" label="Teplota" value={CONDITIONS.temp} sub={`Pocit. ${CONDITIONS.tempFeel}`} color={theme.colors.accent} />
        <WeatherTile icon="speedometer-outline" label="Tlak" value={CONDITIONS.pressure} sub={CONDITIONS.pressureTrend} color={theme.colors.primaryMid} />
        <WeatherTile icon="navigate-outline" label="Vietor" value={CONDITIONS.wind} sub={CONDITIONS.windDir} color={theme.colors.accentWarm} />
        <WeatherTile icon="moon-outline" label="Mesiac" value={CONDITIONS.moonPhase} sub={`Vlhkosť ${CONDITIONS.humidity}`} color={theme.colors.textSecondary} />
      </View>

      {/* 7-day Forecast */}
      <View style={styles.forecastSection}>
        <View style={styles.forecastHeader}>
          <Text style={styles.sectionTitle}>7-dňový výhľad</Text>
          <Badge label="Premium" variant="accent" size="sm" />
        </View>
        <Card style={styles.forecastCard}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.forecastScroll}>
            {FORECAST.map((day) => (
              <View key={day.day} style={styles.forecastDay}>
                <Text style={styles.forecastDayLabel}>{day.day}</Text>
                <Ionicons name={day.icon} size={20} color={theme.colors.primaryMid} />
                <Text style={styles.forecastTemp}>{day.temp}</Text>
                <View style={[styles.forecastScoreDot, { backgroundColor: scoreColor(day.score) }]} />
                <Text style={[styles.forecastScore, { color: scoreColor(day.score) }]}>{day.score}</Text>
              </View>
            ))}
          </ScrollView>
        </Card>
      </View>
    </ScrollView>
  );
}

function ScoreBar({ score }: { score: number }) {
  return (
    <View style={styles.scoreBarBg}>
      <View style={[styles.scoreBarFill, { width: `${score * 10}%`, backgroundColor: scoreColor(score) }]} />
    </View>
  );
}

function scoreColor(score: number): string {
  if (score >= 7) return theme.colors.primaryMid;
  if (score >= 5) return theme.colors.accent;
  return theme.colors.error;
}

interface WeatherTileProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  sub: string;
  color: string;
}

function WeatherTile({ icon, label, value, sub, color }: WeatherTileProps) {
  return (
    <Card style={styles.weatherTile}>
      <View style={[styles.weatherIconWrap, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <Text style={styles.weatherValue}>{value}</Text>
      <Text style={styles.weatherLabel}>{label}</Text>
      <Text style={styles.weatherSub}>{sub}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.lg, gap: theme.spacing.lg },
  header: { gap: 2 },
  title: { ...(theme.typography.headingLg as object), color: theme.colors.textPrimary },
  date: { ...(theme.typography.body as object), color: theme.colors.textMuted },

  // Hero card
  heroCard: { gap: theme.spacing.sm, padding: theme.spacing.lg },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  heroScoreWrap: { gap: 2 },
  heroScoreLabel: { ...(theme.typography.bodySm as object), color: theme.colors.textMuted },
  heroScoreRow: { flexDirection: 'row', alignItems: 'baseline' },
  heroScore: { ...(theme.typography.monoLg as object), color: theme.colors.primaryMid, fontSize: 36, lineHeight: 40 },
  heroScoreMax: { ...(theme.typography.mono as object), color: theme.colors.textMuted, fontSize: 18 },
  heroScoreBadgeWrap: { alignItems: 'flex-end', gap: theme.spacing.sm },
  heroDivider: { height: 1, backgroundColor: theme.colors.cardBorder, marginVertical: theme.spacing.xs },
  heroTip: { ...(theme.typography.body as object), color: theme.colors.textSecondary, lineHeight: 22 },

  // Score bar
  scoreBarBg: { width: 80, height: 4, borderRadius: 2, backgroundColor: theme.colors.surfaceHigh },
  scoreBarFill: { height: 4, borderRadius: 2 },

  // Weather grid
  weatherGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  weatherTile: {
    flex: 1,
    minWidth: '45%',
    gap: theme.spacing.xs,
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  weatherIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  weatherValue: { ...(theme.typography.headingSm as object), color: theme.colors.textPrimary, textAlign: 'center' },
  weatherLabel: { ...(theme.typography.caption as object), color: theme.colors.textMuted, textAlign: 'center' },
  weatherSub: { ...(theme.typography.caption as object), color: theme.colors.textMuted, fontSize: 10, textAlign: 'center' },

  // Forecast
  forecastSection: { gap: theme.spacing.sm },
  forecastHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { ...(theme.typography.headingSm as object), color: theme.colors.textSecondary },
  forecastCard: { padding: theme.spacing.sm },
  forecastScroll: { gap: theme.spacing.md, paddingHorizontal: theme.spacing.xs },
  forecastDay: { alignItems: 'center', gap: 6, minWidth: 44 },
  forecastDayLabel: { ...(theme.typography.bodySmMedium as object), color: theme.colors.textMuted },
  forecastTemp: { ...(theme.typography.monoSm as object), color: theme.colors.textPrimary },
  forecastScoreDot: { width: 6, height: 6, borderRadius: 3 },
  forecastScore: { ...(theme.typography.monoSm as object), fontSize: 10 },
});
