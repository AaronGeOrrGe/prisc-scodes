import React from 'react';
import { Slot } from 'expo-router';
import { CanvasProvider } from '../context/CanvasContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SearchProvider } from './context/SearchContext';
import { ProjectProvider } from './context/ProjectContext';

export default function RootLayout() {
  return (
    <ProjectProvider>
      <SafeAreaProvider>
        <SearchProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <CanvasProvider>
              <Slot />
            </CanvasProvider>
          </GestureHandlerRootView>
        </SearchProvider>
      </SafeAreaProvider>
    </ProjectProvider>
  );
}
