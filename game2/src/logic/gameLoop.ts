import { Dot } from "./Dot";
import { updateDotPosition } from "./physics";
import { spreadInfection } from "./infectionLogic";

export const updateGame = (
  dots: Dot[],
  canvasWidth: number,
  canvasHeight: number
): void => {
  dots.forEach((dot) => updateDotPosition(dot, canvasWidth, canvasHeight));
  spreadInfection(dots);
};
