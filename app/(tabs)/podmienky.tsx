import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CONDITIONS = {
  temp: '14°C',
  pressure: '1018hPa',
  wind: '12km/h',
  moon: '78%',
  aiScore: 7,
  aiTip: 'Rastúci tlak, kapor aktívny ráno. Voľte boilies 18mm.',
};

const WEATHER_CARDS: WeatherCardProps[] = [
  { icon: 'thermometer-outline', value: '14°C', label: 'Teplota', color: '#EF6B4A' },
  { icon: 'speedometer-outline', value: '1018hPa', label: 'Tlak', color: '#4A9FEF' },
  { icon: 'navigate-outline', value: '12km/h', label: 'Vietor', color: '#4AEFC0' },
  { icon: 'moon-outline', value: '78%', label: 'Mesiac', color: '#9B6AEF' },
];

const FORECAST = [
  { day: 'Po', icon: 'partly-sunny-outline' as const, temp: '15°', good: true },
  { day: 'Ut', icon: 'sunny-outline' as const, temp: '16°', good: true },
  { day: 'St', icon: 'rainy-outline' as const, temp: '12°', good: false },
  { day: 'Št', icon: 'cloud-outline' as const, temp: '13°', good: false },
  { day: 'Pi', icon: 'partly-sunny-outline' as const, temp: '14°', good: true },
  { day: 'So', icon: 'sunny-outline' as const, temp: '17°', good: true },
  { day: 'Ne', icon: 'cloud-outline' as const, temp: '15°', good: true },
];

const LOCATIONS = [
  { name: 'Jazero Senec', distance: '15 km', seed: 'lake1' },
  { name: 'VN Gabčíkovo', distance: '42 km', seed: 'lake2' },
];

export default function PodmienkyScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Podmienky</Text>
        <Text style={styles.subtitle}>Dnes, 12. marca</Text>
      </View>

      {/* Hero card with background image */}
      <View style={styles.heroCard}>
        <Image
          source={{ uri: 'https://picsum.photos/seed/lake-morning/600/300' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>Ideálne podmienky na rybolov</Text>
          <View style={styles.heroScoreRow}>
            <Text style={styles.heroScore}>7/10</Text>
            <View style={styles.heroBarBg}>
              <View style={styles.heroBarFill} />
            </View>
          </View>
          <Text style={styles.heroTip}>{CONDITIONS.aiTip}</Text>
        </View>
      </View>

      {/* Weather section */}
      <Text style={styles.sectionTitle}>Aktuálne počasie</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weatherRow}
      >
        {WEATHER_CARDS.map((card) => (
          <WeatherCard key={card.label} {...card} />
        ))}
      </ScrollView>

      {/* 7-day forecast */}
      <Text style={styles.sectionTitle}>7-dňový výhľad</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.forecastRow}
      >
        {FORECAST.map((day) => (
          <View key={day.day} style={styles.forecastCard}>
            <Text style={styles.forecastDay}>{day.day}</Text>
            <Ionicons name={day.icon} size={20} color={theme.colors.primary} />
            <Text style={styles.forecastTemp}>{day.temp}</Text>
            <View style={[
              styles.forecastDot,
              { backgroundColor: day.good ? theme.colors.success : theme.colors.warning },
            ]} />
          </View>
        ))}
      </ScrollView>

      {/* Recommended locations */}
      <Text style={styles.sectionTitle}>Odporúčané lokality</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.locationsRow}
      >
        {LOCATIONS.map((loc) => (
          <View key={loc.seed} style={styles.locationCard}>
            <Image
              source={{ uri: `https://picsum.photos/seed/${loc.seed}/300/200` }}
              style={styles.locationImage}
              resizeMode="cover"
            />
            <View style={styles.locationOverlay} />
            <View style={styles.locationContent}>
              <Text style={styles.locationName}>{loc.name}</Text>
              <Text style={styles.locationDistance}>{loc.distance}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

interface WeatherCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  color: string;
}

function WeatherCard({ icon, value, label, color }: WeatherCardProps) {
  return (
    <View style={styles.weatherCard}>
      <Ionicons name={icon} size={24} color={color} />
      <Text style={styles.weatherValue}>{value}</Text>
      <Text style={styles.weatherLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  content: {
    paddingBottom: 100,
  },

  // Header
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    ...(theme.typography.headingLg as object),
    color: theme.colors.textPrimary,
  },
  subtitle: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 14,
    color: theme.colors.textMuted,
    marginTop: 2,
  },

  // Hero
  heroCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
    marginBottom: 24,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  heroTitle: {
    fontFamily: 'Outfit-Bold',
    fontSize: 18,
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  heroScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  heroScore: {
    fontFamily: 'JetBrainsMono-Regular',
    fontSize: 28,
    color: theme.colors.accent,
  },
  heroBarBg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.divider,
  },
  heroBarFill: {
    width: '70%',
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.accent,
  },
  heroTip: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: theme.colors.textPrimary,
    lineHeight: 16,
  },

  // Section titles
  sectionTitle: {
    ...(theme.typography.headingSm as object),
    color: theme.colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },

  // Weather
  weatherRow: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  weatherCard: {
    width: 90,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  weatherValue: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 18,
    color: theme.colors.textPrimary,
  },
  weatherLabel: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    color: theme.colors.textMuted,
  },

  // Forecast
  forecastRow: {
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 24,
  },
  forecastCard: {
    width: 70,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    gap: 6,
  },
  forecastDay: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    color: theme.colors.textMuted,
  },
  forecastTemp: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  forecastDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  // Locations
  locationsRow: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  locationCard: {
    width: 160,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  locationImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  locationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  locationContent: {
    position: 'absolute',
    bottom: 10,
    left: 12,
  },
  locationName: {
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  locationDistance: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
