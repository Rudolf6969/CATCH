import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { WeatherSnapshot } from '../../types/catch.types';

interface Props {
  weather: WeatherSnapshot;
  capturedAt?: Date;
}

export function WeatherDetail({ weather, capturedAt }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Počasie pri úlovku</Text>
      {capturedAt && (
        <Text style={styles.time}>
          {capturedAt.toLocaleTimeString('sk-SK', { hour: '2-digit', minute: '2-digit' })}
          {' · '}
          {capturedAt.toLocaleDateString('sk-SK', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
      )}

      <View style={styles.grid}>
        <WeatherItem label="Teplota" value={`${weather.temperature.toFixed(1)}°C`} emoji="🌡️" />
        <WeatherItem label="Tlak" value={`${Math.round(weather.pressure)} hPa`} emoji="📊" />
        <WeatherItem label="Vietor" value={`${Math.round(weather.windSpeed)} km/h`} emoji="💨" />
        <WeatherItem label="Zrážky" value={`${weather.precipitation.toFixed(1)} mm`} emoji="🌧️" />
        <WeatherItem label="Mesiac" value={weather.moonPhase} emoji="🌙" />
        <WeatherItem label="Osvetlenie" value={`${weather.moonIllumination}%`} emoji="✨" />
      </View>
    </View>
  );
}

function WeatherItem({ label, value, emoji }: { label: string; value: string; emoji: string }) {
  return (
    <View style={styles.item}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.itemValue}>{value}</Text>
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  title: { fontFamily: 'DMSans-Medium', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  time: { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  item: { width: '30%', alignItems: 'center', gap: 2 },
  emoji: { fontSize: 22 },
  itemValue: { fontFamily: 'JetBrainsMono-Regular', fontSize: 13, color: '#FFFFFF' },
  itemLabel: { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(255,255,255,0.5)' },
});
