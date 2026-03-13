import React, { useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { PhotoMeta } from '../../types/catch.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  photos: PhotoMeta[];
}

export function CatchCarousel({ photos }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 1) {
    return (
      <Image
        source={{ uri: photos[0].downloadURL }}
        placeholder={{ blurhash: photos[0].blurhash }}
        contentFit="cover"
        transition={200}
        style={styles.image}
      />
    );
  }

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
          setActiveIndex(index);
        }}
        scrollEventThrottle={32}
      >
        {photos.map((photo, idx) => (
          <Image
            key={idx}
            source={{ uri: photo.downloadURL }}
            placeholder={{ blurhash: photo.blurhash }}
            contentFit="cover"
            transition={200}
            style={styles.image}
          />
        ))}
      </ScrollView>

      {/* IG-style counter top right */}
      <View style={styles.counter}>
        <View style={styles.counterPill}>
          <View style={styles.counterText}>
            {/* Text workaround */}
          </View>
        </View>
      </View>

      {/* Dots */}
      <View style={styles.dots}>
        {photos.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, idx === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { width: SCREEN_WIDTH, aspectRatio: 1 },
  counter: {
    position: 'absolute',
    top: 14,
    right: 14,
  },
  counterPill: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  counterText: {},
  dots: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    backgroundColor: '#FAFAFA',
  },
});
