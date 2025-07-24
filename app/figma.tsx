import { GestureResponderEvent, Pressable, View, StyleSheet } from 'react-native';
import React, { useContext } from 'react';
import { useCanvas } from '../context/CanvasContext';

export default function Canvas({
  selectedShape,
}: {
  selectedShape: 'rectangle' | 'circle' | null;
}) {
  const { addShape } = useCanvas();

  const handlePress = (event: GestureResponderEvent) => {
    if (!selectedShape) return;

    const { locationX, locationY } = event.nativeEvent;

    // Step 1: Only include known properties for ShapeType.
    // Step 2: Use a nested position object if required by ShapeType.
    addShape({
      type: selectedShape,
      position: {
        x: locationX,
        y: locationY,
      },
      id: '',
      style: {} // Fix: Provide an empty object instead of undefined to satisfy the Style type
    });
  };

  const styles = StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  return (
    <View style={styles.overlay} />
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
