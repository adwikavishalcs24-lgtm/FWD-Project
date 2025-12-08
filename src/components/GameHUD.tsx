import React from "react";

interface GameHUDProps {
  timer: number;
  infected: number;
  cured: number;
  credits: number;
  combo: number;
}

const GameHUD: React.FC<GameHUDProps> = ({ timer, infected, cured, credits, combo }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-t-2xl p-4 shadow-lg border-b-2 border-cyan-400">
      <div className="flex justify-between items-center text-white">
        <div className="flex gap-6">
          <div className="bg-black/30 px-4 py-2 rounded-lg border border-cyan-500/50">
            <div className="text-xs text-cyan-300 font-semibold">TIME</div>
            <div className="text-2xl font-bold text-cyan-400">{formatTime(timer)}</div>
          </div>
          <div className="bg-black/30 px-4 py-2 rounded-lg border border-red-500/50">
            <div className="text-xs text-red-300 font-semibold">INFECTED</div>
            <div className="text-2xl font-bold text-red-400">{infected}</div>
          </div>
          <div className="bg-black/30 px-4 py-2 rounded-lg border border-green-500/50">
            <div className="text-xs text-green-300 font-semibold">CURED</div>
            <div className="text-2xl font-bold text-green-400">{cured}</div>
          </div>
        </div>
        <div className="flex gap-4">
          {combo > 1 && (
            <div className="bg-gradient-to-br from-orange-500 to-red-500 px-4 py-2 rounded-lg shadow-lg border-2 border-orange-300 animate-pulse">
              <div className="text-xs text-orange-100 font-semibold">COMBO</div>
              <div className="text-3xl font-bold text-white">x{combo}</div>
            </div>
          )}
          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 px-6 py-2 rounded-lg shadow-lg border-2 border-yellow-300">
            <div className="text-xs text-yellow-100 font-semibold">CREDITS</div>
            <div className="text-3xl font-bold text-white">{credits}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;
