import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
  Position,
  Handle,
  NodeProps,
  EdgeProps,
  BaseEdge,
  getBezierPath,
  EdgeLabelRenderer,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import { Automaton } from '@/lib/automata';

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 60;
const nodeHeight = 60;

const getLayoutedElements = (nodes: any[], edges: any[], direction = 'LR') => {
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    const newNode = {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };

    return newNode;
  });

  return { nodes: newNodes, edges };
};

const AutomatonNode = ({ data, isConnectable }: NodeProps) => {
  return (
    <div className={`flex items-center justify-center w-[60px] h-[60px] rounded-full border-2 bg-card text-foreground shadow-[0_0_20px_rgba(59,130,246,0.2)] ${data.isAccept ? 'border-double border-4 border-accent shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-primary'} ${data.isStart ? 'ring-2 ring-offset-2 ring-offset-background ring-accent' : ''}`}>
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="opacity-0" />
      <div className="text-xs font-mono font-semibold text-center break-all px-1">{data.label}</div>
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="opacity-0" />
    </div>
  );
};

const nodeTypes = {
  automatonNode: AutomatonNode,
};

interface AutomatonGraphProps {
  automaton: Automaton;
}

export function AutomatonGraph({ automaton }: AutomatonGraphProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initialNodes = automaton.states.map((state) => ({
      id: state,
      type: 'automatonNode',
      data: {
        label: state === '∅' ? '∅' : `{${state}}`,
        isStart: state === automaton.startState,
        isAccept: automaton.acceptStates.includes(state),
      },
      position: { x: 0, y: 0 },
    }));

    // Group transitions by source and target to combine symbols
    const groupedTransitions: Record<string, string[]> = {};
    automaton.transitions.forEach((t) => {
      const key = `${t.from}->${t.to}`;
      if (!groupedTransitions[key]) {
        groupedTransitions[key] = [];
      }
      if (!groupedTransitions[key].includes(t.symbol)) {
        groupedTransitions[key].push(t.symbol);
      }
    });

    const initialEdges = Object.entries(groupedTransitions).map(([key, symbols], index) => {
      const [source, target] = key.split('->');
      return {
        id: `e${index}-${source}-${target}`,
        source,
        target,
        label: symbols.join(', '),
        type: 'smoothstep',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: '#94a3b8',
        },
        style: {
          strokeWidth: 2,
          stroke: '#94a3b8',
        },
        labelStyle: { fill: '#f1f5f9', fontWeight: 700, fontSize: 14, fontFamily: "'JetBrains Mono', monospace" },
        labelBgStyle: { fill: '#1e293b', fillOpacity: 0.9, stroke: '#334155', strokeWidth: 1 },
      };
    });

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      initialNodes,
      initialEdges
    );

    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [automaton, setNodes, setEdges]);

  return (
    <div className="w-full h-[400px] border border-border rounded-lg bg-[radial-gradient(circle_at_center,#1e293b_0%,#0f172a_100%)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
      />
    </div>
  );
}
