import { useEffect, useRef } from 'react';
import * as fabric from 'fabric';
import useEditorStore from '../../store/useEditorStore';
import { useCanvasHistory } from '../../hooks/useCanvasHistory';
import TopBar from "../Toolbar/TopBar";
import SidePanel from "../Toolbar/SidePanel";

const Editor = ({ designId }) => {
  const canvasRef = useRef(null);
  const { canvas, setCanvas } = useEditorStore();

  // 🎨 Initialize Fabric Canvas
  useEffect(() => {
    const initCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: '#ffffff',
      preserveObjectStacking: true,
    });

    setCanvas(initCanvas);

    return () => {
      initCanvas.dispose();
      setCanvas(null);
    };
  }, [setCanvas]);

  // 🔥 HISTORY IS CREATED HERE (ONLY ONCE)
  const history = useCanvasHistory(canvas);

  return (
    <div className="flex flex-col h-screen">
      <TopBar designId={designId} history={history} />

      <div className="flex flex-1">
        <SidePanel />

        <div className="flex-1 flex justify-center items-center bg-gray-100">
          <div className="shadow-2xl border border-gray-300 bg-white">
            <canvas ref={canvasRef} id="canvas" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;