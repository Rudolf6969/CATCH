import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Button } from '@/components/ui/Button';
import { AppTextInput } from '@/components/ui/TextInput';
import { i18n } from '@/lib/i18n';
import { captureEvent } from '@/lib/posthog';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type LoginErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: LoginErrors = {};
    if (!email.trim()) newErrors.email = i18n.t('auth.errors.emailRequired');
    if (!password) newErrors.password = i18n.t('auth.errors.passwordRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleLogin() {
    if (!validate()) return;
    setErrors({});
    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password);
      captureEvent('user_logged_in', { method: 'email' });
    } catch (e: unknown) {
      const code: string = (e as { code?: string }).code ?? '';
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
      ) {
        setErrors({ general: i18n.t('auth.errors.invalidCredential') });
      } else if (code === 'auth/too-many-requests') {
        setErrors({ general: i18n.t('auth.errors.tooManyRequests') });
      } else if (code === 'auth/network-request-failed') {
        setErrors({ general: i18n.t('auth.errors.networkError') });
      } else {
        setErrors({ general: i18n.t('auth.errors.unknown') });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.root}>
      {/* Fullscreen background photo */}
      <Image
        source={{ uri: 'https://picsum.photos/seed/fishing-dawn/400/800' }}
        style={styles.bgImage}
        resizeMode="cover"
      />

      {/* Dark overlay */}
      <View style={styles.bgOverlay} />

      {/* Top branding */}
      <View style={styles.branding}>
        <Ionicons name="fish" size={48} color={theme.colors.primary} />
        <Text style={styles.brandName}>OnlyFish</Text>
        <Text style={styles.brandTagline}>Sociálna sieť pre rybárov</Text>
      </View>

      {/* Bottom card */}
      <KeyboardAvoidingView
        style={styles.bottomWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.cardContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Vitaj späť</Text>
            <Text style={styles.cardSubtitle}>Prihlás sa do svojho účtu</Text>

            {/* General error */}
            {errors.general && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={18} color={theme.colors.error} />
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}

            {/* Form */}
            <View style={styles.form}>
              <AppTextInput
                label={i18n.t('auth.email')}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={errors.email}
                placeholder="jan@example.sk"
              />
              <AppTextInput
                label={i18n.t('auth.password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="current-password"
                error={errors.password}
                placeholder="••••••••"
              />

              <Pressable
                onPress={() => router.push('/(auth)/forgot-password')}
                style={styles.forgotLink}
              >
                <Text style={styles.forgotText}>Zabudol si heslo?</Text>
              </Pressable>

              <Button
                label={i18n.t('auth.login')}
                onPress={handleLogin}
                loading={loading}
                fullWidth
                size="lg"
              />
            </View>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>alebo</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google button */}
            <Pressable style={styles.googleBtn}>
              <Ionicons name="logo-google" size={18} color={theme.colors.textPrimary} />
              <Text style={styles.googleLabel}>Pokračovať s Google</Text>
            </Pressable>

            {/* Register link */}
            <View style={styles.registerRow}>
              <Text style={styles.registerMuted}>Nemáš účet? </Text>
              <Pressable onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.registerLink}>Registruj sa</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },

  // Background
  bgImage: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  bgOverlay: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },

  // Branding
  branding: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
    alignItems: 'center',
  },
  brandEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  brandName: {
    fontFamily: 'Syne-Bold',
    fontSize: 36,
    color: '#FFFFFF',
    letterSpacing: 6,
  },
  brandTagline: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },

  // Bottom card
  bottomWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  cardContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    gap: 16,
  },
  cardTitle: {
    fontFamily: 'Syne-Bold',
    fontSize: 24,
    color: theme.colors.textPrimary,
  },
  cardSubtitle: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: theme.colors.textMuted,
    marginBottom: 8,
  },

  // Error
  errorBox: {
    backgroundColor: theme.colors.errorSurface,
    borderRadius: theme.radius.sm,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    color: theme.colors.error,
    flex: 1,
  },

  // Form
  form: {
    gap: 14,
  },
  forgotLink: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    color: theme.colors.accent,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  dividerText: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    color: theme.colors.textMuted,
  },

  // Google
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    backgroundColor: theme.colors.surfaceHigh,
  },
  googleLabel: {
    fontFamily: 'DMSans-Medium',
    fontSize: 15,
    color: theme.colors.textPrimary,
  },

  // Register
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerMuted: {
    fontFamily: 'DMSans-Regular',
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  registerLink: {
    fontFamily: 'DMSans-Medium',
    fontSize: 13,
    color: theme.colors.accent,
  },
});
