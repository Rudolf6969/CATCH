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
import { theme } from '@/theme/theme';
import { Button } from '@/components/ui/Button';
import { AppTextInput } from '@/components/ui/TextInput';
import { i18n } from '@/lib/i18n';

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
      // Stack.Protected automaticky presmeruje na (tabs)
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>CATCH</Text>
          <Text style={styles.subtitle}>Rybárska komunita</Text>
        </View>

        {/* General error */}
        {errors.general && (
          <View style={styles.errorBox}>
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
          />
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
  header: { alignItems: 'center', gap: theme.spacing.xs },
  title: {
    ...(theme.typography.headingLg as object),
    color: theme.colors.textPrimary,
    letterSpacing: 4,
  },
  subtitle: { ...(theme.typography.body as object), color: theme.colors.textMuted },
  errorBox: {
    backgroundColor: theme.colors.errorSurface,
    borderRadius: theme.radius.sm,
    padding: theme.spacing.md,
  },
  errorBoxText: { ...(theme.typography.body as object), color: theme.colors.error },
  form: { gap: theme.spacing.md },
  forgotLink: { alignSelf: 'flex-end' },
  linkText: { ...(theme.typography.bodySm as object), color: theme.colors.primaryMid },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { ...(theme.typography.bodySm as object), color: theme.colors.textMuted },
});
