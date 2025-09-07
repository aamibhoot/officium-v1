"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

// Parent container orchestrates children
const parentVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "beforeChildren",
      staggerChildren: 0.1,
      delayChildren: 0.2, // slight pause before children animate
      delay: 0.15,        // slight pause for empty canvas effect
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25,
      when: "afterChildren",
    },
  },
};

// Child variants for content inside pages
const childVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.3 } 
  },
  exit: { 
    opacity: 0, 
    y: -10, 
    transition: { duration: 0.2 } 
  },
};

export default function PageTransitionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={parentVariants}
        style={{ transformOrigin: "top center" }}
      >
        <motion.div variants={childVariants}>{children}</motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
