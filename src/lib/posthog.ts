import PostHog from 'posthog-react-native';

// API key z .env (EXPO_PUBLIC_ prefix = dostupné na klientovi)
const POSTHOG_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY ?? '';
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.posthog.com';

// Singleton — inicializovaný raz pri importe
export const posthog = new PostHog(POSTHOG_KEY, {
  host: POSTHOG_HOST,
  // Batch eventy pre efektivitu
  flushAt: 20,
  flushInterval: 10000,
  // Disabled v development ak nie je API key
  disabled: !POSTHOG_KEY,
});

// Type-safe event helper
type CoreEvent =
  | 'app_opened'
  | 'user_registered'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'catch_created'
  | 'post_published'
  | 'listing_created'
  | 'premium_purchased';

export function captureEvent(event: CoreEvent, properties?: Record<string, string | number | boolean | null>): void {
  posthog.capture(event, properties);
}
