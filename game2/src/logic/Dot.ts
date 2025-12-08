export interface Dot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  state: "healthy" | "infected" | "cured";
  infectionTimer: number;
}

export const createDot = (
  id: number,
  canvasWidth: number,
  canvasHeight: number,
  state: "healthy" | "infected" = "healthy"
): Dot => ({
  id,
  x: Math.random() * (canvasWidth - 40) + 20,
  y: Math.random() * (canvasHeight - 40) + 20,
  vx: (Math.random() - 0.5) * 3.5,
  vy: (Math.random() - 0.5) * 3.5,
  radius: 10,
  state,
  infectionTimer: 0,
});
