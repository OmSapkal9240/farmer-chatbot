import React from 'react';
import { motion } from 'framer-motion';

const AnimatedHeadline = ({ text, el: Wrapper = 'h2', className, ...props }) => {
  const sentence = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08,
      },
    },
  };

  const letter = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <Wrapper className={className} aria-label={text} {...props}>
      <motion.span
        variants={sentence}
        initial="hidden"
        animate="visible"
        aria-hidden="true"
      >
        {text.split('').map((char, index) => (
          <motion.span key={char + '-' + index} variants={letter} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
            {char}
          </motion.span>
        ))}
      </motion.span>
    </Wrapper>
  );
};

export default AnimatedHeadline;
