import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import '@xyflow/react/dist/style.css';
import {useDebouncedCallback} from '../hooks/useDebouncedCallback';
import { EmptyTriage } from '../components/EmptyTriage';

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type OnNodesChange,
  applyNodeChanges,
  type OnEdgesChange,
  applyEdgeChanges,
  type OnConnect,
  BackgroundVariant,
 type DefaultEdgeOptions,
  MarkerType,
} from '@xyflow/react';
import { CustomNodeTypes, StepTypes } from '../types';
import { TriageStep } from '../components/TriageStep/components/TriageStep';
import { TriageOption } from '../components/TraigeOption/TriageOption';
import { getTriage, saveTriage } from '../service';
 
const nodeTypes = {
     triageStep: TriageStep,
     triageOption: TriageOption
}
 
export default function App() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [saveChanges, setSaveChanges] = useState(false);
  const [lastUpdateAt, setLastUpdateAt] = useState<number | null>(null);

  const connectionLineStyle = {
    strokeWidth: 3,
    stroke: 'black',
  };

    const defaultEdgeOptions: DefaultEdgeOptions = {
        markerEnd: {
          color: 'black',
          type:MarkerType.ArrowClosed
        },
        style: {
          strokeWidth: 2,
          stroke: 'black'
        },
        zIndex:1,
        animated: true
        
    };

const onNodesChange : OnNodesChange<Node> = useCallback(
    // making sepoerate func to give UI feedback that changes are begin applied and saved to the db
    (changes) => {
        setNodes((nodes:Node[]) => applyNodeChanges(changes, nodes));
        setSaveChanges(true);
        setLastUpdateAt(performance.now());
    }, []
);

const onEdgesChange: OnEdgesChange<Edge> = useCallback(
    (changes) => {
        setEdges((edges:Edge[]) => applyEdgeChanges(changes, edges));
        setSaveChanges(true);
        setLastUpdateAt(performance.now());
    }, []
);

  const createRootNode = useCallback(() => {
    setNodes([{
      id: crypto.randomUUID(),
      type: CustomNodeTypes.TriageStep,
      position: {x: 100, y:100},
      data: {value:"", isRoot: true, stepType:StepTypes.Step}
    }]);
  },[]);

  const onConnect: OnConnect = useCallback(

    (params) =>{ 
      setEdges((eds) => addEdge(params, eds)),
      setSaveChanges(true),
      setLastUpdateAt(performance.now())}, [setEdges], 
  );

  useDebouncedCallback(async () => {
    if(!lastUpdateAt) return; // update hi nahi hua hai
    // now agar update hua hai recently
    await saveTriage(nodes,edges)
     setSaveChanges(false);

  },[lastUpdateAt],3000);

  useEffect(() => {
    (async () => {
      const {nodes, edges} = await getTriage();
      setNodes(nodes)
      setEdges(edges)
    })();
  },[]);

  if(!nodes.length){
    return <EmptyTriage onClick={createRootNode}/>
  }
 
  return (
    <>
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        connectionLineStyle={connectionLineStyle}
       defaultEdgeOptions={defaultEdgeOptions}
      >
        <Controls />     
        <MiniMap />
        <Background variant={BackgroundVariant.Cross}/>
      </ReactFlow>
    </div>
    <div className={clsx(
      'absolute top-[78px] left-2 p-2 rounded-lg test-sm z-10',
        saveChanges ? 'bg-black text-white' : 'bg-white text-black'
    )}>
      {saveChanges ? '⏳ Saving Changes' : '✅ Changes Saved!'}
    </div>
    </>
  );
}