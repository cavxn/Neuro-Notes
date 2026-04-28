"use client";

import { useEffect, useState } from 'react';
import ReactFlow, { Background, Controls, Node, Edge, Position } from 'reactflow';
import 'reactflow/dist/style.css';
import { fetchGraph, GraphData, GraphNode, GraphEdge } from '@/lib/api';

const processNodesAndEdges = (nodes: GraphNode[], edges: GraphEdge[]) => {
  const radius = 250;
  
  // Create a rudimentary circular layout for demonstration.
  // Real-world use cases should parse this into a directed graph layout engine like `dagre`.
  const layoutedNodes: Node[] = nodes.map((n, i) => {
    const angle = (i / Math.max(nodes.length, 1)) * 2 * Math.PI;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return {
      id: n.id,
      position: { x: x + 400, y: y + 300 },
      data: { label: n.label },
      style: {
        background: n.group === 'note' ? '#4f46e5' : '#8b5cf6', // indigo vs violet
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '12px',
        padding: '12px',
        fontWeight: '600',
        fontSize: '12px',
        width: 160,
        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };
  });

  const layoutedEdges: Edge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: true,
    style: { stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2 },
    labelStyle: { fill: '#a1a1aa', fontWeight: 'bold' }
  }));

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  useEffect(() => {
    fetchGraph().then((data: GraphData) => {
      const { nodes: parsedNodes, edges: parsedEdges } = processNodesAndEdges(data.nodes, data.edges);
      setNodes(parsedNodes);
      setEdges(parsedEdges);
    }).catch((e: Error) => console.error(e));
  }, []);

  return (
    <div className="w-full h-[600px] bg-zinc-950/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/5 relative shadow-2xl">
      <div className="absolute top-4 left-6 z-10 pointer-events-none">
        <h3 className="text-xl font-bold text-white/90">Cognitive Web</h3>
        <p className="text-xs text-white/50">Nodes connected via Concept extraction</p>
      </div>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Background gap={16} size={1} color="rgba(255,255,255,0.1)" />
        <Controls className="bg-zinc-800 border-white/10" />
      </ReactFlow>
    </div>
  );
}
