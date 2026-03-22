import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Pulse",
    artist: "SynthWave AI",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/neon1/400/400"
  },
  {
    id: 2,
    title: "Cyber Drift",
    artist: "Rhythm Bot",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/neon2/400/400"
  },
  {
    id: 3,
    title: "Digital Horizon",
    artist: "Neural Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/neon3/400/400"
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress || 0);
    }
  };

  const handleTrackEnd = () => {
    skipForward();
  };

  const skipForward = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const skipBackward = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black/60 backdrop-blur-xl rounded-3xl border border-white/10 p-6 shadow-2xl flex flex-col gap-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-neon-pink/30 shadow-[0_0_15px_rgba(255,0,102,0.3)]">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentTrack.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </AnimatePresence>
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 20, 8] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-1 bg-neon-cyan rounded-full"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-white font-bold text-lg truncate tracking-tight">{currentTrack.title}</h3>
          <p className="text-neon-cyan/80 text-sm font-mono truncate uppercase tracking-widest">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.2 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-tighter">
          <span>0:00</span>
          <span>3:45</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        <button
          onClick={skipBackward}
          className="text-white/60 hover:text-neon-cyan transition-colors"
        >
          <SkipBack size={24} />
        </button>

        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={skipForward}
          className="text-white/60 hover:text-neon-cyan transition-colors"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
        <Volume2 size={16} className="text-white/40" />
        <div className="flex-1 h-1 bg-white/10 rounded-full">
          <div className="w-2/3 h-full bg-white/20 rounded-full" />
        </div>
      </div>
    </div>
  );
};
