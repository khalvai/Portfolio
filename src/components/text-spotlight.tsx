"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { steps } from "@/config";

/**
 * Scroll-driven "spotlight" text effect.
 * Ported 1:1 from https://remvze.com/ui/text-spotlight-effect/
 *
 * Install: npm i motion
 */

const SERIF_STACK = '"Spotlight Sentient", Georgia, "Times New Roman", serif';

// Same values as the reference page: base .95rem * 1.2^2 = 1.6416rem.
const textStyle: CSSProperties = {
  fontFamily: SERIF_STACK,
  fontSize: "1.6416rem",
  lineHeight: 2,
  textAlign: "center",
};

type SpotlightLineProps = {
  children: ReactNode;
  direction?: -1 | 1;
  keepLitAfterCenter?: boolean;
};

function SpotlightLine({
  children,
  direction = -1,
  keepLitAfterCenter = false,
}: SpotlightLineProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  // Progress goes 0 -> 1 as the line travels from the bottom of the viewport
  // to the top. The line is fully lit at 0.5 (viewport center).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center end", "center start"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    mass: 0.25,
  });

  const opacity: MotionValue<number> = useTransform(
    progress,
    [0, 0.38, 0.5, 0.62, 1],
    keepLitAfterCenter ? [0.15, 0.15, 1, 1, 1] : [0.15, 0.15, 1, 0.15, 0.15],
  );

  const scale: MotionValue<number> = useTransform(
    progress,
    [0, 0.38, 0.5, 0.62, 1],
    keepLitAfterCenter ? [0.97, 0.97, 1, 1, 1] : [0.97, 0.97, 1, 0.97, 0.97],
  );

  const filter: MotionValue<string> = useTransform(
    progress,
    [0, 0.38, 0.5, 0.62, 1],
    keepLitAfterCenter
      ? ["blur(2px)", "blur(2px)", "blur(0px)", "blur(0px)", "blur(0px)"]
      : ["blur(2px)", "blur(2px)", "blur(0px)", "blur(2px)", "blur(2px)"],
  );

  const x: MotionValue<number> = useTransform(
    progress,
    [0, 0.5, 1],
    keepLitAfterCenter
      ? [direction * 24, 0, 0]
      : [direction * 24, 0, direction * -24],
  );

  const rotate: MotionValue<number> = useTransform(
    progress,
    [0, 0.5, 1],
    keepLitAfterCenter
      ? [direction * 0.75, 0, 0]
      : [direction * 0.75, 0, direction * -0.75],
  );

  return (
    <motion.p
      ref={ref}
      style={{ ...textStyle, opacity, scale, filter, x, rotate }}
    >
      {children}
    </motion.p>
  );
}

export default function TextSpotlightEffect() {
  return (
    <section className="text-[#fafafa]">
      <div className="mx-auto w-[90%] max-w-[500px] py-[20vh] text-center">
        <p style={textStyle}> My growth path</p>

        {steps.map((line, index) => (
          <SpotlightLine key={line.title} direction={index % 2 === 0 ? -1 : 1}>
            <a href={line.href} target="_blank" rel="noopener noreferrer">
              {line.title}
            </a>
          </SpotlightLine>
        ))}
      </div>
    </section>
  );
}
