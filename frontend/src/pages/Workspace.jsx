import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useEditorStore from '../store/useEditorStore';
import { designService } from '../services/designService';
import Editor from '../components/Canvas/Editor';
import AIGeneratorWidget from '../components/Toolbar/AIGeneratorWidget'; 

const Workspace = () => {
  const { id } = useParams();
  const { canvas } = useEditorStore();

  useEffect(() => {
    const loadDesign = async () => {
      if (canvas && id !== 'new') {
        try {
          const design = await designService.getDesignById(id);
          if (design?.canvasData) {
            await canvas.loadFromJSON(design.canvasData);
            canvas.renderAll();
          }
        } catch (error) {
          console.error('Failed to load design', error);
        }
      }
    };

    loadDesign();
  }, [canvas, id]);

  return (
    
    <div className="h-screen w-full bg-gray-100 relative"> 
      <Editor designId={id} />
      
      
      <AIGeneratorWidget />
    </div>
  );
};

export default Workspace;