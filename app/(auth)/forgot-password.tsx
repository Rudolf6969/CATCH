import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { theme } from '@/theme/theme';
import { Button } from '@/components/ui/Button';
import { AppTextInput } from '@/components/ui/TextInput';
import { i18n } from '@/lib/i18n';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    if (!email.trim()) {
      setEmailError(i18n.t('auth.errors.emailRequired'));
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      await auth().sendPasswordResetEmail(email.trim());
      setSent(true);
    } catch (e: any) {
      if (e.code === 'auth/user-not-found') {
        // Security: neodhaľovať existenciu accountu
        setSent(true);
      } else {
        setEmailError(i18n.t('auth.errors.unknown'));
      }
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <View style={styles.container}>
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>{i18n.t('auth.emailSent')}</Text>
          <Text style={styles.successSubtitle}>{i18n.t('auth.checkInbox')}</Text>
          <Text style={[styles.successSubtitle, { marginTop: theme.spacing.xs }]}>
            Skontroluj {email}
          </Text>
        </View>
        <Button
          label={i18n.t('common.back')}
          variant="secondary"
          onPress={() => router.back()}
          fullWidth
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{i18n.t('auth.resetPassword')}</Text>
          <Text style={styles.subtitle}>Pošleme ti odkaz na obnovu hesla</Text>
        </View>

        <AppTextInput
          label={i18n.t('auth.email')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          error={emailError}
          placeholder="jan@example.sk"
        />

        <Button
          label={i18n.t('auth.resetPassword')}
          onPress={handleReset}
          loading={loading}
          fullWidth
        />

        <Pressable onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.linkText}>{i18n.t('common.back')}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.bg },
  container: {
    flex: 1,
    backgroundColor: theme.colors.bg,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    justifyContent: 'center',
  },
  header: { gap: theme.spacing.xs },
  title: { ...(theme.typography.heading as object), color: theme.colors.textPrimary },
  subtitle: { ...(theme.typography.body as object), color: theme.colors.textMuted },
  successBox: { gap: theme.spacing.sm },
  successTitle: { ...(theme.typography.headingSemi as object), color: theme.colors.success },
  successSubtitle: { ...(theme.typography.body as object), color: theme.colors.textSecondary },
  backLink: { alignItems: 'center', marginTop: theme.spacing.sm },
  linkText: { ...(theme.typography.bodySm as object), color: theme.colors.primaryMid },
});
