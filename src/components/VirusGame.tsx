import React, { useEffect, useRef, useState } from "react";
import { Dot, createDot } from "../logic/Dot";
import { updateGame } from "../logic/gameLoop";
import { checkGameOver } from "../logic/infectionLogic";
import { getDistance } from "../logic/physics";
import GameHUD from "./GameHUD";
import GameOverModal from "./GameOverModal";

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  opacity: number;
  color: string;
}

interface PowerUp {
  id: number;
  x: number;
  y: number;
  type: "freeze" | "cure_all" | "slow";
  radius: number;
}

const VirusGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);
  const [timer, setTimer] = useState(90);
  const [cured, setCured] = useState(0);
  const [credits, setCredits] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [combo, setCombo] = useState(0);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const [frozen, setFrozen] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const animationRef = useRef<number>();
  const dotsRef = useRef<Dot[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const powerUpsRef = useRef<PowerUp[]>([]);
  const comboRef = useRef(0);
  const comboTimerRef = useRef<number>(0);
  const frozenRef = useRef(false);
  const lastCureTimeRef = useRef(0);

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const TOTAL_DOTS = 40;
  const INITIAL_INFECTED = 5;

  const initGame = () => {
    const newDots: Dot[] = [];
    for (let i = 0; i < TOTAL_DOTS; i++) {
      const state = i < INITIAL_INFECTED ? "infected" : "healthy";
      newDots.push(createDot(i, CANVAS_WIDTH, CANVAS_HEIGHT, state));
    }
    setDots(newDots);
    dotsRef.current = newDots;
    setTimer(90);
    setCured(0);
    setCredits(0);
    setGameOver(false);
    setGameWon(false);
    setCombo(0);
    setPowerUps([]);
    setFrozen(false);
    setFloatingTexts([]);
    floatingTextsRef.current = [];
    powerUpsRef.current = [];
    comboRef.current = 0;
    comboTimerRef.current = 0;
    frozenRef.current = false;
    lastCureTimeRef.current = 0;
  };

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (gameOver || gameWon) return;

    const timerInterval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [gameOver, gameWon]);

  useEffect(() => {
    if (gameOver || gameWon) return;

    const powerUpInterval = setInterval(() => {
      if (Math.random() < 0.3 && powerUpsRef.current.length < 2) {
        const types: ("freeze" | "cure_all" | "slow")[] = ["freeze", "cure_all", "slow"];
        const newPowerUp: PowerUp = {
          id: Date.now(),
          x: Math.random() * (CANVAS_WIDTH - 60) + 30,
          y: Math.random() * (CANVAS_HEIGHT - 60) + 30,
          type: types[Math.floor(Math.random() * types.length)],
          radius: 15,
        };
        powerUpsRef.current.push(newPowerUp);
        setPowerUps([...powerUpsRef.current]);
      }
    }, 8000);

    return () => clearInterval(powerUpInterval);
  }, [gameOver, gameWon]);

  useEffect(() => {
    if (gameOver || gameWon) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      // Update combo timer
      if (comboTimerRef.current > 0) {
        comboTimerRef.current--;
        if (comboTimerRef.current === 0) {
          comboRef.current = 0;
          setCombo(0);
        }
      }

      // Update game state (only if not frozen)
      if (!frozenRef.current) {
        updateGame(dotsRef.current, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      // Check win condition
      const infectedCount = dotsRef.current.filter((d) => d.state === "infected").length;
      if (infectedCount === 0 && dotsRef.current.some((d) => d.state === "healthy")) {
        setGameWon(true);
        return;
      }

      // Check game over
      if (checkGameOver(dotsRef.current)) {
        setGameOver(true);
        return;
      }

      // Clear canvas
      ctx.fillStyle = "#0a0a1a";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw infection radius glow for infected dots
      dotsRef.current.forEach((dot) => {
        if (dot.state === "infected") {
          const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, 50);
          gradient.addColorStop(0, "rgba(239, 68, 68, 0.1)");
          gradient.addColorStop(1, "rgba(239, 68, 68, 0)");
          ctx.fillStyle = gradient;
          ctx.fillRect(dot.x - 50, dot.y - 50, 100, 100);
        }
      });

      // Draw power-ups
      powerUpsRef.current.forEach((powerUp) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
        
        if (powerUp.type === "freeze") {
          ctx.fillStyle = "#60a5fa";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#60a5fa";
        } else if (powerUp.type === "cure_all") {
          ctx.fillStyle = "#fbbf24";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#fbbf24";
        } else {
          ctx.fillStyle = "#a78bfa";
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#a78bfa";
        }
        ctx.fill();
        
        // Draw icon
        ctx.shadowBlur = 0;
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        if (powerUp.type === "freeze") ctx.fillText("❄", powerUp.x, powerUp.y);
        else if (powerUp.type === "cure_all") ctx.fillText("✨", powerUp.x, powerUp.y);
        else ctx.fillText("⏱", powerUp.x, powerUp.y);
        ctx.restore();
      });

      // Draw dots
      dotsRef.current.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);

        if (dot.state === "infected") {
          const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
          const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.radius);
          gradient.addColorStop(0, `rgba(255, 107, 107, ${pulse})`);
          gradient.addColorStop(1, "#ef4444");
          ctx.fillStyle = gradient;
          ctx.shadowBlur = 15 * pulse;
          ctx.shadowColor = "#ef4444";
        } else if (dot.state === "healthy") {
          const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.radius);
          gradient.addColorStop(0, "#6bff6b");
          gradient.addColorStop(1, "#22c55e");
          ctx.fillStyle = gradient;
          ctx.shadowBlur = 10;
          ctx.shadowColor = "#22c55e";
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Update floating texts
      floatingTextsRef.current = floatingTextsRef.current.filter((ft) => ft.opacity > 0);
      floatingTextsRef.current.forEach((ft) => {
        ft.y -= 2;
        ft.opacity -= 0.02;
        ctx.font = "bold 24px Arial";
        ctx.fillStyle = ft.color.replace('1)', `${ft.opacity})`);
        ctx.strokeStyle = `rgba(0, 0, 0, ${ft.opacity})`;
        ctx.lineWidth = 3;
        ctx.strokeText(ft.text, ft.x, ft.y);
        ctx.fillText(ft.text, ft.x, ft.y);
      });

      setDots([...dotsRef.current]);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameOver, gameWon]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || gameOver || gameWon) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    let somethingClicked = false;

    // Check power-up clicks first
    for (let i = powerUpsRef.current.length - 1; i >= 0; i--) {
      const powerUp = powerUpsRef.current[i];
      const distance = getDistance(x, y, powerUp.x, powerUp.y);
      if (distance <= powerUp.radius + 5) {
        somethingClicked = true;
        powerUpsRef.current.splice(i, 1);
        setPowerUps([...powerUpsRef.current]);

        if (powerUp.type === "freeze") {
          frozenRef.current = true;
          setFrozen(true);
          setTimeout(() => {
            frozenRef.current = false;
            setFrozen(false);
          }, 3000);
          addFloatingText(powerUp.x, powerUp.y, "FROZEN!", "rgba(96, 165, 250, 1)");
        } else if (powerUp.type === "cure_all") {
          let curedCount = 0;
          dotsRef.current.forEach((dot) => {
            if (dot.state === "infected") {
              dot.state = "healthy";
              curedCount++;
            }
          });
          const earnedCredits = curedCount * 15;
          setCured((c) => c + curedCount);
          setCredits((cr) => cr + earnedCredits);
          addFloatingText(powerUp.x, powerUp.y, `CURED ALL! +${earnedCredits}`, "rgba(251, 191, 36, 1)");
        } else if (powerUp.type === "slow") {
          dotsRef.current.forEach((dot) => {
            dot.vx *= 0.5;
            dot.vy *= 0.5;
          });
          addFloatingText(powerUp.x, powerUp.y, "SLOWED!", "rgba(167, 139, 250, 1)");
        }
        break;
      }
    }

    // Check dot clicks - find closest infected dot within range
    if (!somethingClicked) {
      let closestDot: Dot | null = null;
      let closestDistance = Infinity;

      dotsRef.current.forEach((dot) => {
        if (dot.state === "infected") {
          const distance = getDistance(x, y, dot.x, dot.y);
          if (distance <= dot.radius + 8 && distance < closestDistance) {
            closestDistance = distance;
            closestDot = dot;
          }
        }
      });

      if (closestDot) {
        somethingClicked = true;
        closestDot.state = "healthy";
        
        // Combo system
        const now = Date.now();
        if (now - lastCureTimeRef.current < 1000) {
          comboRef.current++;
        } else {
          comboRef.current = 1;
        }
        lastCureTimeRef.current = now;
        comboTimerRef.current = 60;
        setCombo(comboRef.current);

        const baseCredits = 2;
        const comboBonus = comboRef.current > 1 ? (comboRef.current - 1) * 2 : 0;
        const earnedCredits = baseCredits + comboBonus;
        
        setCured((c) => c + 1);
        setCredits((cr) => cr + earnedCredits);

        // Add floating text
        const text = comboRef.current > 1 
          ? `+${earnedCredits} (x${comboRef.current} COMBO!)` 
          : `+${earnedCredits}`;
        const color = comboRef.current > 1 
          ? "rgba(251, 191, 36, 1)" 
          : "rgba(34, 197, 94, 1)";
        addFloatingText(closestDot.x, closestDot.y, text, color);

        // Flash effect
        if (canvas) {
          canvas.style.filter = "brightness(1.3)";
          setTimeout(() => {
            canvas.style.filter = "brightness(1)";
          }, 100);
        }
      }
    }

    if (!somethingClicked) {
      // Penalty for missing
      comboRef.current = 0;
      setCombo(0);
      comboTimerRef.current = 0;
    }
  };

  const addFloatingText = (x: number, y: number, text: string, color: string) => {
    const newText: FloatingText = {
      id: Date.now() + Math.random(),
      x,
      y,
      text,
      opacity: 1,
      color,
    };
    floatingTextsRef.current.push(newText);
  };

  const infectedCount = dots.filter((d) => d.state === "infected").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="bg-black/40 rounded-2xl shadow-2xl overflow-hidden border-2 border-cyan-500/50">
          <GameHUD timer={timer} infected={infectedCount} cured={cured} credits={credits} combo={combo} />
          
          <div className="p-6 bg-gradient-to-br from-gray-900 to-indigo-950 relative">
            {frozen && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-blue-500/90 text-white px-6 py-2 rounded-full font-bold text-lg z-10 animate-pulse">
                ❄ FROZEN ❄
              </div>
            )}
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onClick={handleCanvasClick}
              onDoubleClick={(e) => e.preventDefault()}
              className="w-full h-auto bg-gray-950 rounded-xl shadow-inner cursor-crosshair border-2 border-purple-500/30 transition-all duration-100 select-none"
              style={{ maxWidth: "100%", touchAction: "none" }}
            />
            <div className="mt-4 text-center text-sm text-cyan-300">
              <p>💡 Click infected (red) dots to cure them!</p>
              <p>⚡ Collect power-ups: ❄ Freeze | ✨ Cure All | ⏱ Slow Down</p>
              <p>🔥 Build combos by curing quickly!</p>
            </div>
          </div>
        </div>
      </div>

      <GameOverModal
        isOpen={gameOver || gameWon}
        cured={cured}
        credits={credits}
        won={gameWon}
        onRestart={initGame}
      />
    </div>
  );
};

export default VirusGame;
