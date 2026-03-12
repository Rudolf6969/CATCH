import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Button } from '@/components/ui/Button';
import { AppTextInput } from '@/components/ui/TextInput';
import { i18n } from '@/lib/i18n';
import { captureEvent } from '@/lib/posthog';

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
    } catch (e: any) {
      const code: string = e.code ?? '';
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Branding */}
        <View style={styles.branding}>
          <View style={styles.logoCircle}>
            <Ionicons name="fish" size={36} color={theme.colors.primaryMid} />
          </View>
          <Text style={styles.logoText}>CATCH</Text>
          <Text style={styles.tagline}>Rybárska komunita</Text>
        </View>

        {/* General error */}
        {errors.general && (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={18} color={theme.colors.error} />
            <Text style={styles.errorBoxText}>{errors.general}</Text>
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
            <Text style={styles.linkText}>{i18n.t('auth.forgotPassword')}</Text>
          </Pressable>

          <Button
            label={i18n.t('auth.login')}
            onPress={handleLogin}
            loading={loading}
            fullWidth
            size="lg"
          />
        </View>

        {/* Social divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>alebo</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social buttons */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialBtn}>
            <Ionicons name="logo-google" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.socialLabel}>Google</Text>
          </Pressable>
          <Pressable style={styles.socialBtn}>
            <Ionicons name="logo-apple" size={20} color={theme.colors.textPrimary} />
            <Text style={styles.socialLabel}>Apple</Text>
          </Pressable>
        </View>

        {/* Register link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{i18n.t('auth.noAccount')} </Text>
          <Pressable onPress={() => router.push('/(auth)/register')}>
            <Text style={[styles.footerText, styles.linkText]}>
              {i18n.t('auth.registerHere')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.bg },
  container: {
    flexGrow: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },

  // Branding
  branding: { alignItems: 'center', gap: theme.spacing.sm },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(82,183,136,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(82,183,136,0.2)',
  },
  logoText: {
    ...(theme.typography.headingLg as object),
    color: theme.colors.textPrimary,
    letterSpacing: 6,
    fontSize: 32,
  },
  tagline: { ...(theme.typography.body as object), color: theme.colors.textMuted },

  // Error
  errorBox: {
    backgroundColor: theme.colors.errorSurface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  errorBoxText: { ...(theme.typography.body as object), color: theme.colors.error, flex: 1 },

  // Form
  form: { gap: theme.spacing.md },
  forgotLink: { alignSelf: 'flex-end' },
  linkText: { ...(theme.typography.bodySm as object), color: theme.colors.primaryMid },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md },
  dividerLine: { flex: 1, height: 1, backgroundColor: theme.colors.cardBorder },
  dividerText: { ...(theme.typography.caption as object), color: theme.colors.textMuted },

  // Social
  socialRow: { flexDirection: 'row', gap: theme.spacing.sm },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
  },
  socialLabel: { ...(theme.typography.bodyMedium as object), color: theme.colors.textPrimary },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { ...(theme.typography.bodySm as object), color: theme.colors.textMuted },
});
