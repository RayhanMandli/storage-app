import { AnimatePresence, motion as Motion } from "framer-motion";

export function PageTransition({ children, pageKey }) {
  return (
    <AnimatePresence mode="wait">
      <Motion.div
        key={pageKey}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        {children}
      </Motion.div>
    </AnimatePresence>
  );
}
