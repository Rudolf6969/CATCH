import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image as RNImage } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

function WizardProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((s) => (
        <View
          key={s}
          style={[
            styles.progressSegment,
            s <= step && styles.progressSegmentActive,
          ]}
        />
      ))}
    </View>
  );
}

export default function Step1() {
  const insets = useSafeAreaInsets();
  const [selectedPhotos, setSelectedPhotos] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [error, setError] = useState<string | null>(null);

  const pickFromGallery = async () => {
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Prístup k fotogalérií bol zamietnutý. Povoľ prístup v nastaveniach.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setSelectedPhotos(result.assets);
    }
  };

  const takePhoto = async () => {
    setError(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Prístup ku kamere bol zamietnutý. Povoľ prístup v nastaveniach.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: false,
    });

    if (!result.canceled) {
      setSelectedPhotos([result.assets[0]]);
    }
  };

  const goToStep2 = () => {
    if (selectedPhotos.length === 0) {
      setError('Vyber aspoň 1 fotku úlovku.');
      return;
    }
    const uris = selectedPhotos.map(p => p.uri).join(',');
    router.push({ pathname: '/catch/new/step-2', params: { photoUris: uris } });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <WizardProgressBar step={1} />

      <Text style={styles.title}>Fotka úlovku</Text>
      <Text style={styles.subtitle}>Pridaj až 5 fotiek tvojho úlovku</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {selectedPhotos.length > 0 && (
        <View style={styles.previewRow}>
          {selectedPhotos.map((p, i) => (
            <RNImage key={i} source={{ uri: p.uri }} style={styles.previewThumb} />
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={pickFromGallery}>
        <Text style={styles.primaryButtonText}>Vybrať z galérie</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={takePhoto}>
        <Text style={styles.secondaryButtonText}>Odfotiť teraz</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, selectedPhotos.length === 0 && styles.nextButtonDisabled]}
        onPress={goToStep2}
        disabled={selectedPhotos.length === 0}
      >
        <Text style={styles.nextButtonText}>Ďalej →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
        <Text style={styles.cancelButtonText}>Zrušiť</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628', paddingHorizontal: 20 },
  progressContainer: { flexDirection: 'row', gap: 6, marginBottom: 32 },
  progressSegment: { flex: 1, height: 2, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 1 },
  progressSegmentActive: { backgroundColor: '#E9A84C' },
  title: { fontFamily: 'Outfit-Bold', fontSize: 28, color: '#FFFFFF', marginBottom: 8 },
  subtitle: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
  errorText: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 14, color: '#FF6B6B', marginBottom: 16 },
  previewRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  previewThumb: { width: 72, height: 72, borderRadius: 8 },
  primaryButton: { backgroundColor: '#40916C', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  primaryButtonText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 16, color: '#FFFFFF' },
  secondaryButton: { borderWidth: 1, borderColor: '#40916C', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 32 },
  secondaryButtonText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 16, color: '#40916C' },
  nextButton: { backgroundColor: '#E9A84C', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  nextButtonDisabled: { opacity: 0.4 },
  nextButtonText: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 16, color: '#0A1628' },
  cancelButton: { alignItems: 'center', paddingVertical: 12 },
  cancelButtonText: { fontFamily: 'PlusJakartaSans-Regular', fontSize: 14, color: 'rgba(255,255,255,0.5)' },
});
