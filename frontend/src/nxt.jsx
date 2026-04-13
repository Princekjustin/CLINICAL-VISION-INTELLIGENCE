'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function ClinicalDiagnosticIntelligenceDashboard() {
  const [alignmentAccuracy, setAlignmentAccuracy] = useState(94.7);
  const [tipDepth, setTipDepth] = useState(8.4);
  const [confidence, setConfidence] = useState(0.92);
  const [logEntries, setLogEntries] = useState<
    { time: string; message: string; accuracy: number }[]
  >([
    { time: '14:22:11', message: 'Needle aligned • 15° insertion', accuracy: 96 },
    { time: '14:21:58', message: 'Successful subcutaneous delivery', accuracy: 93 },
    { time: '14:21:45', message: 'Needle aligned • 18° insertion', accuracy: 98 },
  ]);
  const [isStreaming, setIsStreaming] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Simulate live YOLOv11 updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random realistic fluctuations
      setAlignmentAccuracy((prev) => Math.max(88, Math.min(99.9, prev + (Math.random() * 4 - 2))));
      setTipDepth((prev) => Math.max(5.2, Math.min(12.8, prev + (Math.random() * 1.2 - 0.6))));
      setConfidence((prev) => Math.max(0.85, Math.min(0.98, prev + (Math.random() * 0.08 - 0.04))));

      // Occasionally add log entry when confidence is high
      if (Math.random() > 0.85) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogEntries((prev) => {
          const newEntry = {
            time: timeStr,
            message: 'Needle aligned • Successful insertion',
            accuracy: Math.round(alignmentAccuracy),
          };
          return [newEntry, ...prev.slice(0, 4)]; // keep latest 5
        });
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [alignmentAccuracy]);

  // Fake live video stream (you can replace src with your actual YOLO-processed RTSP/WebRTC feed)
  useEffect(() => {
    if (videoRef.current) {
      // For demo purposes we use a placeholder video. In production replace with your YOLOv11 stream URL
      videoRef.current.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny_320x180_10s_1MB.mp4';
      videoRef.current.loop = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap');
        
        .obsidian-bg {
          background: linear-gradient(180deg, #0a0a0a 0%, #111113 100%);
        }
        
        .emerald-glow {
          box-shadow: 0 0 25px -5px rgb(16 185 129);
        }
        
        .live-dot {
          animation: pulse 2s infinite;
        }
      `}</style>

      <div className="obsidian-bg min-h-screen text-white font-sans flex flex-col h-screen overflow-hidden">
        {/* HEADER / STATUS BAR */}
        <div className="h-14 border-b border-white/10 bg-black/40 backdrop-blur-xl px-8 flex items-center justify-between z-50">
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-2xl flex items-center justify-center text-lg font-bold tracking-tighter">CDI</div>
            <div>
              <h1 className="font-semibold tracking-tighter text-2xl text-white">Clinical Diagnostic Intelligence</h1>
              <p className="text-emerald-400 text-xs -mt-1 tracking-[0.5px]">YOLOv11 • Real-time Injection Monitoring</p>
            </div>
          </div>

          <div className="flex items-center gap-x-8 text-sm">
            {/* GPU Status */}
            <div className="flex items-center gap-x-2 bg-white/5 px-4 h-9 rounded-3xl border border-white/10">
              <div className="w-2 h-2 bg-emerald-400 rounded-full live-dot"></div>
              <span className="font-medium text-emerald-300">GPU: RTX 5070</span>
              <span className="text-emerald-400 text-xs font-mono">ACTIVE • 71°C</span>
            </div>

            {/* Model Status */}
            <div className="flex items-center gap-x-2 bg-white/5 px-4 h-9 rounded-3xl border border-white/10">
              <span className="text-white/70">Model:</span>
              <span className="font-semibold text-emerald-400">Llama 3.2 Vision • 11B</span>
            </div>

            {/* Stream Status */}
            <div className="flex items-center gap-x-3 bg-emerald-500/10 text-emerald-400 px-5 h-9 rounded-3xl border border-emerald-500/30">
              <div className="w-2 h-2 bg-emerald-400 rounded-full live-dot"></div>
              <span className="uppercase text-xs font-semibold tracking-widest">LIVE YOLOv11 STREAM</span>
              <span className="font-mono text-xs bg-black/30 px-2 py-px rounded">1280×720 • 60 fps</span>
            </div>

            <div className="text-xs font-mono text-white/40">Bengaluru • 12 Apr 2026 00:42</div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT: 16:9 LIVE VIEWPORT */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
            <div className="w-full max-w-[1280px] aspect-video bg-black rounded-3xl overflow-hidden border border-white/10 emerald-glow relative">
              {/* Live Video Feed */}
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                muted
              />

              {/* YOLO Overlay Simulation */}
              {isStreaming && (
                <>
                  {/* Simulated bounding box around needle area */}
                  <div className="absolute top-[38%] left-[42%] w-[18%] h-[42%] border-2 border-emerald-400 rounded-xl flex items-center justify-center pointer-events-none">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-emerald-500 text-[10px] font-bold px-3 py-px rounded-full tracking-widest flex items-center gap-x-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                      </span>
                      NEEDLE TIP
                    </div>
                    {/* Angle indicator */}
                    <div className="absolute bottom-2 right-2 text-emerald-300 text-xs font-mono bg-black/70 px-2 py-px rounded">15.2°</div>
                  </div>

                  {/* Confidence badge floating */}
                  <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-md text-emerald-300 text-sm font-medium px-5 h-9 rounded-2xl flex items-center border border-emerald-400/30">
                    Confidence • <span className="ml-2 font-mono text-emerald-400 text-lg">{(confidence * 100).toFixed(0)}%</span>
                  </div>

                  {/* LIVE badge */}
                  <div className="absolute top-6 left-6 bg-red-500 text-white text-xs font-bold px-4 h-7 rounded-2xl flex items-center gap-x-2 shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    LIVE
                  </div>
                </>
              )}

              {/* No stream overlay */}
              {!isStreaming && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                  <div className="text-6xl mb-4">📡</div>
                  <div className="text-2xl font-medium text-white/70">Waiting for YOLOv11 stream...</div>
                  <button
                    onClick={() => setIsStreaming(true)}
                    className="mt-8 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-2xl font-semibold flex items-center gap-x-3"
                  >
                    <span className="text-xl">▶</span> START MONITORING
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: REAL-TIME METRICS SIDEBAR */}
          <div className="w-80 border-l border-white/10 bg-black/60 backdrop-blur-3xl p-6 flex flex-col gap-y-6">
            <div className="text-emerald-400 uppercase text-xs font-semibold tracking-[1px] mb-2">Real-time Metrics</div>

            {/* Needle Alignment Accuracy */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex justify-between items-baseline">
                <div className="text-white/70 text-sm">Needle Alignment Accuracy</div>
                <div className="text-5xl font-semibold font-mono text-emerald-400">{alignmentAccuracy.toFixed(1)}%</div>
              </div>
              <div className="h-2 bg-white/10 rounded-3xl mt-6 overflow-hidden">
                <div
                  className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
                  style={{ width: `${alignmentAccuracy}%` }}
                />
              </div>
              <div className="text-[10px] text-emerald-400/70 mt-2 flex justify-between">
                <span>OPTIMAL</span>
                <span>EXCELLENT</span>
              </div>
            </div>

            {/* Tip Depth */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex justify-between items-baseline">
                <div className="text-white/70 text-sm">Tip Depth</div>
                <div className="text-5xl font-semibold font-mono text-white">{tipDepth.toFixed(1)} <span className="text-base font-normal text-white/40">mm</span></div>
              </div>
              <div className="mt-2 text-xs text-emerald-400">Subcutaneous • Ideal range 6–10 mm</div>
            </div>

            {/* Detection Confidence */}
            <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
              <div className="flex justify-between items-baseline">
                <div className="text-white/70 text-sm">Detection Confidence</div>
                <div className="text-5xl font-semibold font-mono text-emerald-400">{(confidence * 100).toFixed(0)}%</div>
              </div>
              <div className="flex items-center gap-x-4 mt-6">
                <div className="flex-1 h-2.5 bg-gradient-to-r from-red-400 via-amber-400 to-emerald-400 rounded-3xl relative">
                  <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md" style={{ left: `${confidence * 100 - 4}%` }}></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-auto pt-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className="flex-1 py-4 text-sm font-semibold bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
              >
                {isStreaming ? '⏹ STOP STREAM' : '▶ START STREAM'}
              </button>
              <button className="flex-1 py-4 text-sm font-semibold bg-emerald-500 hover:bg-emerald-600 rounded-2xl transition-colors">
                CAPTURE FRAME
              </button>
            </div>

            <div className="text-[10px] text-white/30 text-center font-mono">YOLOv11 • MONAI • Live Inference</div>
          </div>
        </div>

        {/* BOTTOM EVENT LOG */}
        <div className="h-64 border-t border-white/10 bg-black/70 backdrop-blur-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="uppercase text-xs font-semibold text-emerald-400 tracking-widest">Successful Alignment Log</div>
            <div className="text-xs text-white/40 font-mono">Last 30 minutes • 17 events</div>
          </div>

          <div className="flex-1 overflow-auto space-y-3 pr-4 custom-scroll">
            {logEntries.map((entry, i) => (
              <div key={i} className="flex items-center gap-x-6 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl px-6 py-3">
                <div className="font-mono text-sm w-20 text-emerald-300">{entry.time}</div>
                <div className="flex-1 text-white">{entry.message}</div>
                <div className="font-mono text-emerald-400 text-lg">{entry.accuracy}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}