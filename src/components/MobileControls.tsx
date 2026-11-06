import React, { useRef, useState, useEffect } from 'react';
import { Flashlight, Radio, Hand, MessageSquare } from 'lucide-react';

interface MobileControlsProps {
  onTouchMove: (input: { x: number; y: number }) => void;
  onToggleFlashlight: () => void;
  onRadio: () => void;
  onInteract: () => void;
  isFlashlightOn: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onTouchMove,
  onToggleFlashlight,
  onRadio,
  onInteract,
  isFlashlightOn
}) => {
  const [touchPos, setTouchPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updateJoystick(e.touches[0]);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    updateJoystick(e.touches[0]);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchPos({ x: 0, y: 0 });
    onTouchMove({ x: 0, y: 0 });
  };

  const updateJoystick = (touch: React.Touch) => {
    if (!joystickRef.current) return;
    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const maxRadius = rect.width / 2;

    const dist = Math.hypot(dx, dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const nx = (Math.cos(angle) * clampedDist) / maxRadius;
    const ny = (Math.sin(angle) * clampedDist) / maxRadius;

    setTouchPos({ x: Math.cos(angle) * clampedDist, y: Math.sin(angle) * clampedDist });
    onTouchMove({ x: nx, y: ny });
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex items-end justify-between px-4 pb-20 select-none md:hidden">
      {/* Virtual Joystick (Bottom Left) */}
      <div
        ref={joystickRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="pointer-events-auto relative flex h-24 w-24 items-center justify-center rounded-full bg-slate-950/70 border-2 border-slate-700/80 shadow-2xl backdrop-blur-none"
      >
        <div
          className="h-10 w-10 rounded-full bg-blue-500/80 border-2 border-white/60 shadow-lg"
          style={{
            transform: `translate(${touchPos.x}px, ${touchPos.y}px)`
          }}
        ></div>
      </div>

      {/* Action Buttons (Bottom Right) */}
      <div className="pointer-events-auto flex flex-col gap-2">
        <button
          onClick={onInteract}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl active:scale-95 transition-transform"
          aria-label="Interagieren"
        >
          <Hand className="h-5 w-5" />
        </button>

        <button
          onClick={onToggleFlashlight}
          className={`flex h-10 w-10 items-center justify-center rounded-full shadow-xl active:scale-95 transition-transform ${
            isFlashlightOn ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
          }`}
          aria-label="Taschenlampe"
        >
          <Flashlight className="h-4 w-4" />
        </button>

        <button
          onClick={onRadio}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl active:scale-95 transition-transform"
          aria-label="Funk"
        >
          <Radio className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
