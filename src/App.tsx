/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-8">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,102,255,0.05)_0%,transparent_70%)]" />

      {/* Main Container */}
      <div className="z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12">
        
        {/* Left Side: Music Player */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/3 flex flex-col gap-6"
        >
          <div className="space-y-2">
            <h2 className="text-neon-cyan font-mono text-xs uppercase tracking-[0.3em]">Now Playing</h2>
            <h1 className="text-4xl font-bold text-white tracking-tight">RHYTHM <span className="text-neon-pink">STATION</span></h1>
          </div>
          <MusicPlayer />
          
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-sm">
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest leading-relaxed">
              Experience the fusion of retro gaming and synthwave beats. 
              Play snake to the rhythm of AI-generated melodies.
            </p>
          </div>
        </motion.div>

        {/* Center: Snake Game */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-neon-cyan/5 blur-2xl rounded-3xl" />
          <SnakeGame />
        </motion.div>

        {/* Right Side: Info/Stats (Optional) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="hidden xl:flex flex-col gap-8 w-1/4"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-neon-pink" />
              <h3 className="text-white font-bold text-xl uppercase tracking-tighter">Controls</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col">
                <span className="text-neon-cyan text-[10px] font-mono uppercase tracking-widest">Move</span>
                <span className="text-white text-sm font-bold">ARROWS</span>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex flex-col">
                <span className="text-neon-cyan text-[10px] font-mono uppercase tracking-widest">Pause</span>
                <span className="text-white text-sm font-bold">SPACE</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-neon-cyan" />
              <h3 className="text-white font-bold text-xl uppercase tracking-tighter">Leaderboard</h3>
            </div>
            <div className="space-y-2">
              {[
                { name: 'NEON_RUNNER', score: 1240 },
                { name: 'CYBER_PUNK', score: 980 },
                { name: 'SYNTH_LORD', score: 850 }
              ].map((entry, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-white/60 text-xs font-mono">{entry.name}</span>
                  <span className="text-neon-pink font-bold">{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/20 text-[10px] font-mono uppercase tracking-[0.5em]">
        <span>Neon Rhythm Snake</span>
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <span>v1.0.0</span>
      </div>
    </div>
  );
}
