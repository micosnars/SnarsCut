import React, { useRef, useEffect, useState } from 'react';
import { EditorState } from '../types';

interface CanvasEditorProps {
  processedImageSrc: string;
  editorState: EditorState;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({ 
  processedImageSrc, 
  editorState,
  onCanvasReady 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [subjectImgElement, setSubjectImgElement] = useState<HTMLImageElement | null>(null);
  const [bgImgElement, setBgImgElement] = useState<HTMLImageElement | null>(null);

  // Load the subject image (the processed transparent PNG)
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = processedImageSrc;
    img.onload = () => {
      setSubjectImgElement(img);
    };
  }, [processedImageSrc]);

  // Load the background image if mode is 'image'
  useEffect(() => {
    if (editorState.mode === 'image' && editorState.backgroundImageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = editorState.backgroundImageSrc;
      img.onload = () => {
        setBgImgElement(img);
      };
    } else {
      setBgImgElement(null);
    }
  }, [editorState.mode, editorState.backgroundImageSrc]);

  // Draw to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !subjectImgElement) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match the subject image
    // In a real app we might want fixed dimensions, but matching source is easiest for high quality download
    canvas.width = subjectImgElement.naturalWidth;
    canvas.height = subjectImgElement.naturalHeight;

    // 1. Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Background
    if (editorState.mode === 'color') {
      ctx.fillStyle = editorState.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (editorState.mode === 'image' && bgImgElement) {
      // Draw background image effectively "covering" the canvas (like object-fit: cover)
      const scale = Math.max(
        canvas.width / bgImgElement.naturalWidth,
        canvas.height / bgImgElement.naturalHeight
      );
      const x = (canvas.width / 2) - (bgImgElement.naturalWidth / 2) * scale;
      const y = (canvas.height / 2) - (bgImgElement.naturalHeight / 2) * scale;
      ctx.drawImage(
        bgImgElement, 
        x, y, 
        bgImgElement.naturalWidth * scale, 
        bgImgElement.naturalHeight * scale
      );
    }
    // Note: If mode is 'transparent', we do nothing to the canvas context, 
    // keeping it transparent. The 'checkerboard' visual is handled by the parent div CSS.

    // 3. Draw Subject
    ctx.drawImage(subjectImgElement, 0, 0);

    onCanvasReady(canvas);

  }, [subjectImgElement, bgImgElement, editorState, onCanvasReady]);

  // Conditional class to show checkerboard ONLY when in transparent mode
  const containerBackgroundClass = editorState.mode === 'transparent'
    ? "bg-[url('https://media.istockphoto.com/id/1136536978/vector/seamless-pattern-transparency-grid-simulation-transparent-background-seamless-illustration.jpg?s=612x612&w=0&k=20&c=i3gTHdK0-W23t4F2qE2H8JueeWfJm8wb0BYJq3zQ2jQ=')] bg-contain"
    : "bg-transparent";

  return (
    <div className={`w-full h-full flex items-center justify-center overflow-hidden rounded-lg transition-all duration-300 ${containerBackgroundClass}`}>
      <canvas 
        ref={canvasRef} 
        className="max-w-full max-h-[60vh] object-contain shadow-2xl"
      />
    </div>
  );
};