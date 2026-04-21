import React, { useEffect, useMemo } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
  type NodeProps,
  type Edge,
  type Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import dagre from 'dagre';
import type { NFA, DFAStateInfo, DFATransitionInfo } from '../types';

const NODE_W = 70;
const NODE_H = 70;

function layoutNodes(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: 'LR', nodesep: 60, ranksep: 80 });
  g.setDefaultEdgeLabel(() => ({}));
  nodes.forEach(n => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach(e => g.setEdge(e.source, e.target));
  dagre.layout(g);
  return nodes.map(n => {
    const pos = g.node(n.id);
    return { ...n, position: { x: pos.x - NODE_W / 2, y: pos.y - NODE_H / 2 } };
  });
}

const AutomatonNode: React.FC<NodeProps> = ({ data }) => {
  const highlighted = data.highlighted as boolean;
  const hColor = (data.highlightColor as string) || '#3b82f6';
  const isAccept = data.isAccept as boolean;
  const isStart = data.isStart as boolean;
  const isNew = data.isNew as boolean;
  const label = data.label as string;

  return (
    <div
      style={{
        width: NODE_W,
        height: NODE_H,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: highlighted ? `${hColor}25` : '#1e293b',
        border: isAccept
          ? `3px double ${highlighted ? hColor : '#94a3b8'}`
          : `2px solid ${highlighted ? hColor : '#334155'}`,
        boxShadow: highlighted
          ? `0 0 18px ${hColor}60`
          : isNew
          ? '0 0 18px #10b98160'
          : 'none',
        outline: isStart ? `2px solid ${highlighted ? hColor : '#10b981'}` : 'none',
        outlineOffset: '4px',
        transition: 'all 0.35s ease',
        cursor: 'default',
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <span
        style={{
          fontSize: label.length > 6 ? '8px' : '11px',
          fontFamily: 'monospace',
          fontWeight: 'bold',
          color: highlighted ? hColor : '#f1f5f9',
          textAlign: 'center',
          padding: '2px',
          wordBreak: 'break-all',
          lineHeight: 1.2,
        }}
      >
        {label}
      </span>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};

const nodeTypes = { automatonNode: AutomatonNode };

interface NFAGraphProps {
  nfa: NFA;
  highlightStates: Array<{ state: string; color: string }>;
  highlightTransitions: string[];
}

export const NFAGraph: React.FC<NFAGraphProps> = ({ nfa, highlightStates, highlightTransitions }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const rawNodes: Node[] = useMemo(() => nfa.states.map(state => {
    const hl = highlightStates.find(h => h.state === state);
    return {
      id: state,
      type: 'automatonNode',
      data: {
        label: state,
        highlighted: !!hl,
        highlightColor: hl?.color ?? '#3b82f6',
        isAccept: nfa.acceptStates.includes(state),
        isStart: state === nfa.startState,
        isNew: false,
      },
      position: { x: 0, y: 0 },
    };
  }), [nfa, highlightStates]);

  const rawEdges: Edge[] = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    nfa.transitions.forEach(t => {
      const key = `${t.from}__${t.to}`;
      if (!grouped[key]) grouped[key] = [];
      if (!grouped[key].includes(t.symbol)) grouped[key].push(t.symbol);
    });
    return Object.entries(grouped).map(([key, symbols], i) => {
      const [source, target] = key.split('__');
      const isHighlighted = nfa.transitions
        .filter(t => t.from === source && t.to === target)
        .some(t => highlightTransitions.includes(t.id));
      return {
        id: `e${i}`,
        source,
        target,
        label: symbols.join(', '),
        type: source === target ? 'selfConnecting' : 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: isHighlighted ? '#FF9800' : '#64748b' },
        style: {
          stroke: isHighlighted ? '#FF9800' : '#475569',
          strokeWidth: isHighlighted ? 2.5 : 1.5,
          transition: 'all 0.3s ease',
        },
        labelStyle: { fill: '#f1f5f9', fontSize: 12, fontFamily: 'monospace', fontWeight: 700 },
        labelBgStyle: { fill: '#1e293b', fillOpacity: 0.9, stroke: '#334155', strokeWidth: 1 },
      };
    });
  }, [nfa, highlightTransitions]);

  useEffect(() => {
    const laid = layoutNodes(rawNodes, rawEdges);
    setNodes(laid);
    setEdges(rawEdges);
  }, [rawNodes, rawEdges, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      />
    </div>
  );
};

interface DFAGraphProps {
  dfaStates: DFAStateInfo[];
  dfaTransitions: DFATransitionInfo[];
}

export const DFAGraph: React.FC<DFAGraphProps> = ({ dfaStates, dfaTransitions }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const rawNodes: Node[] = useMemo(() => dfaStates.map(s => ({
    id: s.id,
    type: 'automatonNode',
    data: {
      label: s.displayName,
      highlighted: s.isActive || s.isNew || s.isTarget,
      highlightColor: s.isNew ? '#10b981' : s.isActive ? '#3b82f6' : '#9c27b0',
      isAccept: s.isAccept,
      isStart: s.isStart,
      isNew: s.isNew,
    },
    position: { x: 0, y: 0 },
  })), [dfaStates]);

  const rawEdges: Edge[] = useMemo(() => {
    const grouped: Record<string, { symbols: string[]; isNew: boolean }> = {};
    dfaTransitions.forEach(t => {
      const fromState = dfaStates.find(s => s.displayName === t.from);
      const toState = dfaStates.find(s => s.displayName === t.to);
      if (!fromState || !toState) return;
      const key = `${fromState.id}__${toState.id}`;
      if (!grouped[key]) grouped[key] = { symbols: [], isNew: false };
      if (!grouped[key].symbols.includes(t.symbol)) grouped[key].symbols.push(t.symbol);
      if (t.isNew) grouped[key].isNew = true;
    });
    return Object.entries(grouped).map(([key, { symbols, isNew }], i) => {
      const [source, target] = key.split('__');
      return {
        id: `de${i}`,
        source,
        target,
        label: symbols.join(', '),
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed, color: isNew ? '#10b981' : '#64748b' },
        style: {
          stroke: isNew ? '#10b981' : '#475569',
          strokeWidth: isNew ? 2.5 : 1.5,
          transition: 'all 0.3s ease',
        },
        labelStyle: { fill: '#f1f5f9', fontSize: 12, fontFamily: 'monospace', fontWeight: 700 },
        labelBgStyle: { fill: '#1e293b', fillOpacity: 0.9, stroke: '#334155', strokeWidth: 1 },
      };
    });
  }, [dfaStates, dfaTransitions]);

  useEffect(() => {
    if (rawNodes.length === 0) return;
    const laid = layoutNodes(rawNodes, rawEdges);
    setNodes(laid);
    setEdges(rawEdges);
  }, [rawNodes, rawEdges, setNodes, setEdges]);

  if (dfaStates.length === 0) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 14 }}>
        DFA states will appear here...
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      />
    </div>
  );
};