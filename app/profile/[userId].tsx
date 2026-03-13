import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/stores/auth.store';
import { useUserProfile, useUserCatches, isOwnProfileCheck } from '../../src/hooks/useProfile';
import { ProfileHeader } from '../../src/components/profile/ProfileHeader';
import { CatchGrid } from '../../src/components/profile/CatchGrid';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { userId: profileId } = useLocalSearchParams<{ userId: string }>();
  const currentUser = useAuthStore(s => s.user);

  const { data: userDoc, isLoading: profileLoading } = useUserProfile(profileId ?? '');
  const { data: catches = [], isLoading: catchesLoading } = useUserCatches(profileId ?? '', 12);

  // isOwnProfile = currentUserId === profileId (Twitter pattern)
  const isOwnProfile = isOwnProfileCheck(currentUser?.uid ?? '', profileId ?? '');

  if (profileLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#40916C" />
      </View>
    );
  }

  if (!userDoc) {
    return (
      <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.notFound}>Profil sa nenašiel</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ProfileHeader
          user={userDoc}
          isOwnProfile={isOwnProfile}
          onEditProfile={() => {
            // Phase 5+ — edit profile screen
          }}
        />

        {catchesLoading ? (
          <View style={styles.gridLoading}>
            <ActivityIndicator color="#40916C" />
          </View>
        ) : (
          <CatchGrid catches={catches} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  centered: { justifyContent: 'center', alignItems: 'center' },
  notFound: { fontFamily: 'PlusJakartaSans-Medium', fontSize: 16, color: 'rgba(255,255,255,0.5)' },
  gridLoading: { paddingVertical: 40, alignItems: 'center' },
});
