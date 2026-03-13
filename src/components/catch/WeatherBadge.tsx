import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { WeatherSnapshot } from '../../types/catch.types';
import { theme } from '../../theme/theme';

interface Props {
  weather: WeatherSnapshot;
  loading?: boolean;
}

export function WeatherBadge({ weather, loading }: Props) {
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Načítavam počasie...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Text style={styles.label}>Teplota</Text>
        <Text style={styles.value}>{weather.temperature.toFixed(1)}°C</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>Tlak</Text>
        <Text style={styles.value}>{Math.round(weather.pressure)} hPa</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>Vietor</Text>
        <Text style={styles.value}>{Math.round(weather.windSpeed)} km/h</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Text style={styles.label}>Mesiac</Text>
        <Text style={styles.value}>{weather.moonPhase}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'theme.colors.surfaceHigh',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  item: { alignItems: 'center', flex: 1 },
  label: { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'theme.colors.textMuted', marginBottom: 2 },
  value: { fontFamily: 'JetBrainsMono-Regular', fontSize: 13, color: theme.colors.textPrimary },
  divider: { width: 1, height: 32, backgroundColor: 'theme.colors.divider' },
  loadingText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'theme.colors.textMuted' },
});
