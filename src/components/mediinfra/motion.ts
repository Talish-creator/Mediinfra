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
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const staggerContainerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

export const itemFadeUpVariants: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};

export const cardItemVariants: Variants = {
  initial: { opacity: 0, y: 16, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] },
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
