
export interface HandlePosition {
  id: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  style: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

export function calculateOptimalHandlePosition(
  sourcePos: { x: number; y: number },
  targetPos: { x: number; y: number },
  isSource: boolean = true
): HandlePosition {
  const deltaX = targetPos.x - sourcePos.x;
  const deltaY = targetPos.y - sourcePos.y;
  
  // Calculate angle in radians
  const angle = Math.atan2(deltaY, deltaX);
  
  // Convert to degrees for easier calculation
  const degrees = (angle * 180) / Math.PI;
  
  // Normalize to 0-360
  const normalizedDegrees = degrees < 0 ? degrees + 360 : degrees;
  
  // Determine the best handle position based on angle
  let position: HandlePosition['position'];
  let style: HandlePosition['style'] = {};
  
  if (normalizedDegrees >= 337.5 || normalizedDegrees < 22.5) {
    // Right
    position = 'right';
    style = { right: '-4px', top: '50%' };
  } else if (normalizedDegrees >= 22.5 && normalizedDegrees < 67.5) {
    // Bottom-right
    position = 'bottom-right';
    style = { right: '25%', bottom: '-4px' };
  } else if (normalizedDegrees >= 67.5 && normalizedDegrees < 112.5) {
    // Bottom
    position = 'bottom';
    style = { bottom: '-4px', left: '50%' };
  } else if (normalizedDegrees >= 112.5 && normalizedDegrees < 157.5) {
    // Bottom-left
    position = 'bottom-left';
    style = { left: '25%', bottom: '-4px' };
  } else if (normalizedDegrees >= 157.5 && normalizedDegrees < 202.5) {
    // Left
    position = 'left';
    style = { left: '-4px', top: '50%' };
  } else if (normalizedDegrees >= 202.5 && normalizedDegrees < 247.5) {
    // Top-left
    position = 'top-left';
    style = { left: '25%', top: '-4px' };
  } else if (normalizedDegrees >= 247.5 && normalizedDegrees < 292.5) {
    // Top
    position = 'top';
    style = { top: '-4px', left: '50%' };
  } else {
    // Top-right
    position = 'top-right';
    style = { right: '25%', top: '-4px' };
  }
  
  const handleId = `${position}-${isSource ? 'source' : 'target'}`;
  
  return {
    id: handleId,
    position,
    style
  };
}

export function calculateNodeHandles(
  nodeId: string,
  nodePos: { x: number; y: number },
  connections: Array<{ nodeId: string; pos: { x: number; y: number }; isSource: boolean }>
): HandlePosition[] {
  const handles: HandlePosition[] = [];
  
  connections.forEach((connection, index) => {
    const handle = calculateOptimalHandlePosition(nodePos, connection.pos, connection.isSource);
    // Make handle ID unique for this specific connection
    handle.id = `${handle.position}-${connection.nodeId}-${index}`;
    handles.push(handle);
  });
  
  return handles;
}
