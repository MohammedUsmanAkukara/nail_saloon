import React from 'react';
import { Sparkles } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  title = 'No items found',
  message = 'Try adjusting your filters or search terms.',
  actionText,
  onAction,
}) => {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-2xl border border-[#F2DDE1] max-w-md mx-auto my-8">
      <div className="w-12 h-12 rounded-full bg-[#FAF7F2] text-[#C98F9A] flex items-center justify-center mx-auto mb-4 border border-[#F2DDE1]">
        <Sparkles className="w-6 h-6 text-[#C98F9A]" />
      </div>
      <h3 className="font-serif text-2xl font-normal text-[#252124] mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-[#252124]/70 font-light mb-6 leading-relaxed">
        {message}
      </p>
      {actionText && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
