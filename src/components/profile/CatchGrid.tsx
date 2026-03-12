import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import type { CatchDocument } from '../../types/catch.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const COLUMNS = 3;
const GAP = 2;
const CELL_SIZE = (SCREEN_WIDTH - GAP * (COLUMNS - 1)) / COLUMNS;

interface Props {
  catches: CatchDocument[];
}

export function CatchGrid({ catches }: Props) {
  return (
    <View style={styles.grid}>
      {catches.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.cell}
          onPress={() => router.push(`/catch/${item.id}` as any)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: item.photos[0]?.downloadURL }}
            placeholder={{ blurhash: item.photos[0]?.blurhash || 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
            style={styles.cellImage}
            contentFit="cover"
            transition={200}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP },
  cell: { width: CELL_SIZE, height: CELL_SIZE },
  cellImage: { width: '100%', height: '100%' },
});
