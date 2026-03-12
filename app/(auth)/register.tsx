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
      // 1. Vytvoriť Firebase account
      const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);

      // 2. Email verifikácia
      await credential.user.sendEmailVerification();

      // 3. Vytvoriť Firestore users dokument
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

      // Analytics: track úspešnú registráciu
      captureEvent('user_registered', { method: 'email' });

      // Stack.Protected presmeruje automaticky po auth state zmene
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
        <View style={styles.header}>
          <Text style={styles.title}>Registrácia</Text>
          <Text style={styles.subtitle}>Vytvor si bezplatný účet</Text>
        </View>

        {errors.general && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errors.general}</Text>
          </View>
        )}

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
          />
        </View>

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
  header: { alignItems: 'center', gap: theme.spacing.xs },
  title: { ...(theme.typography.heading as object), color: theme.colors.textPrimary },
  subtitle: { ...(theme.typography.body as object), color: theme.colors.textMuted },
  errorBox: {
    backgroundColor: theme.colors.errorSurface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
  },
  errorBoxText: { ...(theme.typography.body as object), color: theme.colors.error },
  form: { gap: theme.spacing.md },
  linkText: { ...(theme.typography.bodySm as object), color: theme.colors.primaryMid },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { ...(theme.typography.bodySm as object), color: theme.colors.textMuted },
});
