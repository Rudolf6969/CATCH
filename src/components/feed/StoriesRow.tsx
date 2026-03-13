import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../stores/auth.store';
import { theme } from '../../theme/theme';

const MOCK_STORIES = [
  { id: '1', name: 'Martin', avatar: null, blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', unseen: true },
  { id: '2', name: 'Peter', avatar: null, blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I', unseen: true },
  { id: '3', name: 'Tomáš', avatar: null, blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', unseen: false },
  { id: '4', name: 'Jano', avatar: null, blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I', unseen: true },
  { id: '5', name: 'Radek', avatar: null, blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.', unseen: false },
  { id: '6', name: 'Marek', avatar: null, blurhash: 'L5H2EC=PM+yV0g-mq.wG9c010J}I', unseen: true },
];

export function StoriesRow() {
  const user = useAuthStore(s => s.user);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Your story */}
        <TouchableOpacity style={styles.storyItem} activeOpacity={0.7}>
          <View style={styles.myStoryWrap}>
            <Image
              source={user?.photoURL ? { uri: user.photoURL } : undefined}
              placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
              style={styles.avatar}
              contentFit="cover"
            />
            <View style={styles.addBadge}>
              <Ionicons name="add" size={14} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.name} numberOfLines={1}>Tvoj</Text>
        </TouchableOpacity>

        {/* Other stories */}
        {MOCK_STORIES.map((story) => (
          <TouchableOpacity key={story.id} style={styles.storyItem} activeOpacity={0.7}>
            <View style={[styles.ring, story.unseen ? styles.ringUnseen : styles.ringSeen]}>
              <View style={styles.ringInner}>
                <Image
                  source={story.avatar ? { uri: story.avatar } : undefined}
                  placeholder={{ blurhash: story.blurhash }}
                  style={styles.avatar}
                  contentFit="cover"
                />
              </View>
            </View>
            <Text style={[styles.name, story.unseen && styles.nameUnseen]} numberOfLines={1}>
              {story.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const SIZE = 68;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.divider,
  },
  scroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 12,
  },
  storyItem: { alignItems: 'center', width: 72 },

  // My story
  myStoryWrap: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    position: 'relative',
  },
  addBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.bg,
  },

  // Story ring
  ring: {
    width: SIZE + 4,
    height: SIZE + 4,
    borderRadius: (SIZE + 4) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 2,
  },
  ringUnseen: {
    borderColor: theme.colors.primary,
  },
  ringSeen: {
    borderColor: '#363636',
  },
  ringInner: {
    width: SIZE - 2,
    height: SIZE - 2,
    borderRadius: (SIZE - 2) / 2,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: theme.colors.bg,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: SIZE / 2,
  },
  name: {
    fontFamily: 'PlusJakartaSans-Medium',
    fontSize: 11,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  nameUnseen: {
    color: theme.colors.textPrimary,
  },
});
