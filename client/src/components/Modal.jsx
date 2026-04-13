import React from 'react';
import * as FramerMotion from 'framer-motion';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', damping: 25, stiffness: 300 },
  },
  exit: { opacity: 0, scale: 0.9, y: 20 },
};

const Modal = ({
  children,
  onClose,
  contentClassName = '',
  overlayClassName = '',
}) => {
  return (
    <FramerMotion.motion.div
      initial='hidden'
      animate='visible'
      exit='exit'
      variants={overlayVariants}
      onClick={onClose}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm ${overlayClassName}`.trim()}
    >
      <FramerMotion.motion.div
        variants={contentVariants}
        onClick={(event) => event.stopPropagation()}
        className={`relative w-full overflow-hidden rounded-[32px] border border-white/10 bg-gray-900 p-8 shadow-2xl md:p-10 sm:w-[450px] ${contentClassName}`.trim()}
      >
        {children}
      </FramerMotion.motion.div>
    </FramerMotion.motion.div>
  );
};

export default Modal;
