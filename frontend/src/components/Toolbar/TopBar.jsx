import {
  FiDownload,
  FiTrash2,
  FiSave,
  FiArrowLeft,
  FiCornerUpLeft,
  FiCornerUpRight,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useEditorStore from '../../store/useEditorStore';
import { designService } from '../../services/designService';

const TopBar = ({ designId, history }) => {
  const navigate = useNavigate();
  const { canvas } = useEditorStore();

  const { undo, redo, canUndo, canRedo } = history;

  const deleteSelected = () => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      canvas.discardActiveObject();
      activeObjects.forEach((object) => canvas.remove(object));
    }
  };

  const exportCanvas = () => {
    if (!canvas) return;
    const dataURL = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2,
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'newresolutionstudio-export.png';
    link.click();
  };

  const saveCanvas = async () => {
    if (!canvas) return;

    try {
      const payload = {
        title: 'Newresolutionstudio Project',
        canvasData: canvas.toJSON(),
        thumbnailUrl: canvas.toDataURL({
          format: 'png',
          multiplier: 0.5,
        }),
        user: '661b1a9c1e2f3d4a5b6c7d8e',
      };

      if (designId === 'new') {
        await designService.saveDesign(payload);
        navigate('/');
      } else {
        await designService.updateDesign(designId, payload);
        alert('Design updated!');
      }
    } catch (error) {
      console.error('Save failed', error);
    }
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-800 transition"
        >
          <FiArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-extrabold tracking-tight text-gray-900">
          Newresolutionstudio
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-2 text-gray-600 disabled:opacity-30"
        >
          <FiCornerUpLeft size={20} />
        </button>

        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-2 text-gray-600 disabled:opacity-30"
        >
          <FiCornerUpRight size={20} />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2"></div>

        <button
          onClick={deleteSelected}
          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
        >
          <FiTrash2 size={20} />
        </button>

        <button
          onClick={saveCanvas}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium"
        >
          <FiSave size={18} /> Save
        </button>

        <button
          onClick={exportCanvas}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <FiDownload size={18} /> Export
        </button>
      </div>
    </div>
  );
};

export default TopBar;