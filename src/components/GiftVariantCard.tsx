import Button from "./Button";
import "./GiftVariantCard.css";
import { GiftVariant } from "../types";
import Lottie from "./Lottie";
import { Link, useRoute } from "wouter";
import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FIRST_VISIT } from "../utils/visistCheck";
import { useTranslation } from "react-i18next";
import { formatPriceString, getCurrencyCode } from "../utils/formatPrice";
import { Text } from "./Text";
import { shortenNumber } from "../utils/shortenNumber";

interface GiftVariantCardProps {
  giftVariant: GiftVariant;
}

const ANIMATION_DURATION = 0.25;

const prepareForwardAnimation = (canvas: HTMLCanvasElement) => {
  const canvasGeometry = canvas.getBoundingClientRect();
  canvas.style.position = "absolute";
  canvas.style.width = `${canvasGeometry.width}px`;
  canvas.style.height = `${canvasGeometry.height}px`;
  canvas.style.top = `${canvasGeometry.top}px`;
  canvas.style.left = `${canvasGeometry.left}px`;
  canvas.style.right = "auto";
  canvas.style.bottom = "auto";
  document.body.appendChild(canvas);
  let expandTo = canvasGeometry.width * 2;
  const targetContainer = document.querySelector("#gift-animation-target");
  if (targetContainer) {
    const targetGeometry = targetContainer.getBoundingClientRect();
    // Scaling up due to scale(0.9) css scale on the target
    expandTo = Math.min(targetGeometry.width, targetGeometry.height) * 1.11111;
  }
  return {
    expandTo,
    top: canvasGeometry.top,
    left: canvasGeometry.left,
    width: canvasGeometry.width,
    height: canvasGeometry.height,
  };
};

const finishForwardAnimation = (canvas: HTMLCanvasElement | null) => {
  const targetContainer = document.querySelector("#gift-animation-target");
  if (!targetContainer || !canvas) {
    console.error("finishForwardAnimation: failed, no target or canvas");
    return;
  }
  targetContainer.appendChild(canvas);
  canvas.style.position = "static";
  canvas.style.top = "auto";
  canvas.style.left = "auto";
  canvas.style.right = "auto";
  canvas.style.bottom = "auto";
  canvas.style.transform = "none";
  canvas.style.width = "100%";
  canvas.style.height = "auto";
};

const prepareBackwardsAnimation = (
  canvas: HTMLCanvasElement,
  containerGeometry: DOMRect
) => {
  const currentGeometry = canvas.getBoundingClientRect();
  canvas.style.position = "absolute";
  canvas.style.top = `${currentGeometry.top}px`;
  canvas.style.left = "50%";
  canvas.style.transform = "translateX(-50%)";
  document.body.appendChild(canvas);
  // This is mostly fallback data and won't be used unless originalGeometry is missing
  const SCALER = 0.9;
  const scrollLeft = document.documentElement.scrollLeft;
  const scrollTop = document.documentElement.scrollTop;
  return {
    top: `${SCALER * (containerGeometry.top + scrollTop)}px`,
    left: `${SCALER * (containerGeometry.left + scrollLeft)}px`,
    startTop: currentGeometry.top,
    startLeft: "50%",
    shrinkTo: Math.min(containerGeometry.width, containerGeometry.height),
  };
};

const finishBackwardsAnimation = (
  canvas: HTMLCanvasElement | null,
  container: HTMLDivElement
) => {
  if (!canvas) {
    console.error("finishBackwardsAnimation: failed, no canvas");
    return;
  }
  container.appendChild(canvas);
  canvas.style.position = "static";
  canvas.style.top = "auto";
  canvas.style.left = "auto";
  canvas.style.right = "auto";
  canvas.style.bottom = "auto";
  canvas.style.width = "100%";
  canvas.style.height = "auto";
};

export default function GiftVariantCard({
  giftVariant,
}: Readonly<GiftVariantCardProps>) {
  const originalGeometry = useRef<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [scope, animate] = useAnimate();
  const [isBack] = useRoute("/");
  const [, params] = useRoute("/gift-variant/:id");
  const [playReturnAnimation, setPlayReturnAnimation] =
    useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (FIRST_VISIT) {
      return;
    }
    if (!playReturnAnimation && params?.id === giftVariant._id) {
      canvasRef.current = scope.current.querySelector(
        "canvas"
      ) as HTMLCanvasElement;
      if (!canvasRef.current) {
        console.error("Animation error: canvas not found");
        return;
      }
      setPlayReturnAnimation(true);
      const { expandTo, top, left, width, height } = prepareForwardAnimation(
        canvasRef.current
      );
      if (originalGeometry.current === null) {
        originalGeometry.current = { top, left, width, height };
      }
      const animation = animate(
        canvasRef.current,
        {
          top: "62px", // due to everything else being a ratio - this is the same on all screens
          left: "50%",
          x: "-50%",
          width: `${expandTo}px`,
          height: `${expandTo}px`,
        },
        {
          duration: ANIMATION_DURATION,
        }
      );
      animation.then(() => {
        finishForwardAnimation(canvasRef.current);
      });
    }
    if (
      playReturnAnimation &&
      isBack &&
      canvasRef.current &&
      originalGeometry.current
    ) {
      const { top, left, shrinkTo, startTop, startLeft } =
        prepareBackwardsAnimation(
          canvasRef.current,
          (scope.current as HTMLDivElement).getBoundingClientRect()
        );
      animate(
        canvasRef.current,
        {
          top: `${startTop}px`,
          left: startLeft,
        },
        { duration: 0.00001 }
      ).then(() => {
        const animation = animate(
          canvasRef.current!,
          {
            top: originalGeometry.current?.top ?? top,
            left: originalGeometry.current?.left ?? left,
            width: `${originalGeometry.current?.width ?? shrinkTo}px`,
            height: `${originalGeometry.current?.height ?? shrinkTo}px`,
            x: "0",
          },
          // If user scrolled a lot on the gift variant page it might be confusing - animate instantly
          { duration: startTop < -500 ? 0.0001 : ANIMATION_DURATION }
        );
        animation.then(() => {
          finishBackwardsAnimation(canvasRef.current, scope.current);
          // Framer motion keeps state from last animation, need to force it static position
          animate(
            canvasRef.current!,
            {
              top: "auto",
              left: "auto",
              width: `100%`,
              height: `100%`,
              x: "0",
            },
            { duration: 0.00001 }
          );
        });
      });

      setPlayReturnAnimation(false);
    }
  }, [
    scope,
    params?.id,
    giftVariant._id,
    animate,
    playReturnAnimation,
    isBack,
  ]);

  const cardBg = giftVariant.media.bgGradient
    ? `linear-gradient(${giftVariant.media.bgGradient.top}, ${giftVariant.media.bgGradient.bottom})`
    : `linear-gradient(#FE9F4133, #FE9F411A)`;
  return (
    <div
      className="giftVariantCard"
      style={{ background: `${cardBg}, var(--gift-var-bg)` }}
    >
      <div className="giftSupply">
        <Text type="footnote">
          {t("N of Total", {
            n: shortenNumber(giftVariant.soldCount),
            total: shortenNumber(giftVariant.totalSupply),
          })}
        </Text>
      </div>
      <div ref={scope} className="giftVariantImg">
        <Lottie
          name={giftVariant.media.lottieUrl}
          animationData={undefined}
          initialFrame={giftVariant.media.lottieInitialFrame}
          sequence={giftVariant.media.lottieSequence}
          forceLoop={params?.id === giftVariant._id}
        />
      </div>
      <div className="giftTitle">
        <Text type="bigText" style={{ fontWeight: 600 }}>
          {i18n.language === "ru" ? giftVariant.name.ru : giftVariant.name.en}
        </Text>
      </div>
      <Link
        to={`/gift-variant/${giftVariant._id}`}
        style={{ userSelect: "none", WebkitTapHighlightColor: "transparent" }}
      >
        <Button
          icon={
            giftVariant.soldCount >= giftVariant.totalSupply
              ? undefined
              : getCurrencyCode(giftVariant.price)
          }
          label={
            giftVariant.soldCount >= giftVariant.totalSupply
              ? t("Sold Out")
              : formatPriceString(giftVariant.price)
          }
          onClick={() => {}}
          disabled={giftVariant.soldCount >= giftVariant.totalSupply}
        />
      </Link>
    </div>
  );
}

export const GiftVariantCardSkeleton = () => {
  return (
    <div className="giftVariantCard giftVariantCardSkeleton">
      <p className="giftSupply giftSupplySkeleton skeleton-shimmer"></p>
      <div className="giftVariantImg giftVariantImgSkeleton skeleton-shimmer"></div>
      <p className="giftTitle giftTitleSkeleton skeleton-shimmer"></p>
      <Button
        label="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
        disabled
        onClick={() => {}}
      />
    </div>
  );
};
