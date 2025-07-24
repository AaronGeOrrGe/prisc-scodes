import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
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
    const { shapes, lines, setSelectedShapeId, previewLine, updateShape } = useCanvas();
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

    // Modal editing state
    const [editingShapeId, setEditingShapeId] = useState<string | null>(null);
    const [editText, setEditText] = useState('');
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [editTextModal, setEditTextModal] = useState(false);
    const textInputRef = React.useRef<TextInput>(null);

    const handleEditText = (shape: any) => {
      setEditingShapeId(shape.id);
      setEditText(shape.text || '');
      setBold(shape.style?.fontWeight === 'bold');
      setItalic(shape.style?.fontStyle === 'italic');
      setUnderline(shape.style?.textDecorationLine === 'underline');
      setEditTextModal(true);
    };

    const handleSaveText = () => {
      if (!editingShapeId) return;
      updateShape(editingShapeId, {
        text: editText,
        style: {
          fontWeight: bold ? 'bold' : 'normal',
          fontStyle: italic ? 'italic' : 'normal',
          textDecorationLine: underline ? 'underline' : 'none',
        },
      });
      setEditTextModal(false);
      setEditingShapeId(null);
    };

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
                  {/* Render shapes */}
                  {shapes.map(shape => (
                    <DraggableShape
                      key={shape.id}
                      shape={shape}
                      onLongPress={() => {}}
                      setPreviewLine={() => {}}
                      onEditText={handleEditText}
                    />
                  ))}
                </Animated.View>
                {/* Modal at root */}
                <Modal
                  visible={editTextModal}
                  transparent
                  animationType="fade"
                  onRequestClose={() => setEditTextModal(false)}
                >
                  <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Edit Text</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 8 }}>
                        <TouchableOpacity onPress={() => setBold(b => !b)} style={[styles.toolbarBtn, bold && { backgroundColor: '#eee' }]}>
                          <Text style={{ fontWeight: 'bold' }}>B</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setItalic(i => !i)} style={[styles.toolbarBtn, italic && { backgroundColor: '#eee' }]}>
                          <Text style={{ fontStyle: 'italic' }}>I</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setUnderline(u => !u)} style={[styles.toolbarBtn, underline && { backgroundColor: '#eee' }]}>
                          <Text style={{ textDecorationLine: 'underline' }}>U</Text>
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        ref={textInputRef}
                        value={editText}
                        onChangeText={setEditText}
                        style={[styles.textInput, { textAlign: 'center', fontWeight: bold ? 'bold' : 'normal', fontStyle: italic ? 'italic' : 'normal', textDecorationLine: underline ? 'underline' : 'none' }]}
                        autoFocus
                      />
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
                        <TouchableOpacity onPress={() => setEditTextModal(false)} style={styles.cancelBtn}>
                          <Text>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleSaveText}
                          style={styles.saveBtn}
                        >
                          <Text style={{ color: 'white' }}>Save</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    canvasContainer: {
        flex: 1,
        backgroundColor: '#F5F1E9', // Soft, brownish-cream color
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      width: '80%',
      alignItems: 'center',
    },
    toolbarBtn: {
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 5,
      marginHorizontal: 5,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    textInput: {
      width: '100%',
      height: 50,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 10,
      fontSize: 20,
      textAlign: 'center',
    },
    cancelBtn: {
      marginRight: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#eee',
      borderRadius: 8,
    },
    saveBtn: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#007bff',
      borderRadius: 8,
    },
});

export default Canvas;
