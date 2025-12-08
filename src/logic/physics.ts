import { Dot } from "./Dot";

export const updateDotPosition = (dot: Dot, canvasWidth: number, canvasHeight: number): void => {
  dot.x += dot.vx;
  dot.y += dot.vy;

  // Bounce off walls
  if (dot.x - dot.radius <= 0 || dot.x + dot.radius >= canvasWidth) {
    dot.vx *= -1;
    dot.x = Math.max(dot.radius, Math.min(canvasWidth - dot.radius, dot.x));
  }
  if (dot.y - dot.radius <= 0 || dot.y + dot.radius >= canvasHeight) {
    dot.vy *= -1;
    dot.y = Math.max(dot.radius, Math.min(canvasHeight - dot.radius, dot.y));
  }
};

export const getDistance = (x1: number, y1: number, x2: number, y2: number): number => {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
};
