// Web mock — posthog-react-native nie je dostupný na webe

type CoreEvent =
  | 'app_opened'
  | 'user_registered'
  | 'user_logged_in'
  | 'user_logged_out'
  | 'catch_created'
  | 'post_published'
  | 'listing_created'
  | 'premium_purchased';

export const posthog = {
  capture: () => {},
  identify: () => {},
  reset: () => {},
} as any;

export function captureEvent(event: CoreEvent, properties?: Record<string, unknown>): void {
  // no-op on web
}
