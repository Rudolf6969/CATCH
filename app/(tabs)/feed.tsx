import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const POSTS = [
  {
    id: '1',
    name: 'Marek Kováč',
    initials: 'MK',
    time: 'pred 2h',
    location: 'VN Orava',
    fish: 'Kapor',
    weight: '8.2 kg',
    length: '72 cm',
    text: 'Ranný záťah na boilies, kapor bral od 5:30. Najlepší deň tejto sezóny!',
    likes: 24,
    comments: 7,
    photoColor: '#1A2A1F',
  },
  {
    id: '2',
    name: 'Jana Hrušková',
    initials: 'JH',
    time: 'pred 5h',
    location: 'Dunaj — Komárno',
    fish: 'Sumec',
    weight: '14.5 kg',
    length: '118 cm',
    text: 'Nočný lov na mŕtvu rybku. Po 3h čakania konečne zabralo.',
    likes: 41,
    comments: 12,
    photoColor: '#1A2218',
  },
  {
    id: '3',
    name: 'Peter Novotný',
    initials: 'PN',
    time: 'pred 1d',
    location: 'Štrkovisko Senec',
    fish: 'Amur',
    weight: '11.8 kg',
    length: '89 cm',
    text: 'Prvý amur sezóny! Kukurica na vlasový nadväzec, feeder 60g.',
    likes: 56,
    comments: 18,
    photoColor: '#182015',
  },
];

export default function FeedScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Feed</Text>
        <Badge label="Komunita" variant="live" />
      </View>

      {POSTS.map((post) => (
        <Card key={post.id} style={styles.postCard}>
          {/* Post header */}
          <View style={styles.postHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{post.initials}</Text>
            </View>
            <View style={styles.postMeta}>
              <Text style={styles.postName}>{post.name}</Text>
              <View style={styles.postSubRow}>
                <Text style={styles.postTime}>{post.time}</Text>
                <Text style={styles.postDot}>·</Text>
                <Ionicons name="location-outline" size={12} color={theme.colors.textMuted} />
                <Text style={styles.postLocation}>{post.location}</Text>
              </View>
            </View>
          </View>

          {/* Photo placeholder */}
          <View style={[styles.photoPlaceholder, { backgroundColor: post.photoColor }]}>
            <Ionicons name="fish-outline" size={40} color={theme.colors.primaryMid} style={{ opacity: 0.3 }} />
          </View>

          {/* Catch info */}
          <View style={styles.catchInfo}>
            <Badge label={post.fish} variant="primary" size="sm" />
            <Text style={styles.catchStat}>{post.weight}</Text>
            <Text style={styles.catchDivider}>|</Text>
            <Text style={styles.catchStat}>{post.length}</Text>
          </View>

          {/* Description */}
          <Text style={styles.postText}>{post.text}</Text>

          {/* Actions */}
          <View style={styles.postActions}>
            <Pressable style={styles.actionBtn}>
              <Ionicons name="heart-outline" size={18} color={theme.colors.textMuted} />
              <Text style={styles.actionCount}>{post.likes}</Text>
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={16} color={theme.colors.textMuted} />
              <Text style={styles.actionCount}>{post.comments}</Text>
            </Pressable>
            <Pressable style={styles.actionBtn}>
              <Ionicons name="share-outline" size={16} color={theme.colors.textMuted} />
            </Pressable>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.md, gap: theme.spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  title: { ...(theme.typography.heading as object), color: theme.colors.textPrimary },

  // Post card
  postCard: { gap: theme.spacing.sm },
  postHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  avatarText: { ...(theme.typography.bodySmMedium as object), color: theme.colors.primaryMid },
  postMeta: { flex: 1, gap: 2 },
  postName: { ...(theme.typography.bodyMedium as object), color: theme.colors.textPrimary },
  postSubRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  postTime: { ...(theme.typography.caption as object), color: theme.colors.textMuted },
  postDot: { color: theme.colors.textMuted, fontSize: 10 },
  postLocation: { ...(theme.typography.caption as object), color: theme.colors.textMuted },

  // Photo
  photoPlaceholder: {
    height: 200,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },

  // Catch info
  catchInfo: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  catchStat: { ...(theme.typography.monoSm as object), color: theme.colors.textPrimary },
  catchDivider: { color: theme.colors.textMuted, fontSize: 12 },

  // Text
  postText: { ...(theme.typography.body as object), color: theme.colors.textSecondary, lineHeight: 22 },

  // Actions
  postActions: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.xs,
    borderTopWidth: 1,
    borderTopColor: theme.colors.cardBorder,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionCount: { ...(theme.typography.caption as object), color: theme.colors.textMuted },
});
