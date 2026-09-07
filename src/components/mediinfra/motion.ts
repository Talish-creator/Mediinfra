import type { Transition, Variants } from "framer-motion";

export const springSlow: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 18,
  mass: 1,
};

export const springMedium: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
  mass: 0.8,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

export const pageFadeVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: [0.25, 1, 0.5, 1] },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

export const itemFadeUpVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] },
  },
};

export const cardHoverMotion = {
  whileHover: { y: -2, transition: { duration: 0.18, ease: "easeOut" } },
  whileTap: { scale: 0.99, transition: { duration: 0.08 } },
};

export const buttonPressMotion = {
  whileHover: { scale: 1.02, transition: { duration: 0.12 } },
  whileTap: { scale: 0.97, transition: { duration: 0.08 } },
};

export const pulseBadgeVariants: Variants = {
  animate: {
    scale: [1, 1.08, 1],
    opacity: [0.9, 1, 0.9],
    transition: {
      duration: 2.2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
