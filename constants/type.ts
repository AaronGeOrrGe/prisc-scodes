export interface Position {
  x: number;
  y: number;
}

export interface Style {
  width?: number;
  height?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  rotation?: number;
  borderRadius?: number;
  textDecorationLine?: 'none' | 'underline' | 'line-through' | 'underline line-through';
}

export interface ShapeType {
  id: string;
  type: 'rectangle' | 'circle' | 'oval' | 'image' | 'text' | 'button' | 'diamond' | 'kite' | 'arrow';
  position: Position;
  style: Style;
  isVisible?: boolean;
  isLocked?: boolean;

  
  color?: string;         
  fontSize?: number;      
  fontColor?: string;     
  borderColor?: string;  
  uri?: string;           
  text?: string;          
}

export interface LineType {
  id: string;
  startShapeId: string;
  endShapeId: string;
  label?: string;
}

export interface Template {
  shapes: ShapeType[];
  lines: LineType[];
}
