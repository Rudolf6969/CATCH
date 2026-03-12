import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Badge } from '@/components/ui/Badge';

export default function PridatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + theme.spacing.lg }]}>
      {/* Close button */}
      <Pressable onPress={() => router.back()} style={styles.closeBtn}>
        <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
      </Pressable>

      <View style={styles.content}>
        <View style={styles.iconPreview}>
          <Ionicons name="fish-outline" size={48} color={theme.colors.primaryMid} />
        </View>
        <Text style={styles.title}>Pridať úlovok</Text>
        <Text style={styles.subtitle}>Zaznamenaj svojho kapra, pikantu alebo amura</Text>
        <Badge label="Čoskoro — Phase 2" variant="neutral" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.lg,
  },
  closeBtn: { alignSelf: 'flex-end', padding: theme.spacing.xs },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.lg,
  },
  iconPreview: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primaryMid,
  },
  title: {
    ...(theme.typography.heading as object),
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...(theme.typography.body as object),
    color: theme.colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
