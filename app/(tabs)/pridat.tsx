import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Card } from '@/components/ui/Card';
import { AppTextInput } from '@/components/ui/TextInput';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const FISH_TYPES = ['Kapor', 'Sumec', 'Šťuka', 'Zubáč', 'Amur', 'Pstruh', 'Lieň', 'Iné'];

export default function PridatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedFish, setSelectedFish] = useState<string | null>(null);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + theme.spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Nový úlovok</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
        </Pressable>
      </View>

      {/* Step 1: Photo */}
      <View style={styles.section}>
        <Text style={styles.stepLabel}>1. Fotka</Text>
        <Pressable style={styles.photoUpload}>
          <View style={styles.photoIconWrap}>
            <Ionicons name="camera-outline" size={32} color={theme.colors.primaryMid} />
          </View>
          <Text style={styles.photoText}>Odfotografuj svoj úlovok</Text>
          <Text style={styles.photoSubtext}>alebo vyber z galérie</Text>
        </Pressable>
      </View>

      {/* Step 2: Fish type */}
      <View style={styles.section}>
        <Text style={styles.stepLabel}>2. Druh ryby</Text>
        <View style={styles.fishGrid}>
          {FISH_TYPES.map((fish) => (
            <Pressable
              key={fish}
              onPress={() => setSelectedFish(fish)}
              style={[
                styles.fishChip,
                selectedFish === fish && styles.fishChipActive,
              ]}
            >
              <Text style={[
                styles.fishChipText,
                selectedFish === fish && styles.fishChipTextActive,
              ]}>
                {fish}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Step 3: Details */}
      <View style={styles.section}>
        <Text style={styles.stepLabel}>3. Detaily</Text>
        <Card style={styles.detailsCard}>
          <View style={styles.detailsRow}>
            <View style={styles.detailHalf}>
              <AppTextInput label="Váha (kg)" placeholder="8.2" keyboardType="decimal-pad" />
            </View>
            <View style={styles.detailHalf}>
              <AppTextInput label="Dĺžka (cm)" placeholder="72" keyboardType="number-pad" />
            </View>
          </View>
          <AppTextInput label="Lokalita" placeholder="VN Orava, sektor B" />
          <AppTextInput
            label="Popis"
            placeholder="Návnada, technika, story..."
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </Card>
      </View>

      {/* Submit */}
      <View style={styles.submitSection}>
        <Button label="Zdieľať úlovok" fullWidth />
        <Text style={styles.submitNote}>Úlovok sa zobrazí vo feede komunity</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  content: { padding: theme.spacing.lg, gap: theme.spacing.xl },

  // Header
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { ...(theme.typography.heading as object), color: theme.colors.textPrimary },
  closeBtn: { padding: theme.spacing.xs },

  // Sections
  section: { gap: theme.spacing.sm },
  stepLabel: { ...(theme.typography.headingSm as object), color: theme.colors.accent },

  // Photo upload
  photoUpload: {
    height: 180,
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    borderColor: theme.colors.cardBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.sm,
  },
  photoIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(82,183,136,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: { ...(theme.typography.bodyMedium as object), color: theme.colors.textPrimary },
  photoSubtext: { ...(theme.typography.bodySm as object), color: theme.colors.textMuted },

  // Fish chips
  fishGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  fishChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surface,
  },
  fishChipActive: {
    borderColor: theme.colors.primaryMid,
    backgroundColor: 'rgba(82,183,136,0.12)',
  },
  fishChipText: { ...(theme.typography.bodySmMedium as object), color: theme.colors.textSecondary },
  fishChipTextActive: { color: theme.colors.primaryMid },

  // Details
  detailsCard: { gap: theme.spacing.md },
  detailsRow: { flexDirection: 'row', gap: theme.spacing.sm },
  detailHalf: { flex: 1 },
  textArea: { minHeight: 80, textAlignVertical: 'top' },

  // Submit
  submitSection: { gap: theme.spacing.sm, alignItems: 'center', paddingBottom: theme.spacing.xxl },
  submitNote: { ...(theme.typography.caption as object), color: theme.colors.textMuted },
});
