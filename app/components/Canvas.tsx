import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Svg, { Line, G, Text as SvgText } from 'react-native-svg';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useCanvas } from '../../context/CanvasContext';
import { ShapeType } from '../../constants/type';
import DraggableShape from './DraggableShape';

const getEdgeIntersection = (shape: ShapeType, otherShape: ShapeType) => {
    const x1 = shape.position.x + (shape.style.width || 0) / 2;
    const y1 = shape.position.y + (shape.style.height || 0) / 2;
    const x2 = otherShape.position.x + (otherShape.style.width || 0) / 2;
    const y2 = otherShape.position.y + (otherShape.style.height || 0) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    if (dx === 0 && dy === 0) return { x: x1, y: y1 };
    const w = (shape.style.width || 0) / 2;
    const h = (shape.style.height || 0) / 2;
    if (w === 0 || h === 0) return { x: x1, y: y1 };
    const t = Math.max(Math.abs(dx) / w, Math.abs(dy) / h);
    return { x: x1 + dx / t, y: y1 + dy / t };
};

const getShapeById = (shapes: ShapeType[], id: string) => shapes.find(shape => shape.id === id);

interface CanvasProps {
  panX?: any;
  panY?: any;
  scale?: any;
}

const Canvas: React.FC<CanvasProps> = ({ panX, panY, scale }) => {
    const { shapes, lines, setSelectedShapeId, previewLine } = useCanvas();
    // Calculate canvas size to fit all shapes
    const maxX = Math.max(500, ...shapes.map(s => s.position.x + (s.style.width || 0)));
    const maxY = Math.max(800, ...shapes.map(s => s.position.y + (s.style.height || 0)));
    const animatedContentStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: panX ? panX.value : 0 },
        { translateY: panY ? panY.value : 0 },
        { scale: scale ? scale.value : 1 },
      ],
    }));
    return (
        <TouchableWithoutFeedback onPress={() => setSelectedShapeId(null)}>
            <View style={[styles.canvasContainer, { minWidth: '100%', minHeight: '100%' }]}> 
                <Animated.View style={animatedContentStyle}>
                  <Svg width={maxX} height={maxY} style={{ position: 'absolute', left: 0, top: 0 }}>
                      <G>
                          {lines.map(line => {
                              const startShape = getShapeById(shapes, line.startShapeId);
                              const endShape = getShapeById(shapes, line.endShapeId);
                              if (!startShape || !endShape) return null;
                              const startPoint = getEdgeIntersection(startShape, endShape);
                              const endPoint = getEdgeIntersection(endShape, startShape);
                              return (
                                  <G key={line.id}>
                                      <Line x1={startPoint.x} y1={startPoint.y} x2={endPoint.x} y2={endPoint.y} stroke="#555" strokeWidth="2" />
                                      {line.label && <SvgText fill="#333" fontSize="12" x={(startPoint.x + endPoint.x) / 2} y={(startPoint.y + endPoint.y) / 2} textAnchor="middle">{line.label}</SvgText>}
                                  </G>
                              );
                          })}
                          {previewLine && <Line x1={previewLine.x1} y1={previewLine.y1} x2={previewLine.x2} y2={previewLine.y2} stroke="#888" strokeWidth="2" strokeDasharray="4 4" />}
                      </G>
                  </Svg>
                </Animated.View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    canvasContainer: {
        flex: 1,
        backgroundColor: '#F5F1E9', // Soft, brownish-cream color
    },
});

export default Canvas;
