import React from 'react';
import { useNavigate } from 'react-router-dom';
import useEditorStore from '../../store/useEditorStore';
import useAuthStore from '../../store/useAuthStore';
import { designService } from '../../services/designService';
import { useCanvasHistory } from '../../hooks/useCanvasHistory'; // Your new hook!

const TopBar = ({ designId }) => {
  const navigate = useNavigate();
  const { canvas } = useEditorStore();
  const { user, logout } = useAuthStore();
  

  const { undo, redo, canUndo, canRedo } = useCanvasHistory(canvas);

  const handleSave = async () => {

    if (!user) {
      alert("Please log in or create an account to save your designs to the gallery!");
      navigate('/auth');
      return;
    }

    if (!canvas) return;

    try {
    
      const canvasData = canvas.toJSON();
      const thumbnailUrl = canvas.toDataURL({ format: 'png', quality: 0.8 });
      const payload = { title: "SnapPoster Project", canvasData, thumbnailUrl };

      if (designId && designId !== 'new') {
        await designService.updateDesign(designId, payload);
      } else {
        const newDesign = await designService.createDesign(payload);
      
        navigate(`/design/${newDesign._id}`, { replace: true }); 
      }
      alert("Poster saved successfully!");
    } catch (error) {
      console.error("Save Error:", error);
      alert("Failed to save. Check console.");
    }
  };

  const handleExport = () => {
    
    if (!canvas) return;
    
   
    const dataURL = canvas.toDataURL({ format: 'png', multiplier: 2 });
    
  
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'SnapPoster-Poster.png';
    link.click();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 relative">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="hover:bg-gray-100 p-2 rounded-lg transition">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">SnapPoster</h1>
      </div>

      <div className="flex items-center gap-3">

        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mr-4">
          <button 
            onClick={undo} 
            disabled={!canUndo}
            className={`p-2 transition ${canUndo ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300 cursor-not-allowed'}`}
            title="Undo"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </button>
          <div className="w-px h-6 bg-gray-200"></div>
          <button 
            onClick={redo} 
            disabled={!canRedo}
            className={`p-2 transition ${canRedo ? 'text-gray-700 hover:bg-gray-200' : 'text-gray-300 cursor-not-allowed'}`}
            title="Redo"
          >
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
            </svg>
          </button>
        </div>

      
        <button 
          onClick={handleExport}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
        >
          Export PNG
        </button>

       
        <button 
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition"
        >
          Save
        </button>

        <div className="w-px h-8 bg-gray-200 mx-2"></div>

       
        {user ? (
          <button 
            onClick={handleLogout}
            className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 py-2 px-3 rounded-lg transition"
          >
            Logout
          </button>
        ) : (
          <button 
            onClick={() => navigate('/auth')}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 px-3 rounded-lg transition"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;