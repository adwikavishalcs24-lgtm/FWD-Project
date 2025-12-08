import React from "react";

interface GameOverModalProps {
  isOpen: boolean;
  cured: number;
  credits: number;
  won: boolean;
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, cured, credits, won, onRestart }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className={`bg-gradient-to-br ${won ? 'from-green-900 via-emerald-900 to-teal-900 border-green-500' : 'from-red-900 via-purple-900 to-indigo-900 border-red-500'} p-8 rounded-3xl shadow-2xl border-4 max-w-md w-full mx-4 ${won ? 'animate-bounce' : 'animate-pulse'}`}>
        <div className="text-center">
          <h2 className={`text-5xl font-bold ${won ? 'text-green-400' : 'text-red-400'} mb-4 drop-shadow-lg`}>
            {won ? '✅ VICTORY!' : '☠️ OUTBREAK!'}
          </h2>
          <p className={`text-xl ${won ? 'text-green-200' : 'text-red-200'} mb-6`}>
            {won ? 'You saved the population!' : 'The virus has spread too far...'}
          </p>
          
          <div className="bg-black/40 rounded-xl p-6 mb-6 border border-cyan-500/50">
            <div className="grid grid-cols-2 gap-4 text-white">
              <div>
                <div className="text-sm text-green-300">Citizens Cured</div>
                <div className="text-3xl font-bold text-green-400">{cured}</div>
              </div>
              <div>
                <div className="text-sm text-yellow-300">Credits Earned</div>
                <div className="text-3xl font-bold text-yellow-400">{credits}</div>
              </div>
            </div>
          </div>

          <button
            onClick={onRestart}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold py-3 px-8 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 border-2 border-cyan-300"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
