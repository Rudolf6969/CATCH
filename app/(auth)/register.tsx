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
import firestore from '@react-native-firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/theme/theme';
import { Button } from '@/components/ui/Button';
import { AppTextInput } from '@/components/ui/TextInput';
import { i18n } from '@/lib/i18n';
import { captureEvent } from '@/lib/posthog';

type RegisterErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
};

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const newErrors: RegisterErrors = {};
    if (!email.trim()) newErrors.email = i18n.t('auth.errors.emailRequired');
    if (!password) newErrors.password = i18n.t('auth.errors.passwordRequired');
    else if (password.length < 8) newErrors.password = i18n.t('auth.errors.passwordTooShort');
    if (password !== confirmPassword)
      newErrors.confirmPassword = i18n.t('auth.errors.passwordMismatch');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setErrors({});
    setLoading(true);
    try {
      const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);
      await credential.user.sendEmailVerification();
      await firestore().collection('users').doc(credential.user.uid).set({
        uid: credential.user.uid,
        email: credential.user.email,
        displayName: '',
        avatarUrl: null,
        bio: '',
        createdAt: firestore.FieldValue.serverTimestamp(),
        catchCount: 0,
        totalWeightGrams: 0,
        biggestCatchGrams: 0,
        karma: 0,
        isPremium: false,
        badges: [],
      });
      captureEvent('user_registered', { method: 'email' });
    } catch (e: any) {
      const code: string = e.code ?? '';
      if (code === 'auth/email-already-in-use') {
        setErrors({ email: 'Tento email je už registrovaný' });
      } else if (code === 'auth/invalid-email') {
        setErrors({ email: i18n.t('auth.errors.invalidEmail') });
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
        {/* Header */}
        <View style={styles.headerSection}>
          <View style={styles.iconWrap}>
            <Ionicons name="person-add-outline" size={28} color={theme.colors.primaryMid} />
          </View>
          <Text style={styles.title}>Registrácia</Text>
          <Text style={styles.subtitle}>Pridaj sa ku komunite rybárov</Text>
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
            autoComplete="new-password"
            error={errors.password}
            helper="Minimálne 8 znakov"
            placeholder="••••••••"
          />
          <AppTextInput
            label={i18n.t('auth.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoComplete="new-password"
            error={errors.confirmPassword}
            placeholder="••••••••"
          />

          <Button
            label={i18n.t('auth.register')}
            onPress={handleRegister}
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

        {/* Social */}
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

        {/* Login link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{i18n.t('auth.hasAccount')} </Text>
          <Pressable onPress={() => router.back()}>
            <Text style={[styles.footerText, styles.linkText]}>
              {i18n.t('auth.loginHere')}
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

  // Header
  headerSection: { alignItems: 'center', gap: theme.spacing.sm },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(82,183,136,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(82,183,136,0.2)',
  },
  title: { ...(theme.typography.heading as object), color: theme.colors.textPrimary },
  subtitle: { ...(theme.typography.body as object), color: theme.colors.textMuted },

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
