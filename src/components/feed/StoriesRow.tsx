import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

// Phase 2: mock data — Phase 5 (Community) nahradí reálnymi sledovanými používateľmi
const MOCK_STORIES = [
  { id: '1', name: 'Martin', avatar: null, blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' },
  { id: '2', name: 'Peter', avatar: null, blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I' },
  { id: '3', name: 'Tomáš', avatar: null, blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' },
  { id: '4', name: 'Jano', avatar: null, blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I' },
  { id: '5', name: 'Radek', avatar: null, blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' },
];

export function StoriesRow() {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {MOCK_STORIES.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem} onPress={() => {}}>
            <View style={styles.avatarRing}>
              <Image
                source={story.avatar ? { uri: story.avatar } : undefined}
                placeholder={{ blurhash: story.blurhash }}
                style={styles.avatar}
                contentFit="cover"
              />
            </View>
            <Text style={styles.name} numberOfLines={1}>{story.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  scroll: { paddingHorizontal: 14, paddingVertical: 12, gap: 16 },
  storyItem: { alignItems: 'center', width: 60 },
  avatarRing: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: '#40916C',
    padding: 2,
    marginBottom: 4,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  name: { fontFamily: 'DMSans-Regular', fontSize: 11, color: 'rgba(255,255,255,0.6)', textAlign: 'center' },
});
