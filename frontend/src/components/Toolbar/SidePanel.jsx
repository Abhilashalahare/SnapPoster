import { useState } from 'react';
import * as fabric from 'fabric'; 
import useEditorStore from '../../store/useEditorStore';
import api from '../../api/axios';
import { FiType, FiSquare, FiCircle, FiImage, FiZap } from 'react-icons/fi';

const SidePanel = () => {
  const { canvas } = useEditorStore();
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!canvas) return <div className="w-20 lg:w-64 bg-white border-r p-4">Loading...</div>;

  // --- STANDARD TOOLS ---
  const addText = () => {
    const text = new fabric.IText('Edit Text', {
      left: 100, top: 100, fontFamily: 'Arial', fontSize: 32, fill: '#111827',
    });
    canvas.add(text);
    canvas.setActiveObject(text);
  };

  const addShape = (type) => {
    const options = { left: 150, top: 150, fill: '#3b82f6' };
    const shape = type === 'rect' 
      ? new fabric.Rect({ ...options, width: 150, height: 100, rx: 10, ry: 10 })
      : new fabric.Circle({ ...options, radius: 60, fill: '#ef4444' });
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
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const imageUrl = response.data.url;
      console.log("Success! Cloudinary URL:", imageUrl);

      // THE FABRIC.JS V6 FIX: Use 'await' instead of a callback function!
      const img = await fabric.Image.fromURL(imageUrl, { 
        crossOrigin: 'anonymous' 
      });

      // Add the loaded image to the canvas
      img.scaleToWidth(300);
      canvas.add(img);
      canvas.centerObject(img);
      canvas.setActiveObject(img);
      
      // Tell canvas to redraw and save history
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
  };

  // --- AI TOOL ---
const handleAIGenerate = async () => {
    if (!aiPrompt || !canvas) return;
    setIsGenerating(true);
    
    try {
      const response = await api.post('/ai/generate', { prompt: aiPrompt });
      const fabricJSON = response.data;
      
      console.log("AI Generated Canvas Data:", fabricJSON);

      // 1. Clear the canvas and set the background
      canvas.clear();
      canvas.backgroundColor = fabricJSON.background || '#ffffff';

      // 2. The Smart Parser: Now with Origin and Scaling support!
      // 2. The Smart Parser: Now with Math-Powered Perfect Alignment!
      if (fabricJSON.objects && Array.isArray(fabricJSON.objects)) {
        fabricJSON.objects.forEach((item) => {
          
          // Step A: Read the AI's dimensions
          let calcLeft = Number(item.left) || 0;
          let calcTop = Number(item.top) || 0;
          let calcWidth = Number(item.width) || 200;
          let calcHeight = Number(item.height) || 100;
          
          // Step B: The Magic Center Hack
          // If the AI says '400' (half of 800), it means it wants perfect horizontal centering.
          if (calcLeft === 400) {
            calcLeft = canvas.width / 2;
          }
          // If the AI says '300' (half of 600), it means it wants perfect vertical centering.
          if (calcTop === 300) {
            calcTop = canvas.height / 2;
          }

          // Step C: The Background Fix
          // If the AI generated a full-size rectangle, stretch it to fit YOUR actual canvas
          if (item.type === 'rect' && calcWidth >= 790 && calcHeight >= 590) {
            calcWidth = canvas.width;
            calcHeight = canvas.height;
            calcLeft = canvas.width / 2;
            calcTop = canvas.height / 2;
            item.originX = 'center';
            item.originY = 'center';
          }

          const baseOptions = {
            left: calcLeft,
            top: calcTop,
            fill: item.fill || '#000000',
            originX: item.originX || 'left', 
            originY: item.originY || 'top',
            scaleX: Number(item.scaleX) || 1,
            scaleY: Number(item.scaleY) || 1,
            angle: Number(item.angle) || 0,
            opacity: item.opacity !== undefined ? Number(item.opacity) : 1
          };

          if (item.type === 'rect') {
            const rect = new fabric.Rect({
              ...baseOptions,
              width: calcWidth,
              height: calcHeight,
              rx: Number(item.rx) || 0,
              ry: Number(item.ry) || 0
            });
            canvas.add(rect);
          } 
          
          else if (item.type === 'circle') {
            const circle = new fabric.Circle({
              ...baseOptions,
              radius: Number(item.radius) || 50
            });
            canvas.add(circle);
          } 
          
          else if (item.type === 'i-text' || item.type === 'text') {
            const text = new fabric.IText(item.text || 'Generated Text', {
              ...baseOptions,
              fontSize: Number(item.fontSize) || 40,
              fontFamily: item.fontFamily || 'Arial',
              fontWeight: item.fontWeight || 'normal',
              // Force multi-line text to balance itself perfectly
              textAlign: item.textAlign || (item.originX === 'center' ? 'center' : 'left'),
              lineHeight: Number(item.lineHeight) || 1.16
            });
            canvas.add(text);
          }
        });
      }

      // 3. Tell the canvas to redraw and save to history
      canvas.renderAll();
      canvas.fire('object:modified');
      
    } catch (error) {
      console.error('AI Generation failed', error);
      alert('AI Generation failed. Check backend console logs.');
    } finally {
      setIsGenerating(false);
      setAiPrompt('');
    }
  };

  // --- THE FULL RETURN RENDER ---
  return (
    <div className="w-20 lg:w-64 bg-white border-r border-gray-200 flex flex-col p-4 gap-4 overflow-y-auto">
      <h2 className="hidden lg:block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Design Tools</h2>
      
      {/* 1. Core Tools */}
      <button onClick={addText} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition">
        <FiType size={22} className="text-blue-600" /> <span className="hidden lg:block font-medium">Text</span>
      </button>

      <button onClick={() => addShape('rect')} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition">
        <FiSquare size={22} className="text-blue-600" /> <span className="hidden lg:block font-medium">Rectangle</span>
      </button>

      <button onClick={() => addShape('circle')} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition">
        <FiCircle size={22} className="text-blue-600" /> <span className="hidden lg:block font-medium">Circle</span>
      </button>

      <label className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg text-gray-700 transition cursor-pointer">
        <FiImage size={22} className="text-blue-600" /> <span className="hidden lg:block font-medium">Upload Image</span>
        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
      </label>

      {/* 2. AI Magic Generator Section */}
      <div className="hidden lg:block mt-4 border-t pt-4">
        <h3 className="text-xs font-bold text-purple-500 uppercase tracking-widest mb-2 flex items-center gap-1">
          <FiZap /> AI Magic
        </h3>
        <textarea
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="e.g., A dark neon cyber tech meetup poster..."
          className="w-full text-sm p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-purple-500 resize-none"
          rows="3"
        />
        <button 
          onClick={handleAIGenerate}
          disabled={isGenerating || !aiPrompt}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2 rounded-lg transition shadow-sm"
        >
          {isGenerating ? 'Generating...' : 'Generate Layout'}
        </button>
      </div>

      {/* 3. Canvas Background Color Section */}
      <div className="hidden lg:block mt-4 border-t pt-4">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Canvas Color</h3>
        <div className="flex gap-2">
          {['#ffffff', '#111827', '#fef08a', '#bfdbfe'].map((color) => (
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
  );
};

export default SidePanel;