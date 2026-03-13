import { theme } from '../../src/theme/theme';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/auth.store';
import { useCatchDetail, useDeleteCatch } from '../../src/hooks/useCatches';
import { CatchCarousel } from '../../src/components/catch/CatchCarousel';
import { WeatherDetail } from '../../src/components/catch/WeatherDetail';

export default function CatchDetailScreen() {
  const insets = useSafeAreaInsets();
  const { catchId } = useLocalSearchParams<{ catchId: string }>();
  const user = useAuthStore(s => s.user);

  const { data: catchDoc, isLoading } = useCatchDetail(catchId ?? '');
  const deleteMutation = useDeleteCatch(user?.uid ?? '');

  const isOwnCatch = user?.uid === catchDoc?.userId;

  const handleDelete = () => {
    Alert.alert(
      'Zmazať úlovok',
      'Naozaj chceš zmazať tento úlovok? Táto akcia sa nedá vrátiť.',
      [
        { text: 'Zrušiť', style: 'cancel' },
        {
          text: 'Zmazať',
          style: 'destructive',
          onPress: async () => {
            if (!catchId) return;
            await deleteMutation.mutateAsync(catchId);
            router.back();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="theme.colors.primary" />
      </View>
    );
  }

  if (!catchDoc) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.notFoundText}>Úlovok sa nenašiel</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Späť</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const weightKg = (catchDoc.weightG / 1000).toFixed(2);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Carousel fotiek */}
        <CatchCarousel photos={catchDoc.photos} />

        {/* Back button overlay */}
        <TouchableOpacity
          style={[styles.backBtn, { top: insets.top + 8 }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Species + štatistiky */}
          <Text style={styles.species}>{catchDoc.species}</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{weightKg}</Text>
              <Text style={styles.statLabel}>kg</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{catchDoc.lengthCm}</Text>
              <Text style={styles.statLabel}>cm</Text>
            </View>
            {catchDoc.depthM && (
              <>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{catchDoc.depthM}</Text>
                  <Text style={styles.statLabel}>m hĺbka</Text>
                </View>
              </>
            )}
          </View>

          {/* Caption */}
          {catchDoc.caption && (
            <Text style={styles.caption}>{catchDoc.caption}</Text>
          )}

          {/* Metadáta */}
          <View style={styles.metaSection}>
            {catchDoc.method && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Metóda</Text>
                <Text style={styles.metaValue}>{catchDoc.method}</Text>
              </View>
            )}
            {catchDoc.bait && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Nástraha</Text>
                <Text style={styles.metaValue}>{catchDoc.bait}</Text>
              </View>
            )}
            {catchDoc.locationName && (
              <View style={styles.metaRow}>
                <Text style={styles.metaLabel}>Revír</Text>
                <Text style={styles.metaValue}>{catchDoc.locationName}</Text>
              </View>
            )}
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Dátum</Text>
              <Text style={styles.metaValue}>
                {catchDoc.createdAt?.toDate?.()?.toLocaleDateString('sk-SK', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                }) ?? ''}
              </Text>
            </View>
          </View>

          {/* Počasie pri úlovku */}
          <WeatherDetail
            weather={catchDoc.weather}
            capturedAt={catchDoc.createdAt?.toDate?.()}
          />

          {/* Delete — len pre vlastné úlovky */}
          {isOwnCatch && (
            <View style={styles.ownActions}>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Text style={styles.deleteBtnText}>
                  {deleteMutation.isPending ? 'Mazanie...' : 'Zmazať úlovok'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  centered: { justifyContent: 'center', alignItems: 'center' },
  notFoundText: { fontFamily: 'DMSans-Regular', fontSize: 16, color: theme.colors.textMuted, marginBottom: 16 },
  backLink: { fontFamily: 'DMSans-Regular', fontSize: 15, color: theme.colors.primary },
  backBtn: {
    position: 'absolute',
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: { fontFamily: 'DMSans-Regular', fontSize: 20, color: theme.colors.textPrimary },
  content: { padding: 20 },
  species: { fontFamily: 'Syne-Bold', fontSize: 28, color: theme.colors.textPrimary, marginBottom: 12 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceHigh,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: { alignItems: 'center' },
  statValue: { fontFamily: 'JetBrainsMono-Regular', fontSize: 22, color: theme.colors.primary },
  statLabel: { fontFamily: 'DMSans-Regular', fontSize: 12, color: theme.colors.textMuted },
  statDivider: { width: 1, height: 32, backgroundColor: theme.colors.divider },
  caption: { fontFamily: 'DMSans-Regular', fontSize: 15, color: theme.colors.textSecondary, lineHeight: 22, marginBottom: 16 },
  metaSection: {
    backgroundColor: theme.colors.surfaceHigh,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    marginTop: 8,
  },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  metaLabel: { fontFamily: 'DMSans-Regular', fontSize: 13, color: theme.colors.textMuted },
  metaValue: { fontFamily: 'DMSans-Medium', fontSize: 13, color: theme.colors.textPrimary, maxWidth: '60%', textAlign: 'right' },
  ownActions: { marginTop: 32 },
  deleteBtn: {
    borderWidth: 1,
    borderColor: theme.colors.error,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  deleteBtnText: { fontFamily: 'DMSans-Medium', fontSize: 15, color: theme.colors.error },
});
