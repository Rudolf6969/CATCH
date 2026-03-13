import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/auth.store';
import { theme } from '../../theme/theme';

// Phase 5 nahradí reálnymi sledovanými používateľmi
const MOCK_STORIES = [
  { id: '1', name: 'Martin', avatar: null, blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', unseen: true },
  { id: '2', name: 'Peter', avatar: null, blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I', unseen: true },
  { id: '3', name: 'Tomáš', avatar: null, blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', unseen: false },
  { id: '4', name: 'Jano', avatar: null, blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I', unseen: true },
  { id: '5', name: 'Radek', avatar: null, blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', unseen: false },
];

export function StoriesRow() {
  const user = useAuthStore(s => s.user);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* My story — pridať */}
        <TouchableOpacity style={styles.storyItem} activeOpacity={0.8}>
          <View style={styles.myStoryWrap}>
            <Image
              source={user?.photoURL ? { uri: user.photoURL } : undefined}
              placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
              style={styles.myAvatar}
              contentFit="cover"
            />
            <View style={styles.addBadge}>
              <Ionicons name="add" size={12} color={theme.colors.bg} />
            </View>
          </View>
          <Text style={styles.name} numberOfLines={1}>Tvoj</Text>
        </TouchableOpacity>

        {/* Ostatné stories */}
        {MOCK_STORIES.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem} activeOpacity={0.8}>
            <View style={[styles.ringOuter, story.unseen ? styles.ringActive : styles.ringSeen]}>
              <View style={styles.ringInner}>
                <Image
                  source={story.avatar ? { uri: story.avatar } : undefined}
                  placeholder={{ blurhash: story.blurhash }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </View>
            </View>
            <Text style={styles.name} numberOfLines={1}>{story.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const AVATAR_SIZE = 56;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  scroll: { paddingHorizontal: 14, paddingVertical: 10, gap: 14 },
  storyItem: { alignItems: 'center', width: 64 },

  // My story
  myStoryWrap: {
    width: AVATAR_SIZE + 4,
    height: AVATAR_SIZE + 4,
    borderRadius: (AVATAR_SIZE + 4) / 2,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  myAvatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 },
  addBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.bg,
  },

  // Story rings
  ringOuter: {
    width: AVATAR_SIZE + 6,
    height: AVATAR_SIZE + 6,
    borderRadius: (AVATAR_SIZE + 6) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    borderWidth: 2,
  },
  ringActive: { borderColor: theme.colors.primaryMid },
  ringSeen: { borderColor: theme.colors.textMuted },
  ringInner: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.bg,
  },
  avatar: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2 },
  name: {
    fontFamily: 'DMSans-Regular',
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
