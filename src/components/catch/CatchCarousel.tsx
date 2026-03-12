import React, { useState } from 'react';
import { View, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import type { PhotoMeta } from '../../types/catch.types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = 300;

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
        transition={300}
        style={styles.singleImage}
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
            transition={300}
            style={styles.carouselImage}
          />
        ))}
      </ScrollView>

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
  singleImage: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT },
  carouselImage: { width: SCREEN_WIDTH, height: IMAGE_HEIGHT },
  dots: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotActive: { backgroundColor: '#E9A84C' },
});
