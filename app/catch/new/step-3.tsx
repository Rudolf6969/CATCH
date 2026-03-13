import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { useAuthStore } from '../../../src/stores/auth.store';
import { createCatch } from '../../../src/hooks/useCatches';
import { uploadCatchPhoto } from '../../../src/services/imageUpload';
import type { CatchDocument } from '../../../src/types/catch.types';

function WizardProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={[styles.progressSegment, s <= step && styles.progressSegmentActive]} />
      ))}
    </View>
  );
}

export default function Step3() {
  const insets = useSafeAreaInsets();
  const { photoUris, species, speciesName, weightG, lengthCm, weather } = useLocalSearchParams<{
    photoUris: string;
    species: string;
    speciesName: string;
    weightG: string;
    lengthCm: string;
    weather: string;
  }>();

  const user = useAuthStore(s => s.user);
  const [locationName, setLocationName] = useState('');
  const [caption, setCaption] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    setError(null);

    try {
      const catchId = firestore().collection('catches').doc().id;
      const uris = photoUris?.split(',').filter(Boolean) ?? [];

      const photos = await Promise.all(
        uris.map(async (uri, idx) => {
          const result = await uploadCatchPhoto(
            uri,
            user.uid,
            catchId,
            `photo_${idx}`,
            (pct) => setUploadProgress((idx + pct) / uris.length)
          );
          return { ...result, filename: `photo_${idx}` };
        })
      );

      const parsedWeather = weather ? JSON.parse(weather) : {
        temperature: 0, pressure: 1013, windSpeed: 0, precipitation: 0,
        moonPhase: 'Novoluní', moonIllumination: 0,
      };

      const catchData: CatchDocument = {
        id: catchId,
        userId: user.uid,
        userDisplayName: user.displayName ?? 'Rybár',
        userAvatar: user.photoURL ?? '',
        species: speciesName ?? species,
        weightG: Number(weightG) || 0,
        lengthCm: Number(lengthCm) || 0,
        photos,
        locationName: locationName || undefined,
        weather: parsedWeather,
        caption: caption || undefined,
        isPublic,
        likes: 0,
        likedBy: [],
        createdAt: firestore.Timestamp.now(),
        updatedAt: firestore.Timestamp.now(),
      };

      const docRef = firestore().collection('catches').doc(catchId);
      createCatch(docRef, catchData);

      router.replace('/(tabs)/feed');
    } catch (e) {
      setError('Chyba pri ukladaní úlovku. Skús znova.');
      console.error('Submit error:', e);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <WizardProgressBar step={3} />
      <Text style={styles.title}>Dokončenie</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {submitting && (
        <View style={styles.uploadProgress}>
          <ActivityIndicator color="#E9A84C" />
          <Text style={styles.uploadText}>Nahrávam fotky... {Math.round(uploadProgress * 100)}%</Text>
        </View>
      )}

      <Text style={styles.inputLabel}>Revír / Lokalita (voliteľné)</Text>
      <TextInput
        style={styles.textInput}
        placeholder="napr. VN Orava, sektor B"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={locationName}
        onChangeText={setLocationName}
        editable={!submitting}
      />

      <Text style={styles.inputLabel}>Poznámka</Text>
      <TextInput
        style={[styles.textInput, styles.captionInput]}
        placeholder="Čo na to povieš?"
        placeholderTextColor="rgba(255,255,255,0.3)"
        value={caption}
        onChangeText={setCaption}
        multiline
        numberOfLines={3}
        editable={!submitting}
      />

      <View style={styles.visibilityRow}>
        <Text style={styles.visibilityLabel}>Zverejniť vo Feede</Text>
        <TouchableOpacity
          style={[styles.toggle, isPublic && styles.toggleActive]}
          onPress={() => setIsPublic(!isPublic)}
        >
          <View style={[styles.toggleThumb, isPublic && styles.toggleThumbActive]} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitButtonText}>
          {submitting ? 'Ukladám...' : 'Uložiť úlovok'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()} disabled={submitting}>
        <Text style={styles.backButtonText}>← Späť</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628', paddingHorizontal: 20 },
  progressContainer: { flexDirection: 'row', gap: 6, marginBottom: 24 },
  progressSegment: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 },
  progressSegmentActive: { backgroundColor: '#E9A84C' },
  title: { fontFamily: 'Outfit-Bold', fontSize: 28, color: '#FFFFFF', marginBottom: 24 },
  errorText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: '#FF6B6B', marginBottom: 12 },
  uploadProgress: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 14, marginBottom: 16 },
  uploadText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: 'rgba(255,255,255,0.7)' },
  inputLabel: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, marginTop: 16, textTransform: 'uppercase', letterSpacing: 0.5 },
  textInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'PlusJakartaSans-Medium', fontSize: 15, color: '#FFFFFF' },
  captionInput: { minHeight: 80, textAlignVertical: 'top' },
  visibilityRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 32 },
  visibilityLabel: { fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 15, color: '#FFFFFF' },
  toggle: { width: 48, height: 28, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.2)', padding: 2, justifyContent: 'center' },
  toggleActive: { backgroundColor: '#40916C' },
  toggleThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.5)' },
  toggleThumbActive: { backgroundColor: '#FFFFFF', alignSelf: 'flex-end' },
  submitButton: { backgroundColor: '#E9A84C', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { fontFamily: 'PlusJakartaSans-SemiBold', fontSize: 16, color: '#0A1628' },
  backButton: { alignItems: 'center', paddingVertical: 12 },
  backButtonText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 14, color: 'rgba(255,255,255,0.5)' },
});
