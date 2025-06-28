// components/MultimediaModal.jsx
import React, { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = { CLIP: 'clip' };

function DraggableClip({ clip, index, moveClip, updateDuration, zoom }) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemTypes.CLIP,
    hover(item) {
      if (item.index !== index) {
        moveClip(item.index, index);
        item.index = index;
      }
    },
  });
  const [, drag] = useDrag({
    type: ItemTypes.CLIP,
    item: { index },
  });
  drag(drop(ref));

  const handleResize = (e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startDuration = clip.duration || 5;
    const onMouseMove = (e) => {
      const delta = e.clientX - startX;
      const newDuration = Math.max(1, startDuration + Math.floor(delta / zoom));
      updateDuration(index, newDuration);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const times = Math.floor((clip.duration || 5) / 5);

  return (
    <div
      ref={ref}
      className={`rounded text-xs text-white flex items-center justify-start cursor-move select-none ${
        clip.type === 'image'
          ? 'bg-purple-600'
          : clip.type === 'audio'
          ? 'bg-green-600'
          : 'bg-blue-600'
      }`}
      style={{
        width: `${(clip.duration || 5) * zoom}px`,
        marginLeft: 4,
        height: '70%',
      }}
      title={`${clip.type.charAt(0).toUpperCase() + clip.type.slice(1)} - ${
        clip.duration || 5
      }s`}
    >
      {clip.type === 'image' ? (
        <div className="flex h-full">
          {Array.from({ length: times }).map((_, idx) => (
            <img
              key={idx}
              src={clip.url}
              className="h-full w-8 object-cover"
              alt="thumb"
            />
          ))}
        </div>
      ) : clip.type === 'audio' ? (
        <span className="px-2">🔊 Audio</span>
      ) : (
        <span className="px-2">🎬 Video</span>
      )}
      <div
        onMouseDown={handleResize}
        className="w-2 h-full bg-white opacity-80 cursor-ew-resize ml-auto"
      />
    </div>
  );
}

function MultimediaModal({ isOpen, onClose, device }) {
  const [clips, setClips] = useState([]);
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const videoRef = useRef(null);
  const [timelineWidth, setTimelineWidth] = useState(window.innerWidth - 100);
  const [zoom, setZoom] = useState(10);
  const [playhead, setPlayhead] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const playheadRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const onResize = () => setTimelineWidth(window.innerWidth - 100);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }
  }, []);

  useEffect(() => {
    if (device?.multimedia) {
      setClips(device.multimedia.map((item) => ({ ...item, duration: 5 })));
      setSelectedIndex(0);
      setPlayhead(0);
    } else {
      setClips([]);
      setSelectedIndex(0);
      setPlayhead(0);
    }
  }, [device]);

  // Actualiza playhead cada segundo si está reproduciendo
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayhead((prev) => {
        const total = clips.reduce(
          (acc, clip) => acc + (clip.duration || 5),
          0
        );
        return prev < total ? prev + 1 : 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [clips, isPlaying]);

  // Sincroniza preview con playhead
  useEffect(() => {
    let acc = 0;
    let foundIndex = 0;
    for (let i = 0; i < clips.length; i++) {
      acc += clips[i].duration || 5;
      if (playhead < acc) {
        foundIndex = i;
        break;
      }
    }
    setSelectedIndex(foundIndex);

    // Si es video, sincroniza el tiempo del video
    const currentClip = clips[foundIndex];
    if (videoRef.current && currentClip?.type === 'video') {
      const clipStart = acc - (currentClip.duration || 5);
      const currentTime = playhead - clipStart;
      if (!isNaN(currentTime)) {
        videoRef.current.currentTime = currentTime;
        if (isPlaying) videoRef.current.play();
        else videoRef.current.pause();
      }
    }
  }, [playhead, clips, isPlaying]);

  const handleFiles = (files) => {
    const newClips = [];
    for (let file of files) {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith('image')
        ? 'image'
        : file.type.startsWith('video')
        ? 'video'
        : file.type.startsWith('audio')
        ? 'audio'
        : null;
      if (!type) continue;
      newClips.push({ url, type, file, duration: 5 });
    }
    setClips((c) => [...c, ...newClips]);
    if (newClips.length > 0) setSelectedIndex(clips.length);
  };

  const moveClip = (from, to) => {
    const updated = [...clips];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setClips(updated);
  };

  const updateDuration = (index, newDuration) => {
    setClips((prev) => {
      const updated = [...prev];
      updated[index].duration = newDuration;
      return updated;
    });
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const openFileDialog = () => fileInputRef.current?.click();
  const currentClip = clips[selectedIndex];
  const totalDuration = clips.reduce(
    (acc, clip) => acc + (clip.duration || 5),
    0
  );

  const togglePlay = () => setIsPlaying((prev) => !prev);
  const resetPlayhead = () => setPlayhead(0);
  const seek = (seconds) => {
    setPlayhead((prev) => {
      let newTime = prev + seconds;
      if (newTime < 0) newTime = 0;
      const total = clips.reduce((acc, clip) => acc + (clip.duration || 5), 0);
      if (newTime > total) newTime = total;
      return newTime;
    });
  };

  // Render ticks / números de tiempo arriba del timeline
  const renderTimeTicks = () => {
    const ticks = [];
    for (let i = 0; i <= totalDuration; i += 5) {
      ticks.push(
        <div
          key={i}
          className="absolute text-xs text-gray-400 select-none"
          style={{
            left: i * zoom - 10,
            top: 0,
            width: 20,
            textAlign: 'center',
          }}
        >
          {i}s
        </div>
      );
    }
    return ticks;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <DndProvider backend={HTML5Backend}>
        <div className="bg-gray-900 text-white rounded-lg shadow-lg max-w-6xl mx-auto max-h-[95vh] overflow-y-auto flex flex-col p-6 space-y-6">
          <div className="flex space-x-6">
            <div className="w-1/4 h-full bg-gray-800 rounded-md p-3 overflow-y-auto border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Media Bin</h3>
              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`grid grid-cols-2 gap-2 p-2 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? 'border-blue-400 bg-blue-900/40'
                    : 'border-gray-600'
                }`}
                onClick={openFileDialog}
              >
                {clips.map((clip, i) => (
                  <div
                    key={i}
                    className={`relative w-full aspect-video bg-black overflow-hidden rounded-md border-4 cursor-pointer ${
                      i === selectedIndex
                        ? 'border-blue-500'
                        : 'border-transparent'
                    }`}
                    onClick={() => setSelectedIndex(i)}
                  >
                    {clip.type === 'image' ? (
                      <img
                        src={clip.url}
                        alt={`Clip ${i + 1}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <video
                        src={clip.url}
                        muted
                        preload="metadata"
                        className="object-cover w-full h-full"
                      />
                    )}
                  </div>
                ))}
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,audio/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
              <h2 className="text-2xl text-gray-300 font-semibold mb-2">
                Preview
              </h2>
              <div className="w-full max-w-4xl bg-black rounded-md overflow-hidden shadow-lg max-h-[40vh]">
                {currentClip?.type === 'image' ? (
                  <img
                    src={currentClip.url}
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                ) : currentClip?.type === 'audio' ? (
                  <audio
                    ref={videoRef}
                    src={currentClip.url}
                    controls
                    autoPlay={isPlaying}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={currentClip?.url}
                    className="w-full h-full"
                    controls
                  />
                )}
              </div>
            </div>
          </div>

          <div className="w-full flex items-center space-x-4 px-4">
            <button
              onClick={() => seek(-5)}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              title="Retroceder 5 segundos"
            >
              ⏪ -5s
            </button>
            <button
              onClick={togglePlay}
              className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
              title={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isPlaying ? '⏸️ Pausa' : '▶️ Reproducir'}
            </button>
            <button
              onClick={() => seek(5)}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
              title="Avanzar 5 segundos"
            >
              ⏩ +5s
            </button>
            <button
              onClick={resetPlayhead}
              className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
              title="Reiniciar reproducción"
            >
              🔄 Reiniciar
            </button>
            <label htmlFor="zoom" className="text-sm text-gray-400 ml-auto">
              Zoom:
            </label>
            <input
              id="zoom"
              type="range"
              min="5"
              max="40"
              step="1"
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <span className="text-sm text-gray-400">{zoom}px/s</span>
          </div>

          {/* Timeline */}
          <div className="w-full overflow-x-auto">
            <div
              className="bg-gray-800 rounded-md p-3 border border-gray-700 relative mx-auto"
              style={{ width: '90%' }}
              onClick={(e) => {
                // Permitir click para mover playhead
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const time = Math.floor(clickX / zoom);
                setPlayhead(time);
              }}
            >
              {/* Time ticks */}
              <div className="relative h-6 border-b border-gray-600">
                {renderTimeTicks()}
              </div>

              {/* Playhead line */}
              <div
                className="absolute top-6 left-0 h-14 border-l-2 border-red-500 z-10"
                style={{ left: `${playhead * zoom}px` }}
              />

              {/* Imágenes y videos */}
              <div className="text-gray-300 mb-1 font-semibold mt-2">
                Imágenes & Videos
              </div>
              <div className="relative h-14 bg-gray-700 rounded flex items-center mb-4">
                {clips
                  .map((clip, i) => ({ ...clip, index: i }))
                  .filter((clip) => clip.type !== 'audio')
                  .map((clip) => (
                    <DraggableClip
                      key={clip.index}
                      index={clip.index}
                      clip={clip}
                      moveClip={moveClip}
                      updateDuration={updateDuration}
                      zoom={zoom}
                    />
                  ))}
              </div>

              {/* Audios */}
              <div className="text-gray-300 mb-1 font-semibold">Audios</div>
              <div className="relative h-14 bg-gray-700 rounded flex items-center">
                {clips
                  .map((clip, i) => ({ ...clip, index: i }))
                  .filter((clip) => clip.type === 'audio')
                  .map((clip) => (
                    <DraggableClip
                      key={clip.index}
                      index={clip.index}
                      clip={clip}
                      moveClip={moveClip}
                      updateDuration={updateDuration}
                      zoom={zoom}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </DndProvider>
    </Modal>
  );
}

export default MultimediaModal;
