import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  species: string;
  weightG: number;
  lengthCm: number;
}

export function FishBadge({ species, weightG, lengthCm }: Props) {
  const weightKg = (weightG / 1000).toFixed(1);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        🐟 {species} · {weightKg}kg · {lengthCm}cm
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  text: {
    fontFamily: 'DMSans-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
  },
});
