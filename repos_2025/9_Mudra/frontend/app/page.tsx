"use client";

import { useState, useEffect, useRef } from "react";
import Shape, { ShapeType } from "@/components/Shape";

export default function Home() {
  const [state, setState] = useState({
    type: null as ShapeType,
    size: 150,
    position: { x: 0, y: 0 },
    isDragging: false,
    webcamEnabled: false,
  });

  const lastRawStateRef = useRef<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (state.webcamEnabled) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Webcam error:", err));
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [state.webcamEnabled]);

  useEffect(() => {
    // Connect to WebSocket server
    const host = "10.125.129.232";
    const ws = new WebSocket(`ws://${host}:8080`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "sync" || data.type === "update") {
        setState((prev) => {
          const incomingState = data.state;
          const incomingStateStr = JSON.stringify(incomingState);
          const lastStateStr = lastRawStateRef.current;
          lastRawStateRef.current = incomingStateStr;

          const isShape = (t: string | null) =>
            t && ["circle", "square", "triangle"].includes(t.toLowerCase());

          const incomingType = incomingState.type;
          const currentDisplayType = prev.type;

          const lastState = lastStateStr ? JSON.parse(lastStateStr) : null;

          if (isShape(incomingType)) {
            // Shapes always replace
            return { ...incomingState };
          } else if (incomingType) {
            // Incoming is text/number
            if (isShape(currentDisplayType) || !currentDisplayType) {
              // Current is shape or null, replace with text
              return { ...incomingState };
            } else {
              // Current is text, append
              return {
                ...incomingState,
                type: currentDisplayType + incomingType,
              };
            }

          }

          // Type is same but other properties (pos/size) changed
          // Preserve the currently accumulated type
          return {
            ...incomingState,
            type: currentDisplayType,
          };
        });
      }
    };

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onclose = () => console.log("Disconnected from WebSocket");

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-white font-sans overflow-hidden select-none transition-colors duration-500">
      {state.webcamEnabled && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
          autoPlay
          muted
          playsInline
        />
      )}

      <main className="relative flex-1 w-full overflow-hidden flex items-center justify-center bg-transparent z-10">
        {state.type && (
          <Shape
            type={state.type}
            size={state.size}
            position={state.position}
            onMouseDown={() => { }} // Local interaction disabled
          />
        )}
      </main>

      {/* Visual Indicator for connection status */}
      <div className="fixed top-4 right-4 flex items-center gap-2 px-3 py-1 bg-black/5 rounded-full backdrop-blur-sm border border-black/10">
        <div
          className={`w-2 h-2 rounded-full ${wsRef.current?.readyState === 1 ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
        />
        <span className="text-[10px] font-black uppercase tracking-tighter text-black/40">
          WS Connection
        </span>
      </div>
    </div>
  );
}
