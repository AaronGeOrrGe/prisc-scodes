import { ExpoRoot } from 'expo-router';
import { ThemeProvider } from './app/components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <ExpoRoot context={require.context('./app')} />
    </ThemeProvider>
  );
} 