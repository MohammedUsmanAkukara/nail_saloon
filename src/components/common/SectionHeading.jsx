import React from 'react';
import { motion } from 'framer-motion';

const SectionHeading = ({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}) => {
  const alignClass = {
    center: 'text-center mx-auto',
    left: 'text-left',
    right: 'text-right ml-auto',
  }[align];

  return (
    <div className={`max-w-3xl mb-12 md:mb-16 ${alignClass} ${className}`}>
      {eyebrow && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 mb-3"
        >
          <span className="w-6 h-[1px] bg-[#C98F9A]"></span>
          <span
            className={`text-xs uppercase tracking-[0.2em] font-semibold ${
              light ? 'text-[#FAF7F2]/80' : 'text-[#C98F9A]'
            }`}
          >
            {eyebrow}
          </span>
          <span className="w-6 h-[1px] bg-[#C98F9A]"></span>
        </motion.div>
      )}

      {title && (
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`font-serif text-3xl sm:text-4xl md:text-5xl font-normal leading-[1.15] mb-4 ${
            light ? 'text-[#FAF7F2]' : 'text-[#252124]'
          }`}
        >
          {title}
        </motion.h2>
      )}

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-base md:text-lg font-light leading-relaxed ${
            light ? 'text-[#FAF7F2]/70' : 'text-[#252124]/70'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionHeading;
