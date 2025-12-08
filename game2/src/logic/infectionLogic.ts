import { Dot } from "./Dot";
import { getDistance } from "./physics";

const INFECTION_RADIUS = 60;
const INFECTION_INTERVAL = 90; // frames (~1.5 seconds at 60fps)

export const spreadInfection = (dots: Dot[]): void => {
  dots.forEach((dot) => {
    if (dot.state === "infected") {
      dot.infectionTimer++;
      
      if (dot.infectionTimer >= INFECTION_INTERVAL) {
        dot.infectionTimer = 0;
        
        // Find nearby healthy dots
        const nearbyHealthy: Dot[] = [];
        dots.forEach((target) => {
          if (target.state === "healthy") {
            const distance = getDistance(dot.x, dot.y, target.x, target.y);
            if (distance < INFECTION_RADIUS) {
              nearbyHealthy.push(target);
            }
          }
        });
        
        // Infect one random nearby dot
        if (nearbyHealthy.length > 0) {
          const randomTarget = nearbyHealthy[Math.floor(Math.random() * nearbyHealthy.length)];
          randomTarget.state = "infected";
          randomTarget.infectionTimer = 0;
        }
      }
    }
  });
};

export const checkGameOver = (dots: Dot[]): boolean => {
  const infectedCount = dots.filter((d) => d.state === "infected").length;
  return infectedCount > dots.length * 0.6;
};
