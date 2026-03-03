import { useState, useEffect, useRef } from 'react';

export const useCanvasHistory = (canvas) => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isHistoryAction = useRef(false);

  useEffect(() => {
    if (!canvas) return;

    const saveState = () => {
      if (isHistoryAction.current) return;

      const json = canvas.toJSON();

      setHistory((prev) => {
        const updated = prev.slice(0, currentIndex + 1);
        updated.push(json);
        setCurrentIndex(updated.length - 1);
        return updated;
      });
    };

    canvas.on('object:added', saveState);
    canvas.on('object:modified', saveState);
    canvas.on('object:removed', saveState);

    const initial = canvas.toJSON();
    setHistory([initial]);
    setCurrentIndex(0);

    return () => {
      canvas.off('object:added', saveState);
      canvas.off('object:modified', saveState);
      canvas.off('object:removed', saveState);
    };
  }, [canvas]);

  const undo = () => {
    if (currentIndex <= 0) return;

    isHistoryAction.current = true;
    const newIndex = currentIndex - 1;

    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      setCurrentIndex(newIndex);
      isHistoryAction.current = false;
    });
  };

  const redo = () => {
    if (currentIndex >= history.length - 1) return;

    isHistoryAction.current = true;
    const newIndex = currentIndex + 1;

    canvas.loadFromJSON(history[newIndex], () => {
      canvas.renderAll();
      setCurrentIndex(newIndex);
      isHistoryAction.current = false;
    });
  };

  return {
    undo,
    redo,
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
  };
};