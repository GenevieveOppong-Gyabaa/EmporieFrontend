// app/components/Layout.tsx
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <SafeAreaProvider>{children}</SafeAreaProvider>;
}
