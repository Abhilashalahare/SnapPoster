import { useState, useEffect, useRef, useCallback } from 'react';

export const useCanvasHistory = (canvas) => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isHistoryAction = useRef(false);
  const saveTimeout = useRef(null);

  const saveState = useCallback(() => {
    if (!canvas || isHistoryAction.current) return;

    
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      const json = canvas.toJSON();
      setHistory((prev) => {
        
        const currentStack = prev.slice(0, currentIndex + 1);
        const newStack = [...currentStack, json];
        setCurrentIndex(newStack.length - 1);
        return newStack;
      });
    }, 150);
  }, [canvas, currentIndex]);

  useEffect(() => {
    if (!canvas) return;

    
    canvas.on('object:modified', saveState);
    canvas.on('object:added', saveState);
    canvas.on('object:removed', saveState);

    
    if (history.length === 0) saveState();

    return () => {
      canvas.off('object:modified', saveState);
      canvas.off('object:added', saveState);
      canvas.off('object:removed', saveState);
    };
  }, [canvas, saveState]);

  const undo = async () => {
    if (currentIndex > 0 && canvas) {
      isHistoryAction.current = true;
      const prevIndex = currentIndex - 1;
      await canvas.loadFromJSON(history[prevIndex]);
      canvas.renderAll();
      setCurrentIndex(prevIndex);
      isHistoryAction.current = false;
    }
  };

  const redo = async () => {
    if (currentIndex < history.length - 1 && canvas) {
      isHistoryAction.current = true;
      const nextIndex = currentIndex + 1;
      await canvas.loadFromJSON(history[nextIndex]);
      canvas.renderAll();
      setCurrentIndex(nextIndex);
      isHistoryAction.current = false;
    }
  };

  return { undo, redo, canUndo: currentIndex > 0, canRedo: currentIndex < history.length - 1 };
};