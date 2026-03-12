import React, { useState } from 'react';
import {
  View,
  TextInput as RNTextInput,
  Text,
  StyleSheet,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { theme } from '@/theme/theme';

interface AppTextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  helper?: string;
}

export function AppTextInput({ label, error, helper, style, ...props }: AppTextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <RNTextInput
        {...props}
        style={[
          styles.input,
          focused && styles.inputFocused,
          error ? styles.inputError : undefined,
          style,
        ]}
        placeholderTextColor={theme.colors.textMuted}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helper && !error && <Text style={styles.helperText}>{helper}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: theme.spacing.xs },
  label: { ...(theme.typography.bodySmMedium as object), color: theme.colors.textSecondary },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    color: theme.colors.textPrimary,
    ...(theme.typography.body as object),
    minHeight: 48,
  },
  inputFocused: {
    borderColor: theme.colors.primaryMid,
    shadowColor: theme.colors.primaryMid,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  inputError: { borderColor: theme.colors.error },
  errorText: { ...(theme.typography.bodySm as object), color: theme.colors.error },
  helperText: { ...(theme.typography.bodySm as object), color: theme.colors.textMuted },
});
