import "./SparkleContainer.css";
import { PropsWithChildren, useEffect, useRef } from "react";

const MAX_SPARKLES = 80;
const SPARKLE_INTERVAL = 16;

const MAX_SPARKLE_LIFE = 3;
const MIN_SPARKLE_LIFE = 1;

const MAX_SPARKLE_SIZE = 20;
const MIN_SPARKLE_SIZE = 2;

const MIN_SPARKLE_TRAVEL_X = 150;
const MIN_SPARKLE_TRAVEL_Y = 5;

class Sparkle {
  container: HTMLDivElement;
  size: number;
  x: number;
  y: number;
  xDir: number;
  yDir: number;
  xMaxTravel: number;
  yMaxTravel: number;
  xTravelDist: number;
  yTravelDist: number;
  xEnd: number;
  yEnd: number;
  life: number;
  sparkle: HTMLDivElement;

  constructor(container: HTMLDivElement) {
    this.container = container;
    this.size = this.random(MAX_SPARKLE_SIZE, MIN_SPARKLE_SIZE);
    this.x = this.random(
      this.container.offsetWidth * 0.75,
      this.container.offsetWidth * 0.25
    );
    this.y = this.container.offsetHeight / 2 - this.size / 2;
    this.xDir = this.randomSign();
    this.yDir = this.randomSign();

    this.xMaxTravel =
      this.xDir === -1 ? this.x : this.container.offsetWidth - this.x;
    this.yMaxTravel = this.container.offsetHeight / 2 - this.size;

    this.xTravelDist = this.random(this.xMaxTravel, MIN_SPARKLE_TRAVEL_X);
    this.yTravelDist = this.random(this.yMaxTravel, MIN_SPARKLE_TRAVEL_Y);

    this.xEnd = this.x + this.xTravelDist * this.xDir;
    this.yEnd = this.y + this.yTravelDist * this.yDir;

    this.life = this.random(MAX_SPARKLE_LIFE, MIN_SPARKLE_LIFE);

    this.sparkle = document.createElement("div");
    this.sparkle.classList.add("sparkle");

    this.sparkle.style.setProperty("--start-left", this.x + "px");
    this.sparkle.style.setProperty("--start-top", this.y + "px");

    this.sparkle.style.setProperty("--end-left", this.xEnd + "px");
    this.sparkle.style.setProperty("--end-top", this.yEnd + "px");

    this.sparkle.style.setProperty("--sparkle-life", this.life + "s");
    this.sparkle.style.setProperty("--sparkle-life-num", `${this.life}`);

    this.sparkle.style.setProperty("--sparkle-size", this.size + "px");
  }

  draw() {
    this.container.appendChild(this.sparkle);
  }

  pop() {
    this.container.removeChild(this.sparkle);
  }

  random(max: number, min: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomSign() {
    return Math.random() > 0.5 ? 1 : -1;
  }
}

class SparkleSpawner {
  container: HTMLDivElement;
  currentSparkleCount: number = 0;
  intervalId: number | undefined;
  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  play() {
    this.intervalId = setInterval(() => {
      if (this.currentSparkleCount >= MAX_SPARKLES) {
        return;
      }

      this.currentSparkleCount++;

      const newSparkle = new Sparkle(this.container);

      newSparkle.draw();

      setTimeout(() => {
        this.currentSparkleCount--;
        newSparkle.pop();
      }, newSparkle.life * 1000);
    }, SPARKLE_INTERVAL);
  }

  destroy() {
    clearInterval(this.intervalId);
  }
}

export const SparkleContainer = ({ children }: Readonly<PropsWithChildren>) => {
  const container = useRef(null);
  const spawner = useRef<SparkleSpawner | null>(null);
  useEffect(() => {
    if (container.current) {
      spawner.current = new SparkleSpawner(container.current);
      spawner.current.play();
    }

    return () => {
      spawner.current?.destroy();
    };
  }, []);
  return (
    <div ref={container} className="sparkle-container">
      {children}
    </div>
  );
};
