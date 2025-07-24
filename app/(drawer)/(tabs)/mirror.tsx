import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { useCanvas } from '../../../context/CanvasContext';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { LinearGradient } from 'expo-linear-gradient';

export default function MirrorScreen() {
  const { savedDesign } = useCanvas();
  const router = useRouter();
  const navigation = useNavigation();
  const viewShotRef = useRef<any>(null);

  const avatarUrl = null;

  const renderShape = (shape: any) => {
    const { type, id, style, position, uri } = shape;

    const commonStyle = {
      position: 'absolute',
      left: position.x,
      top: position.y,
      ...style,
    };

    switch (type) {
      case 'rectangle':
        return <View key={id} style={[commonStyle, { borderRadius: 6 }]} />;
      case 'circle':
        return <View key={id} style={[commonStyle, { borderRadius: 999 }]} />;
      case 'image':
        return (
          <Image
            key={id}
            source={{ uri }}
            style={[commonStyle, { resizeMode: 'cover' }]}
          />
        );
      default:
        return null;
    }
  };

  const exportToPng = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('Exported!', 'Design saved to your gallery as PNG.');
      } else {
        Alert.alert('Permission denied', 'Cannot save image without permission.');
      }
    } catch (error) {
  if (error instanceof Error) {
    Alert.alert('Error', 'Failed to export PNG: ' + error.message);
  } else {
    Alert.alert('Error', 'Failed to export PNG: ' + String(error));
  }
}

  };

  return (
    <LinearGradient colors={["#A07BB7", "#F6F2F7"]} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <Ionicons name="menu" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mirror</Text>
            <TouchableOpacity onPress={() => router.push('/settings')}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-circle-outline" size={32} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Canvas Preview Area */}
        <View style={styles.cardShadow}>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }} style={styles.canvasCard}>
            {savedDesign?.length === 0 ? (
              <Text style={styles.empty}>No design saved yet.</Text>
            ) : (
              <View style={styles.designsScrollWrapper}>
                {savedDesign.map(renderShape)}
              </View>
            )}
          </ViewShot>
        </View>

        {/* Mirror Placeholder */}
        <View style={styles.exportButtonWrapper}>
          <TouchableOpacity onPress={exportToPng} style={styles.exportButton} activeOpacity={0.85}>
            <Ionicons name="download-outline" size={24} color="#fff" />
            <Text style={styles.exportText}>Export to PNG</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: StatusBar.currentHeight || 0,
  },
  headerWrapper: {
    paddingHorizontal: 0,
    paddingTop: 0,
    backgroundColor: 'transparent',
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: 'rgba(160,123,183,0.95)',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    resizeMode: 'cover',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardShadow: {
    marginHorizontal: 16,
    marginTop: 32,
    borderRadius: 24,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    backgroundColor: 'transparent',
    flex: 1,
    minHeight: 320,
    maxHeight: '60%',
  },
  canvasCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    minHeight: 320,
    minWidth: 280,
    maxHeight: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    padding: 16,
    width: '100%',
  },
  designsScrollWrapper: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  body: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  illustration: {
    width: 140,
    height: 140,
    marginBottom: 28,
    borderRadius: 24,
    backgroundColor: '#fff',
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6C47A6',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 10,
  },
  empty: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 18,
    color: '#aaa',
  },
  exportButton: {
    marginTop: 8,
    backgroundColor: '#A07BB7',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 16,
    shadowColor: '#A07BB7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  exportText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  exportButtonWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});
