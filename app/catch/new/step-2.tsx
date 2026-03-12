import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { fishSpecies, searchFishSpecies } from '../../../src/constants/fishSpecies';
import type { FishSpecies } from '../../../src/constants/fishSpecies';
import { fetchWeatherForCatch } from '../../../src/services/weather';
import { WeatherBadge } from '../../../src/components/catch/WeatherBadge';
import type { WeatherSnapshot } from '../../../src/types/catch.types';

function WizardProgressBar({ step }: { step: 1 | 2 | 3 }) {
  return (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((s) => (
        <View key={s} style={[styles.progressSegment, s <= step && styles.progressSegmentActive]} />
      ))}
    </View>
  );
}

export default function Step2() {
  const insets = useSafeAreaInsets();
  const { photoUris } = useLocalSearchParams<{ photoUris: string }>();

  const [speciesSearch, setSpeciesSearch] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<FishSpecies | null>(null);
  const [weightG, setWeightG] = useState('');
  const [lengthCm, setLengthCm] = useState('');
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredSpecies = speciesSearch ? searchFishSpecies(speciesSearch) : fishSpecies.slice(0, 20);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          const w = await fetchWeatherForCatch(48.1, 17.1);
          setWeather(w);
        } else {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          const w = await fetchWeatherForCatch(loc.coords.latitude, loc.coords.longitude);
          setWeather(w);
        }
      } catch (e) {
        console.warn('Weather fetch failed:', e);
      } finally {
        setWeatherLoading(false);
      }
    })();
  }, []);

  const goToStep3 = () => {
    if (!selectedSpecies) {
      setError('Vyber druh ryby.');
      return;
    }
    if (!weightG || isNaN(Number(weightG))) {
      setError('Zadaj váhu (g).');
      return;
    }
    if (!lengthCm || isNaN(Number(lengthCm))) {
      setError('Zadaj dĺžku (cm).');
      return;
    }
    setError(null);
    router.push({
      pathname: '/catch/new/step-3',
      params: {
        photoUris,
        species: selectedSpecies.id,
        speciesName: selectedSpecies.name,
        weightG,
        lengthCm,
        weather: weather ? JSON.stringify(weather) : '',
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <WizardProgressBar step={2} />
      <Text style={styles.title}>Ryba a parametre</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.weatherSection}>
        <Text style={styles.sectionLabel}>Aktuálne počasie</Text>
        <WeatherBadge weather={weather ?? ({} as WeatherSnapshot)} loading={weatherLoading} />
      </View>

      <Text style={styles.sectionLabel}>Druh ryby</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Hľadaj druh ryby..."
        placeholderTextColor="rgba(255,255,255,0.4)"
        value={speciesSearch}
        onChangeText={setSpeciesSearch}
      />

      {selectedSpecies && (
        <View style={styles.selectedSpecies}>
          <Text style={styles.selectedSpeciesText}>{selectedSpecies.name}</Text>
          <TouchableOpacity onPress={() => setSelectedSpecies(null)}>
            <Text style={styles.clearText}>Zmeniť</Text>
          </TouchableOpacity>
        </View>
      )}

      {!selectedSpecies && (
        <FlatList
          data={filteredSpecies}
          keyExtractor={(item) => item.id}
          style={styles.speciesList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.speciesItem}
              onPress={() => { setSelectedSpecies(item); setSpeciesSearch(''); }}
            >
              <Text style={styles.speciesName}>{item.name}</Text>
              <Text style={styles.speciesLatin}>{item.latinName}</Text>
            </TouchableOpacity>
          )}
          nestedScrollEnabled
        />
      )}

      <View style={styles.row}>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Váha (g)</Text>
          <TextInput
            style={styles.numericInput}
            keyboardType="numeric"
            value={weightG}
            onChangeText={setWeightG}
            placeholder="5000"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>
        <View style={styles.inputHalf}>
          <Text style={styles.inputLabel}>Dĺžka (cm)</Text>
          <TextInput
            style={styles.numericInput}
            keyboardType="numeric"
            value={lengthCm}
            onChangeText={setLengthCm}
            placeholder="65"
            placeholderTextColor="rgba(255,255,255,0.3)"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={goToStep3}>
        <Text style={styles.nextButtonText}>Ďalej →</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
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
  title: { fontFamily: 'Syne-Bold', fontSize: 28, color: '#FFFFFF', marginBottom: 16 },
  errorText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: '#FF6B6B', marginBottom: 12 },
  weatherSection: { marginBottom: 20 },
  sectionLabel: { fontFamily: 'DMSans-Medium', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  searchInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'DMSans-Regular', fontSize: 15, color: '#FFFFFF', marginBottom: 8 },
  selectedSpecies: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(64,145,108,0.2)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16 },
  selectedSpeciesText: { fontFamily: 'DMSans-Medium', fontSize: 15, color: '#40916C' },
  clearText: { fontFamily: 'DMSans-Regular', fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  speciesList: { maxHeight: 180, marginBottom: 16 },
  speciesItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  speciesName: { fontFamily: 'DMSans-Medium', fontSize: 15, color: '#FFFFFF' },
  speciesLatin: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' },
  row: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  inputHalf: { flex: 1 },
  inputLabel: { fontFamily: 'DMSans-Regular', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 },
  numericInput: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontFamily: 'JetBrainsMono-Regular', fontSize: 18, color: '#FFFFFF', textAlign: 'center' },
  nextButton: { backgroundColor: '#E9A84C', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 12 },
  nextButtonText: { fontFamily: 'DMSans-Medium', fontSize: 16, color: '#0A1628' },
  backButton: { alignItems: 'center', paddingVertical: 12 },
  backButtonText: { fontFamily: 'DMSans-Regular', fontSize: 14, color: 'rgba(255,255,255,0.5)' },
});
