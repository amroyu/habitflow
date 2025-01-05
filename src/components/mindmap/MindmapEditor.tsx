import { useCallback, useState, useMemo, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
  NodeChange,
  NodePositionChange,
  XYPosition,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { MindmapNode } from './MindmapNode';
import { MindmapToolbar } from './MindmapToolbar';
import MindmapStylePanel from './MindmapStylePanel';
import { v4 as uuidv4 } from 'uuid';
import { StyleChanges, ColorTheme, BranchWidth, MindMapStyle } from '@/types/mindmap';

const nodeTypes = {
  mindmap: MindmapNode,
};

// Initial balanced layout with 2 branches on each side
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'mindmap',
    data: { 
      label: 'Patience',
      isRoot: true,
      style: {
        background: '#0A0F2C',
        color: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        border: '2px solid #4299E1',
      }
    },
    position: { x: 0, y: 0 },
  },
  // Right side nodes
  {
    id: '2',
    type: 'mindmap',
    data: { 
      label: 'Right Topic 1',
      depth: 1,
      style: {
        background: '#F87171',
        color: '#000000',
        borderRadius: '12px',
        padding: '12px',
      }
    },
    position: { x: 400, y: -120 },
  },
  {
    id: '3',
    type: 'mindmap',
    data: { 
      label: 'Right Topic 2',
      depth: 1,
      style: {
        background: '#F6B676',
        color: '#000000',
        borderRadius: '12px',
        padding: '12px',
      }
    },
    position: { x: 400, y: 120 },
  },
  // Left side nodes
  {
    id: '4',
    type: 'mindmap',
    data: { 
      label: 'Left Topic 1',
      depth: 1,
      style: {
        background: '#FDE047',
        color: '#000000',
        borderRadius: '12px',
        padding: '12px',
      }
    },
    position: { x: -400, y: -120 },
  },
  {
    id: '5',
    type: 'mindmap',
    data: { 
      label: 'Left Topic 2',
      depth: 1,
      style: {
        background: '#4ADE80',
        color: '#000000',
        borderRadius: '12px',
        padding: '12px',
      }
    },
    position: { x: -400, y: 120 },
  },
];

const initialEdges: Edge[] = [
  // Right side edges
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      stroke: '#999', 
      strokeWidth: 1.5,
      strokeDasharray: '5 5'
    },
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    sourceHandle: 'right',
    targetHandle: 'left',
    animated: true,
    style: { 
      stroke: '#999', 
      strokeWidth: 1.5,
      strokeDasharray: '5 5'
    },
  },
  // Left side edges
  {
    id: 'e1-4',
    source: '1',
    target: '4',
    type: 'smoothstep',
    sourceHandle: 'left',
    targetHandle: 'right',
    animated: true,
    style: { 
      stroke: '#999', 
      strokeWidth: 1.5,
      strokeDasharray: '5 5'
    },
  },
  {
    id: 'e1-5',
    source: '1',
    target: '5',
    type: 'smoothstep',
    sourceHandle: 'left',
    targetHandle: 'right',
    animated: true,
    style: { 
      stroke: '#999', 
      strokeWidth: 1.5,
      strokeDasharray: '5 5'
    },
  },
];

interface MindMapData {
  nodes: Node[];
  edges: Edge[];
}

const getNodeStyle = (depth: number) => {
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  return {
    background: colors[depth % colors.length],
    color: '#ffffff',
    borderRadius: '6px',
  };
};

const colorThemes: Record<ColorTheme, string[]> = {
  rainbow: ['#F87171', '#F6B676', '#FDE047', '#4ADE80', '#60A5FA', '#818CF8', '#C084FC'],
  ocean: ['#0EA5E9', '#0284C7', '#0369A1', '#075985', '#0C4A6E'],
  forest: ['#22C55E', '#16A34A', '#15803D', '#166534', '#14532D'],
  sunset: ['#F97316', '#EA580C', '#C2410C', '#9A3412', '#7C2D12'],
  monochrome: ['#1F2937', '#374151', '#4B5563', '#6B7280', '#9CA3AF'],
};

const branchWidths: Record<BranchWidth, number> = {
  default: 2,
  thin: 1,
  medium: 3,
  thick: 4,
};

function MindmapEditorContent() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [style, setStyle] = useState<MindMapStyle>({
    autoBalance: true,
    compactMap: false,
    justifyTopicAlignment: false,
    branchFreePositioning: false,
    flexibleFloatingTopic: false,
    topicOverlap: false,
    colorTheme: 'rainbow',
    backgroundColor: '#ffffff',
    globalFont: 'default',
    branchLineWidth: 'default',
    branchColor: '#1f1f1f',
    cjkFont: 'default'
  });
  const { project, fitView } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [settings, setSettings] = useState({
    colorTheme: 'rainbow' as ColorTheme,
    branchLineWidth: 'default' as BranchWidth,
    autoBalance: false,
    compactMap: false,
    justifyTopicAlignment: false,
    freePositioning: false,
    flexibleFloating: false,
    dragAndDrop: true,
  });
  const [showStylePanel, setShowStylePanel] = useState(true);

  // Add undo/redo history state
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[]; }[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const handleStyleChange = useCallback((changes: StyleChanges) => {
    const mapStyleChanges = changes.mapStyle || {};
    const newStyle = { ...style, ...mapStyleChanges };
    setStyle(newStyle);
    
    // Apply style changes to nodes
    setNodes((nds) => 
      nds.map((node) => {
        let nodeStyle = { ...node.data.style };
        
        // Apply color theme
        if (mapStyleChanges.colorTheme) {
          const colors = getThemeColors(mapStyleChanges.colorTheme);
          nodeStyle.background = node.data.isRoot ? colors[0] : '#ffffff';
          nodeStyle.color = node.data.isRoot ? '#ffffff' : colors[0];
        }
        
        // Apply font changes
        if (mapStyleChanges.globalFont) {
          nodeStyle.fontFamily = getFontFamily(mapStyleChanges.globalFont);
        }
        
        // Apply CJK font changes
        if (mapStyleChanges.cjkFont) {
          nodeStyle.cjkFontFamily = getFontFamily(mapStyleChanges.cjkFont);
        }
        
        return {
          ...node,
          data: {
            ...node.data,
            style: nodeStyle
          },
          position: getNodePosition(node, newStyle)
        };
      })
    );
    
    // Apply style changes to edges
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        style: {
          ...edge.style,
          stroke: mapStyleChanges.branchColor || style.branchColor,
          strokeWidth: getBranchWidth(mapStyleChanges.branchLineWidth || style.branchLineWidth)
        }
      }))
    );
  }, [style]);

  const getThemeColors = (theme: ColorTheme): string[] => {
    switch (theme) {
      case 'rainbow':
        return ['#ff4d4f', '#ffa940', '#fadb14', '#52c41a', '#1890ff', '#722ed1'];
      case 'ocean':
        return ['#13c2c2', '#36cfc9', '#5cdbd3', '#87e8de', '#b5f5ec', '#e6fffb'];
      case 'forest':
        return ['#389e0d', '#52c41a', '#73d13d', '#95de64', '#b7eb8f', '#d9f7be'];
      case 'sunset':
        return ['#d4380d', '#f5222d', '#fa541c', '#fa8c16', '#ffa940', '#ffd666'];
      default:
        return ['#1f1f1f'];
    }
  };

  const getFontFamily = (font: string): string => {
    switch (font) {
      case 'arial':
        return 'Arial, sans-serif';
      case 'times':
        return 'Times New Roman, serif';
      case 'helvetica':
        return 'Helvetica, sans-serif';
      case 'noto-sans':
        return 'Noto Sans CJK, sans-serif';
      case 'source-han':
        return 'Source Han Sans, sans-serif';
      default:
        return 'system-ui, -apple-system, sans-serif';
    }
  };

  const getBranchWidth = (width: BranchWidth): number => {
    switch (width) {
      case 'thin':
        return 1;
      case 'medium':
        return 2;
      case 'thick':
        return 3;
      default:
        return 2;
    }
  };

  const getNodePosition = (node: Node, mapStyle: MindMapStyle): { x: number; y: number } => {
    let position = { ...node.position };

    if (mapStyle.autoBalance) {
      // Implement auto-balance logic
      const level = getNodeLevel(node.id);
      const siblings = getNodeSiblings(node.id);
      const spacing = mapStyle.compactMap ? 100 : 200;
      
      position.x = level * spacing;
      position.y = siblings.indexOf(node.id) * spacing;
    }

    if (mapStyle.justifyTopicAlignment) {
      // Align nodes at the same level
      const level = getNodeLevel(node.id);
      const levelNodes = nodes.filter(n => getNodeLevel(n.id) === level);
      const avgY = levelNodes.reduce((sum, n) => sum + n.position.y, 0) / levelNodes.length;
      position.y = avgY;
    }

    return position;
  };

  const getNodeLevel = (nodeId: string): number => {
    // Calculate node's level in the tree
    const path = edges.filter(e => e.target === nodeId);
    return path.length;
  };

  const getNodeSiblings = (nodeId: string): string[] => {
    // Get all nodes that share the same parent
    const parentEdge = edges.find(e => e.target === nodeId);
    if (!parentEdge) return [];
    return edges
      .filter(e => e.source === parentEdge.source)
      .map(e => e.target);
  };

  const handleInsert = useCallback((sourceId: string, side: 'left' | 'right') => {
    const parentNode = nodes.find(n => n.id === sourceId);
    if (!parentNode) return;

    const newNodeId = uuidv4();
    
    // Constants for layout
    const horizontalSpacing = 400;
    const verticalSpacing = 120;

    // Get siblings on the same side and from the same parent
    const siblingEdges = edges.filter(e => 
      e.source === sourceId && 
      e.sourceHandle === side
    );
    const siblings = siblingEdges
      .map(edge => nodes.find(n => n.id === edge.target))
      .filter((n): n is Node => n !== undefined)
      .sort((a, b) => a.position.y - b.position.y);

    // Calculate new node position
    let newY;
    if (siblings.length === 0) {
      // First child - place above the parent
      newY = parentNode.position.y - verticalSpacing;
    } else {
      // Place below the last sibling
      const lastSibling = siblings[siblings.length - 1];
      newY = lastSibling.position.y + verticalSpacing;

      // If this is the second node, adjust first node's position up
      if (siblings.length === 1) {
        const firstSibling = siblings[0];
        setNodes(nds => nds.map(n => 
          n.id === firstSibling.id 
            ? { ...n, position: { ...n.position, y: parentNode.position.y - verticalSpacing } }
            : n
        ));
        newY = parentNode.position.y + verticalSpacing;
      }
    }

    // Create new node with exact styling
    const newNode: Node = {
      id: newNodeId,
      type: 'mindmap',
      data: { 
        label: 'New Topic',
        depth: (parentNode.data?.depth ?? 0) + 1,
        style: {
          ...getNodeStyle((parentNode.data?.depth ?? 0) + 1),
          padding: '12px',
        }
      },
      position: {
        x: parentNode.position.x + (side === 'right' ? horizontalSpacing : -horizontalSpacing),
        y: newY
      },
    };

    // Create new edge with exact styling
    const newEdge: Edge = {
      id: `${sourceId}-${newNodeId}`,
      source: sourceId,
      target: newNodeId,
      sourceHandle: side,
      targetHandle: side === 'right' ? 'left' : 'right',
      type: 'smoothstep',
      animated: true,
      style: { 
        stroke: '#999', 
        strokeWidth: 1.5,
        strokeDasharray: '5 5'
      },
    };

    setNodes(prev => [...prev, newNode]);
    setEdges(prev => [...prev, newEdge]);

  }, [nodes, edges]);

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const onNodeClick = useCallback((event: React.MouseEvent, clickedNode: Node) => {
    const targetElement = event.target as HTMLElement;
    const button = targetElement.closest('button[data-side]');
    
    if (button) {
      event.stopPropagation(); 
      const side = button.getAttribute('data-side') as 'left' | 'right';
      const nodeId = button.getAttribute('data-node-id') || clickedNode.id;
      
      handleInsert(nodeId, side);
    } else {
      setSelectedNode(clickedNode);
    }
  }, [handleInsert, setSelectedNode]);

  const addChildNode = useCallback(
    (parentNode: Node) => {
      const newNodeId = uuidv4();
      const { x, y } = { x: parentNode.position.x + 300, y: parentNode.position.y + 100 };
      
      const newNode: Node = {
        id: newNodeId,
        type: 'mindmap',
        position: { x, y },
        data: {
          label: 'New Topic',
          style: {
            background: '#E2E8F0',
            color: '#1a1b26',
            borderRadius: '12px',
          },
        },
      };

      const newEdge: Edge = {
        id: `e${parentNode.id}-${newNodeId}`,
        source: parentNode.id,
        target: newNodeId,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: '#999', 
          strokeWidth: 2,
          strokeDasharray: '5 5'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#999',
        },
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
    },
    [setNodes, setEdges]
  );

  const deleteNode = useCallback(
    (nodeToDelete: Node) => {
      if (!nodeToDelete.data.isRoot) {
        setNodes((nds) => nds.filter((node) => node.id !== nodeToDelete.id));
        setEdges((eds) =>
          eds.filter(
            (edge) =>
              edge.source !== nodeToDelete.id && edge.target !== nodeToDelete.id
          )
        );
      }
    },
    [setNodes, setEdges]
  );

  const createFloatingNode = useCallback((label: string) => {
    const position = project({ x: 0, y: 0 });
    const id = uuidv4();
    setNodes((nds) => [
      ...nds,
      {
        id,
        type: 'mindmap',
        position,
        data: {
          label,
          isRoot: false,
          style: {
            background: '#60A5FA',
            border: 'none',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          },
        },
      },
    ]);
  }, [project, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'smoothstep' }, eds)),
    [setEdges]
  );

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    const nodeMovements = changes.filter(change => 
      change.type === 'position' && change.dragging
    ) as NodePositionChange[];

    if (nodeMovements.length > 0) {
      setNodes(nds => {
        let newNodes = [...nds];
        nodeMovements.forEach(change => {
          const draggedNode = newNodes.find(n => n.id === change.id);
          if (!draggedNode || !change.position) return;

          // Calculate the movement delta
          const deltaX = change.position.x - draggedNode.position.x;
          const deltaY = change.position.y - draggedNode.position.y;

          // Function to recursively move a node and all its descendants
          const moveNodeAndDescendants = (nodeId: string, deltaX: number, deltaY: number) => {
            const node = newNodes.find(n => n.id === nodeId);
            if (!node) return;

            // Move the current node
            const nodeIndex = newNodes.findIndex(n => n.id === nodeId);
            if (nodeIndex !== -1) {
              newNodes[nodeIndex] = {
                ...node,
                position: {
                  x: node.position.x + deltaX,
                  y: node.position.y + deltaY
                }
              };
            }

            // Find and move all children
            const childEdges = edges.filter(e => e.source === nodeId);
            childEdges.forEach(edge => {
              moveNodeAndDescendants(edge.target, deltaX, deltaY);
            });
          };

          // Move the dragged node and all its descendants
          moveNodeAndDescendants(change.id, deltaX, deltaY);
        });
        return newNodes;
      });
    } else {
      setNodes(nds => applyNodeChanges(changes, nds));
    }
  }, [edges]);

  const onEdgesChange = useCallback((changes: any) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, [setEdges]);

  const defaultEdgeOptions = useMemo(() => ({
    type: 'step',
    style: { 
      strokeWidth: 2,
      stroke: '#94a3b8',
    },
  }), []);

  // Add this function to help determine node side
  const getNodeSide = useCallback((nodeId: string): 'left' | 'right' | null => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;

    // Find the edge that connects this node to its parent
    const parentEdge = edges.find(e => e.target === nodeId);
    if (!parentEdge) return null;

    return parentEdge.sourceHandle as 'left' | 'right';
  }, [nodes, edges]);

  // Save state to history when changes occur
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      setHistory(prev => {
        const newHistory = prev.slice(0, currentHistoryIndex + 1);
        return [...newHistory, { nodes: nodes, edges: edges }];
      });
      setCurrentHistoryIndex(prev => prev + 1);
    }
  }, [nodes, edges]);

  const handleUndo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      const prevState = history[currentHistoryIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setCurrentHistoryIndex(prev => prev - 1);
    }
  }, [currentHistoryIndex, history]);

  const handleRedo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      const nextState = history[currentHistoryIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setCurrentHistoryIndex(prev => prev + 1);
    }
  }, [currentHistoryIndex, history]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'z') {
        if (event.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        <MindmapToolbar 
          onInsert={() => handleInsert('1', 'right')} 
          onSettings={() => setShowStylePanel(!showStylePanel)} 
          onUndo={handleUndo} 
          onRedo={handleRedo} 
          canUndo={currentHistoryIndex > 0} 
          canRedo={currentHistoryIndex < history.length - 1} 
        />
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={handlePaneClick}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            style={{
              background: style.backgroundColor
            }}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
      {showStylePanel && <MindmapStylePanel style={style} onStyleChange={handleStyleChange} />}
    </div>
  );
}

export default function MindmapEditor() {
  return (
    <ReactFlowProvider>
      <MindmapEditorContent />
    </ReactFlowProvider>
  );
}
