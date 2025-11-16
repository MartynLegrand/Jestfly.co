import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { initialCanvasState, CanvasState } from '@/types/canvas';
import { Canvas } from '@/components/canvas/Canvas';
import { Toolbar } from '@/components/canvas/toolbar';
import { Timeline } from '@/components/canvas/Timeline';
import { ProjectInfo } from '@/components/canvas/toolbar';
import { useToast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { CanvasNode } from '@/types/canvas';

const CareerCanvas = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { toast } = useToast();
  const { user } = useAuth();

  const [canvasState, setCanvasState] = useState<CanvasState>(initialCanvasState);
  const [showTimeline, setShowTimeline] = useState(true);
  const [timelineNodes, setTimelineNodes] = useState<CanvasNode[]>([]);
  const [project, setProject] = useState({ title: 'Loading...', description: '' });

  useEffect(() => {
    if (projectId) {
      loadCanvasState(projectId);
    } else {
      console.warn("No projectId found in URL, creating a new project.");
      createNewProject();
    }
  }, [projectId]);

  const loadCanvasState = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('canvas_projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setCanvasState(JSON.parse(data.canvas_state));
        setTimelineNodes(JSON.parse(data.canvas_state).nodes);
        setProject({ title: data.title, description: data.description });
      } else {
        console.log("Project not found, creating a new one.");
        createNewProject();
      }
    } catch (error: any) {
      toast({
        title: "Error loading project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createNewProject = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to create a project",
        variant: "destructive",
      });
      return;
    }

    const newProjectId = uuidv4();
    try {
      const { error } = await supabase
        .from('canvas_projects')
        .insert([
          {
            id: newProjectId,
            title: 'New Career Canvas',
            description: 'A new career planning canvas',
            canvas_state: JSON.stringify(initialCanvasState),
            user_id: user.id,
          },
        ]);

      if (error) {
        throw error;
      }

      window.history.replaceState(null, '', `/canvas/${newProjectId}`);
      setCanvasState(initialCanvasState);
      setTimelineNodes(initialCanvasState.nodes);
      setProject({ title: 'New Career Canvas', description: 'A new career planning canvas' });

      toast({
        title: "New project created",
        description: "A new career canvas has been created.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const saveCanvasState = async () => {
    if (!projectId) {
      toast({
        title: "No project ID",
        description: "Project ID is missing. Cannot save.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('canvas_projects')
        .update({
          canvas_state: JSON.stringify(canvasState),
          title: project.title,
          description: project.description,
        })
        .eq('id', projectId);

      if (error) {
        throw error;
      }

      toast({
        title: "Canvas saved",
        description: "Your career canvas has been saved.",
      });
    } catch (error: any) {
      toast({
        title: "Error saving canvas",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addNode = (type: string) => {
    const newNode = {
      id: uuidv4(),
      type: type,
      position: { x: 200, y: 200 },
      data: { label: `${type} node` },
    };

    setCanvasState(prevState => ({
      ...prevState,
      nodes: [...prevState.nodes, newNode],
    }));

    setTimelineNodes(prevNodes => [...prevNodes, newNode]);
  };

  const onNodesChange = (changes: any) => {
    setCanvasState(prevState => {
      return {
        ...prevState,
        nodes: changes.reduce((acc: any, change: any) => {
          if (change.type === 'position') {
            return acc.map((node: any) =>
              node.id === change.id
                ? { ...node, position: change.position }
                : node
            );
          } else if (change.type === 'remove') {
            return acc.filter((node: any) => node.id !== change.id);
          }
          return acc;
        }, prevState.nodes),
      };
    });

    setTimelineNodes(prevNodes => {
      return changes.reduce((acc: any, change: any) => {
        if (change.type === 'position') {
          return acc.map((node: any) =>
            node.id === change.id
              ? { ...node, position: change.position }
              : node
          );
        } else if (change.type === 'remove') {
          return acc.filter((node: any) => node.id !== change.id);
        }
        return acc;
      }, prevNodes);
    });
  };

  const onEdgesChange = (changes: any) => {
    setCanvasState(prevState => ({
      ...prevState,
      edges: changes.reduce((acc: any, change: any) => {
        if (change.type === 'add') {
          return [...acc, change.item];
        } else if (change.type === 'remove') {
          return acc.filter((edge: any) => edge.id !== change.id);
        }
        return acc;
      }, prevState.edges),
    }));
  };

  const toggleTimeline = () => {
    setShowTimeline(!showTimeline);
  };

  const updateProjectInfo = (newInfo: { title: string; description: string }) => {
    setProject(newInfo);
  };

  const onConnect = (params: any) => {
    setCanvasState(prevState => ({
      ...prevState,
      edges: [...prevState.edges, { ...params, id: `edge-${params.source}-${params.target}` }],
    }));
  };

  const selectNodeOnCanvas = (nodeId: string) => {
    setCanvasState(prevState => ({
      ...prevState,
      selectedNodeId: nodeId,
    }));
  };

  const selectNodeOnTimeline = (nodeId: string) => {
    setCanvasState(prevState => ({
      ...prevState,
      selectedNodeId: nodeId,
    }));
  };

  return (
    <div className="flex flex-col h-screen">
      <Toolbar
        onAddNode={addNode}
        onSave={saveCanvasState}
        onToggleTimeline={toggleTimeline}
        showTimeline={showTimeline}
        project={project}
        onUpdateProjectInfo={updateProjectInfo}
      />

      <div className="flex flex-1">
        <div className="flex-1 relative">
          <Canvas
            nodes={canvasState.nodes}
            edges={canvasState.edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={selectNodeOnCanvas}
            selectedNodeId={canvasState.selectedNodeId || ''}
          />
        </div>

        {showTimeline && (
          <div className="w-80 border-l p-4">
            <Timeline
              nodes={timelineNodes}
              selectedNodeId={canvasState.selectedNodeId || ''}
              onNodeSelect={selectNodeOnTimeline}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerCanvas;
