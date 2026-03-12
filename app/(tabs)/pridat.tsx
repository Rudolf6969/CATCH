import { Redirect } from 'expo-router';

// Pridat tab slúži ako entry point — hneď redirectuje na wizard
export default function PridatRedirect() {
  return <Redirect href="/catch/new/step-1" />;
}
