import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const STORIES = [
  { name: 'Marek', seed: 'marek' },
  { name: 'Juraj', seed: 'juraj' },
  { name: 'Tomáš', seed: 'tomas' },
  { name: 'Peter', seed: 'peter' },
  { name: 'Lukáš', seed: 'lukas' },
  { name: 'Ivan', seed: 'ivan' },
];

const POSTS = [
  {
    id: '1',
    name: 'Marek Kováč',
    avatar: 'marek',
    location: 'Jazero Senec',
    time: 'pred 2h',
    fish: 'Kapor',
    weight: '8.2kg',
    caption: 'Krásny ranný úlovok pri východe slnka 🌅',
    tags: '#kapor #rybolov #slovensko',
    photo: 'fish1',
    likes: 124,
    comments: 18,
  },
  {
    id: '2',
    name: 'Juraj Novák',
    avatar: 'juraj',
    location: 'Rieka Dunaj',
    time: 'pred 5h',
    fish: 'Šťuka',
    weight: '4.1kg',
    caption: 'Dunajská šťuka — bojovala ako o život 💪',
    tags: '#stuka #dunaj #catchandrelease',
    photo: 'fish2',
    likes: 89,
    comments: 12,
  },
  {
    id: '3',
    name: 'Peter Horváth',
    avatar: 'peter',
    location: 'VN Gabčíkovo',
    time: 'pred 8h',
    fish: 'Amur',
    weight: '12.5kg',
    caption: 'Môj nový osobný rekord! 🏆',
    tags: '#amur #gabcikovo #rekord',
    photo: 'fish3',
    likes: 213,
    comments: 34,
  },
];

export default function FeedScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.logo}>CATCH</Text>
        <View style={styles.headerRight}>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="search-outline" size={22} color={theme.colors.textPrimary} />
          </Pressable>
          <Pressable style={styles.headerIcon}>
            <Ionicons name="notifications-outline" size={22} color={theme.colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      {/* Stories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
        style={styles.storiesRow}
      >
        {STORIES.map((story) => (
          <Pressable key={story.seed} style={styles.storyItem}>
            <View style={styles.storyRing}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${story.seed}/100/100` }}
                style={styles.storyAvatar}
              />
            </View>
            <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Posts */}
      {POSTS.map((post) => (
        <View key={post.id} style={styles.postCard}>
          {/* Post header */}
          <View style={styles.postHeader}>
            <View style={styles.postHeaderLeft}>
              <Image
                source={{ uri: `https://picsum.photos/seed/${post.avatar}/100/100` }}
                style={styles.postAvatar}
              />
              <View>
                <Text style={styles.postName}>{post.name}</Text>
                <Text style={styles.postLocation}>{post.location}</Text>
              </View>
            </View>
            <View style={styles.postHeaderRight}>
              <Text style={styles.postTime}>{post.time}</Text>
              <Pressable>
                <Ionicons name="ellipsis-horizontal" size={18} color={theme.colors.textMuted} />
              </Pressable>
            </View>
          </View>

          {/* Photo — full width, no horizontal padding */}
          <Image
            source={{ uri: `https://picsum.photos/seed/${post.photo}/800/560` }}
            style={styles.postPhoto}
            resizeMode="cover"
          />

          {/* Action bar */}
          <View style={styles.actionBar}>
            <View style={styles.actionLeft}>
              <Pressable style={styles.actionBtn}>
                <Ionicons name="heart-outline" size={24} color={theme.colors.textPrimary} />
              </Pressable>
              <Text style={styles.actionCount}>{post.likes}</Text>
              <View style={{ width: 16 }} />
              <Pressable style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={22} color={theme.colors.textPrimary} />
              </Pressable>
              <Text style={styles.actionCount}>{post.comments}</Text>
            </View>
            <Pressable>
              <Ionicons name="bookmark-outline" size={24} color={theme.colors.textPrimary} />
            </Pressable>
          </View>

          {/* Caption */}
          <View style={styles.captionWrap}>
            <Text style={styles.captionText}>
              <Text style={styles.captionName}>{post.name} </Text>
              {post.caption}
            </Text>
            <Text style={styles.captionTags}>{post.tags}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  logo: {
    fontFamily: 'Syne-Bold',
    fontSize: 22,
    color: theme.colors.textPrimary,
    letterSpacing: 3,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    padding: 4,
  },

  // Stories
  storiesRow: {
    marginBottom: 8,
  },
  storiesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  storyItem: {
    width: 68,
    alignItems: 'center',
  },
  storyRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  storyAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
  },
  storyName: {
    fontFamily: 'DMSans-Regular',
    fontSize: 10,
    color: theme.colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },

  // Post
  postCard: {
    marginBottom: 24,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  postName: {
    fontFamily: 'DMSans-Medium',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  postLocation: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  postHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postTime: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: theme.colors.textMuted,
  },
  postPhoto: {
    width: SCREEN_WIDTH,
    height: 280,
  },

  // Actions
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    marginRight: 4,
  },
  actionCount: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    color: theme.colors.textMuted,
  },

  // Caption
  captionWrap: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  captionText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  captionName: {
    fontFamily: 'DMSans-Medium',
    color: theme.colors.textPrimary,
  },
  captionTags: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: theme.colors.accent,
    marginTop: 4,
  },
});
