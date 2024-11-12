import { Config, DotLottieWorker, Mode } from "@lottiefiles/dotlottie-web";
import { useEffect, useRef } from "react";

export type LottieSequence = Mode[];

// `name` is
// - any string for local static files (animationData is supplied with json lottie in this case)
// - a lottie url for remote lotties (animationData should be undefined in this case)
export interface LottieProps {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animationData: any;
  initialFrame?: number;
  sequence?: Mode[];
  forceLoop?: boolean;
  speed?: number;
}

export default function Lottie({
  name,
  animationData,
  initialFrame,
  sequence,
  forceLoop,
  speed = 1,
}: Readonly<LottieProps>) {
  const ref = useRef<HTMLCanvasElement>(null);
  const refForceLoop = useRef<((enable: boolean) => void) | null>(null);
  useEffect(() => {
    if (ref.current === null) {
      return;
    }

    const { current: canvas } = ref;

    if (canvas.hasAttribute("animation")) {
      return;
    }

    canvas.setAttribute("animation", "true");
    const animationConfig: Config & {
      workerId?: string;
    } = {
      canvas: canvas,
      autoplay: false,
      renderConfig: { freezeOnOffscreen: false },
      loop: false,
      speed,
      workerId: `lottie-worker-${name}`,
    };
    if (!animationData) {
      animationConfig.src = name;
    } else {
      animationConfig.data = animationData;
    }
    if (initialFrame) {
      animationConfig.segment = [initialFrame, initialFrame];
    }
    const animation = new DotLottieWorker(animationConfig);
    animation.addEventListener("load", async () => {
      let animationStarted = false;
      let animationComplete = false;
      let currentSequence = 0;
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            if (!animationStarted) {
              const intialMode: Mode = sequence
                ? sequence[0]
                : ("foraward" as Mode);
              animation.setSegment(0, animation.totalFrames);
              animation.setMode(intialMode);
              animation.play();
              animationStarted = true;
            } else if (!animationComplete) {
              animation.play();
            } else {
              observer.unobserve(canvas);
            }
          } else {
            animation.pause();
          }
        },
        { rootMargin: "0px 0px -62px 0px", threshold: 0.15 }
      );

      observer.observe(canvas);

      let forcingLoops = false;

      refForceLoop.current = (enable: boolean) => {
        forcingLoops = enable;
        if (enable) {
          if (animationComplete) {
            animationComplete = false;
            if (sequence) {
              currentSequence = 0;
              animation.setMode(sequence[currentSequence]);
            }
            animation.play();
          }
          animation.addEventListener("pause", () => {
            animation.play();
          });
        }
      };

      animation.addEventListener("complete", async () => {
        if (sequence) {
          currentSequence++;
          if (currentSequence <= sequence.length - 1) {
            await animation.setMode(sequence[currentSequence]);
            animation.play();
          } else if (forcingLoops) {
            currentSequence = 0;
            await animation.setMode(sequence[currentSequence]);
            animation.play();
          } else {
            animationComplete = true;
          }
        }
      });

      if (forceLoop) {
        refForceLoop.current(true);
      }
    });
  }, [name, animationData, initialFrame, sequence, speed, forceLoop]);

  useEffect(() => {
    if (forceLoop !== undefined && refForceLoop.current) {
      refForceLoop.current(forceLoop);
    }
  }, [forceLoop]);
  return <canvas className="lottie-canvas" ref={ref}></canvas>;
}
