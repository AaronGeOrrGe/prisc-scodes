import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { PanGestureHandler, PinchGestureHandler, PinchGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useCanvas } from '../../../context/CanvasContext';
import Canvas from '../../components/Canvas';
import DraggableShape from '../../components/DraggableShape';

export default function CanvasScreen() {
    const router = useRouter();
    const { 
        shapes, 
        setSelectedShapeId, 
        setPreviewLine,
        addShape,
        addLine,
        undo,
        redo,
        deleteToTrash,
        selectedShapeId,
        saveToHistory
    } = useCanvas();

    const [connectMode, setConnectMode] = useState(false);
    const [connectStartShapeId, setConnectStartShapeId] = useState<string | null>(null);

    const panX = useSharedValue(0);
    const panY = useSharedValue(0);
    const scale = useSharedValue(1);

    const onPanEvent = useAnimatedGestureHandler({
        onStart: (_, ctx: { startX: number; startY: number; }) => {
            ctx.startX = panX.value;
            ctx.startY = panY.value;
        },
        onActive: (event, ctx) => {
            panX.value = ctx.startX + event.translationX;
            panY.value = ctx.startY + event.translationY;
        },
    });

    const onPinchEvent = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { baseScale: number; }>({
        onStart: (_, ctx) => {
            ctx.baseScale = scale.value;
        },
        onActive: (event, ctx) => {
            scale.value = ctx.baseScale * event.scale;
        },
    });

    const animatedCanvasStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: panX.value }, { translateY: panY.value }, { scale: scale.value }],
    }));

    const handleLongPress = (params: { id: string; x: number; y: number; }) => {
        console.log('Long press on shape:', params.id);
    };

    const handleAddRectangle = () => {
        addShape({
            id: Date.now().toString(),
            type: 'rectangle',
            position: { x: 150, y: 150 },
            style: { width: 150, height: 100, backgroundColor: '#3498db' },
        });
    };

    const handleAddCircle = () => {
        addShape({
            id: Date.now().toString(),
            type: 'circle',
            position: { x: 200, y: 200 },
            style: { width: 100, height: 100, backgroundColor: '#e74c3c', borderRadius: 50 },
        });
    };
    
    // Handler for shape tap in connect mode
    const handleShapeTap = (shapeId: string) => {
        if (!connectMode) return;
        if (!connectStartShapeId) {
            setConnectStartShapeId(shapeId);
        } else if (connectStartShapeId !== shapeId) {
            addLine({
                id: Date.now().toString(),
                startShapeId: connectStartShapeId,
                endShapeId: shapeId,
            });
            setConnectStartShapeId(null);
            setConnectMode(false);
        }
    };
    
    return (
        <View style={styles.container}>
            <PanGestureHandler onGestureEvent={onPanEvent}>
                <Animated.View style={{ flex: 1 }}>
                    <PinchGestureHandler onGestureEvent={onPinchEvent}>
                        <View style={{ flex: 1, backgroundColor: '#F5F1E9' }}>
                            <Canvas panX={panX} panY={panY} scale={scale} />
                            {shapes.map((shape) => (
                                <DraggableShape
                                    key={shape.id}
                                    shape={shape}
                                    onLongPress={handleLongPress}
                                    setPreviewLine={setPreviewLine}
                                    onTap={handleShapeTap}
                                    connectMode={connectMode}
                                    connectStartShapeId={connectStartShapeId}
                                />
                            ))}
                        </View>
                    </PinchGestureHandler>
                </Animated.View>
            </PanGestureHandler>

            {/* Zoom Controls */}
            <View style={styles.zoomControls}>
                <TouchableOpacity style={styles.zoomButton} onPress={() => { scale.value = withSpring(scale.value + 0.2); }}>
                    <Ionicons name="add" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.zoomButton} onPress={() => { scale.value = withSpring(scale.value - 0.2); }}>
                    <Ionicons name="remove" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Bottom Toolbar */}
            <View style={styles.bottomToolbar}>
                <TouchableOpacity onPress={undo}>
                    <Ionicons name="arrow-undo" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={redo}>
                    <Ionicons name="arrow-redo-sharp" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddRectangle}>
                    <Ionicons name="square-outline" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAddCircle}>
                    <Ionicons name="ellipse-outline" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(drawer)/(tabs)/Templates')}>
                    <Ionicons name="albums-outline" size={28} color="black" />
                </TouchableOpacity>
                {selectedShapeId ? (
                    <TouchableOpacity onPress={() => deleteToTrash(selectedShapeId)}>
                        <Ionicons name="trash-outline" size={28} color="red" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={() => router.push('/(drawer)/trash')}>
                        <Ionicons name="trash-outline" size={28} color="black" />
                    </TouchableOpacity>
                )}
                {/* Connect Button */}
                <TouchableOpacity
                  style={{ backgroundColor: connectMode ? '#A07BB7' : '#fff', borderRadius: 12, padding: 6 }}
                  onPress={() => {
                    setConnectMode((prev) => !prev);
                    setConnectStartShapeId(null);
                  }}
                >
                  <Ionicons name="git-compare-outline" size={28} color={connectMode ? '#fff' : '#A07BB7'} />
                </TouchableOpacity>
                {/* Save Button */}
                <TouchableOpacity onPress={() => saveToHistory(shapes)}>
                    <Ionicons name="save-outline" size={28} color="#00C853" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
    },
    canvasContainer: {
        flex: 1,
    },
    zoomControls: {
        position: 'absolute',
        bottom: 110, // Positioned above the bottom toolbar
        right: 20,
        flexDirection: 'column',
        zIndex: 10,
    },
    zoomButton: {
        width: 48,
        height: 48,
        backgroundColor: '#fff',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 5,
    },
    bottomToolbar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 5,
        zIndex: 10,
    },
});
