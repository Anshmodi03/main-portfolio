"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const variants = {
  initial: { clipPath: "inset(0 0 100% 0)" },
  animate: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.7, ease: [0.77, 0, 0.175, 1] } },
  exit: { clipPath: "inset(100% 0 0% 0)", transition: { duration: 0.5, ease: [0.77, 0, 0.175, 1] } },
};

export default function PageTransition({ children }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="page"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="page-transition-wrap"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
