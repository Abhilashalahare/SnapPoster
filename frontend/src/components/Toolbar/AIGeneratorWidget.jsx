import React, { useState } from 'react';
import useEditorStore from '../../store/useEditorStore';
import api from '../../api/axios'; 
import * as fabric from 'fabric';

const AIGeneratorWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { canvas } = useEditorStore();

  const handleAIGenerate = async () => {
    if (!prompt || !canvas) return;
    setIsGenerating(true);
    
    try {
      const response = await api.post('/ai/generate', { prompt });
      const fabricJSON = response.data;
      
      canvas.clear();
      canvas.backgroundColor = fabricJSON.background || '#ffffff';

      if (fabricJSON.objects && Array.isArray(fabricJSON.objects)) {
        fabricJSON.objects.forEach((item) => {
          let calcLeft = Number(item.left) || 0;
          let calcTop = Number(item.top) || 0;
          let calcWidth = Number(item.width) || 200;
          let calcHeight = Number(item.height) || 100;
          
          if (calcLeft === 400) calcLeft = canvas.width / 2;
          if (calcTop === 300) calcTop = canvas.height / 2;

          if (item.type === 'rect' && calcWidth >= 790 && calcHeight >= 590) {
            calcWidth = canvas.width; calcHeight = canvas.height;
            calcLeft = canvas.width / 2; calcTop = canvas.height / 2;
            item.originX = 'center'; item.originY = 'center';
          }

          const baseOptions = {
            left: calcLeft, top: calcTop,
            fill: item.fill || '#000000',
            originX: item.originX || 'left', originY: item.originY || 'top',
            scaleX: Number(item.scaleX) || 1, scaleY: Number(item.scaleY) || 1,
            angle: Number(item.angle) || 0,
            opacity: item.opacity !== undefined ? Number(item.opacity) : 1
          };

          if (item.type === 'rect') {
            canvas.add(new fabric.Rect({ ...baseOptions, width: calcWidth, height: calcHeight, rx: Number(item.rx) || 0, ry: Number(item.ry) || 0 }));
          } else if (item.type === 'circle') {
            canvas.add(new fabric.Circle({ ...baseOptions, radius: Number(item.radius) || 50 }));
          } else if (item.type === 'i-text' || item.type === 'text') {
            canvas.add(new fabric.IText(item.text || 'Text', {
              ...baseOptions,
              fontSize: Number(item.fontSize) || 40,
              fontFamily: item.fontFamily || 'Arial',
              fontWeight: item.fontWeight || 'normal',
              textAlign: item.textAlign || (item.originX === 'center' ? 'center' : 'left'),
              lineHeight: Number(item.lineHeight) || 1.16
            }));
          }
        });
      }

      canvas.renderAll();
      canvas.fire('object:modified');
      setIsOpen(false); 
      
    } catch (error) {
      console.error('AI Generation failed', error);
      alert('AI Generation failed. Check backend logs.');
    } finally {
      setIsGenerating(false);
      setPrompt('');
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end">
      
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl border border-purple-100 p-4 mb-4 w-80 transform transition-all duration-300 origin-bottom-right">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-purple-700 uppercase tracking-widest flex items-center gap-1">
              ✨ AI Magic
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your layout (e.g., A neon cyber tech meetup poster...)"
            className="w-full text-sm p-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-gray-50"
            rows="3"
            autoFocus
          />
          
          <button 
            onClick={handleAIGenerate}
            disabled={isGenerating || !prompt}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-2.5 rounded-xl transition shadow-md flex justify-center items-center gap-2"
          >
            {isGenerating ? (
              <>Generating... <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></>
            ) : (
              'Generate Layout ✨'
            )}
          </button>
        </div>
      )}

     
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 flex items-center justify-center group"
          title="AI Magic Generator"
        >
          <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default AIGeneratorWidget;