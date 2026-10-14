import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="luxury-card p-6 md:p-8 flex flex-col justify-between h-full bg-white relative">
      <div className="absolute top-6 right-6 text-[#F2DDE1]">
        <Quote className="w-10 h-10 opacity-60" />
      </div>

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4 text-[#D8BE9A]">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (testimonial.rating || 5)
                  ? 'fill-[#D8BE9A] text-[#D8BE9A]'
                  : 'text-gray-200'
              }`}
            />
          ))}
        </div>

        <p className="font-serif text-lg md:text-xl font-normal text-[#252124] italic leading-relaxed mb-6">
          "{testimonial.reviewText}"
        </p>
      </div>

      <div className="pt-4 border-t border-[#F2DDE1]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {testimonial.avatar ? (
            <img
              src={testimonial.avatar}
              alt={testimonial.customerName}
              className="w-10 h-10 rounded-full object-cover border border-[#C98F9A]/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#F2DDE1] text-[#572A39] flex items-center justify-center font-serif font-bold text-sm">
              {testimonial.customerName?.charAt(0) || 'C'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-semibold text-[#252124]">
                {testimonial.customerName}
              </h4>
              {testimonial.verified && (
                <span className="text-[10px] text-[#572A39] bg-[#F2DDE1] px-1.5 py-0.2 rounded-full font-medium inline-flex items-center gap-0.5" title="Verified Sobo Appointment">
                  <CheckCircle className="w-2.5 h-2.5 text-[#572A39]" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#252124]/60 font-light">
              {testimonial.locationName} • {testimonial.serviceName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
