import { useState, useEffect } from 'react';
import * as fabric from 'fabric'; 
import useEditorStore from '../../store/useEditorStore';
import api from '../../api/axios';
import { FiType, FiSquare, FiCircle, FiImage, FiTrash2 } from 'react-icons/fi';

const SidePanel = () => {
  const { canvas } = useEditorStore();
  const [activeObject, setActiveObject] = useState(null);

 
  useEffect(() => {
    if (!canvas) return;

    const updateSelected = () => {
      const activeObj = canvas.getActiveObject();
      setActiveObject(activeObj ? activeObj : null);
    };

    canvas.on('selection:created', updateSelected);
    canvas.on('selection:updated', updateSelected);
    canvas.on('selection:cleared', updateSelected);
    canvas.on('object:modified', updateSelected);

    return () => {
      canvas.off('selection:created', updateSelected);
      canvas.off('selection:updated', updateSelected);
      canvas.off('selection:cleared', updateSelected);
      canvas.off('object:modified', updateSelected);
    };
  }, [canvas]);

  if (!canvas) return <div className="w-20 lg:w-64 bg-white border-r p-4">Loading...</div>;

 
  const addText = () => {
    const text = new fabric.IText('Edit Text', {
      left: canvas.width / 2, 
      top: canvas.height / 2, 
      fontFamily: 'Arial', 
      fontSize: 40, 
      fill: '#111827',
      originX: 'center',
      originY: 'center',
      textAlign: 'center'
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const addShape = (type) => {
    const options = { 
      left: canvas.width / 2, 
      top: canvas.height / 2, 
      fill: 'transparent', 
      stroke: '#000000',   
      strokeWidth: 4,      
      originX: 'center', 
      originY: 'center' 
    };
    
    const shape = type === 'rect' 
      ? new fabric.Rect({ ...options, width: 150, height: 100, rx: 8, ry: 8 })
      : new fabric.Circle({ ...options, radius: 60 });
      
    canvas.add(shape);
    canvas.setActiveObject(shape);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const imageUrl = response.data.url;
      const img = await fabric.Image.fromURL(imageUrl, { crossOrigin: 'anonymous' });

      img.scaleToWidth(300);
      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
      
      canvas.renderAll();
      canvas.fire('object:modified');
    } catch (error) {
      console.error('Upload Error:', error);
      alert('Upload failed. Check console.');
    }
  };
  
  const changeBackgroundColor = (color) => {
    canvas.backgroundColor = color;
    canvas.renderAll();
    canvas.fire('object:modified');
  };

  
  const updateActiveObject = (property, value) => {
    if (!activeObject || !canvas) return;
    
    activeObject.set(property, value);
    canvas.renderAll();
    canvas.fire('object:modified'); 
    setActiveObject(canvas.getActiveObject()); 
  };


  return (
    <div className="w-20 lg:w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10">
      
    
      <div className="flex-1 overflow-y-auto p-4 gap-4 flex flex-col">
        <h2 className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Design Tools</h2>
        
        
        <button onClick={addText} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition border border-transparent hover:border-gray-200">
          <FiType size={22} className="text-blue-600" /> <span className="hidden lg:block font-medium">Add Text</span>
        </button>

        <button onClick={() => addShape('rect')} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition border border-transparent hover:border-gray-200">
          <FiSquare size={22} className="text-blue-600" /> <span className="hidden lg:block font-medium">Rectangle</span>
        </button>

        <button onClick={() => addShape('circle')} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition border border-transparent hover:border-gray-200">
          <FiCircle size={22} className="text-blue-600" /> <span className="hidden lg:block font-medium">Circle</span>
        </button>

        <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition cursor-pointer border border-transparent hover:border-gray-200">
          <FiImage size={22} className="text-blue-600" /> <span className="hidden lg:block font-medium">Upload Image</span>
          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
        </label>

        
        <div className="hidden lg:block mt-4 border-t pt-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Canvas Background</h3>
          <div className="flex flex-wrap gap-2">
            {['#ffffff', '#111827', '#fef08a', '#bfdbfe', '#fecaca', '#bbf7d0'].map((color) => (
              <button 
                key={color} 
                onClick={() => changeBackgroundColor(color)} 
                className="w-8 h-8 rounded-full border border-gray-300 shadow-sm transition hover:scale-110" 
                style={{ backgroundColor: color }} 
                title={`Change background to ${color}`}
              />
            ))}
          </div>
        </div>
      </div>

  
      {activeObject && (
        <div className="hidden lg:block p-5 bg-blue-50/50 border-t border-blue-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Edit {activeObject.type === 'i-text' ? 'Text' : 'Shape'}
            </h3>
            <button 
              onClick={() => {
                canvas.remove(activeObject);
                canvas.discardActiveObject();
                canvas.renderAll();
                canvas.fire('object:modified');
              }}
              className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition"
              title="Delete Object"
            >
              <FiTrash2 size={16} />
            </button>
          </div>

       
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Fill Color (Inside)</label>
            <div className="flex items-center gap-2">
              <input 
                type="color" 
                value={activeObject.fill !== 'transparent' ? activeObject.fill : '#ffffff'} 
                onChange={(e) => updateActiveObject('fill', e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border-0 p-0"
              />
              <button 
                onClick={() => updateActiveObject('fill', 'transparent')}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Make Transparent
              </button>
            </div>
          </div>

          
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Border Color</label>
            <input 
              type="color" 
              value={activeObject.stroke || '#000000'} 
              onChange={(e) => {
                updateActiveObject('stroke', e.target.value);
                if (!activeObject.strokeWidth) updateActiveObject('strokeWidth', 4);
              }}
              className="w-full h-8 rounded cursor-pointer border-0 p-0"
            />
          </div>

          
          {activeObject.type === 'i-text' && (
            <>
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
                <select 
                  value={activeObject.fontFamily || 'Arial'}
                  onChange={(e) => updateActiveObject('fontFamily', e.target.value)}
                  className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Impact">Impact</option>
                </select>
              </div>

              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Font Size: {Math.round(activeObject.fontSize || 40)}
                </label>
                <input 
                  type="range" min="10" max="150" 
                  value={activeObject.fontSize || 40} 
                  onChange={(e) => updateActiveObject('fontSize', parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>
              
              <div className="mb-2 mt-4">
                <label className="block text-xs font-medium text-gray-600 mb-2">Alignment</label>
                <div className="flex bg-white rounded-lg border border-gray-300 overflow-hidden">
                  {['left', 'center', 'right'].map((align) => (
                    <button
                      key={align}
                      onClick={() => updateActiveObject('textAlign', align)}
                      className={`flex-1 py-1.5 text-xs font-semibold uppercase ${activeObject.textAlign === align ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SidePanel;