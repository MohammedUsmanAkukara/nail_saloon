import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Sparkles, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const ServiceCard = ({ service }) => {
  const priceDisplay = service.finalPrice !== undefined ? service.finalPrice : service.basePrice;

  return (
    <div className="luxury-card overflow-hidden flex flex-col group h-full">
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#F2DDE1]/30">
        <img
          src={
            service.coverImage ||
            'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'
          }
          alt={service.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {service.featured && (
          <div className="absolute top-3 left-3">
            <span className="editorial-badge bg-[#FAF7F2]/90 backdrop-blur-sm shadow-sm text-[10px] text-[#572A39]">
              <Sparkles className="w-3 h-3 text-[#D8BE9A]" />
              Signature
            </span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-[#252124]/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#D8BE9A]" />
          <span>{service.duration} mins</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          {service.category?.name && (
            <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#C98F9A] mb-1.5 block">
              {service.category.name}
            </span>
          )}
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#252124] group-hover:text-[#572A39] transition-colors line-clamp-1 mb-2">
            {service.name}
          </h3>
          <p className="text-xs sm:text-sm text-[#252124]/70 font-light line-clamp-2 leading-relaxed mb-4">
            {service.shortDescription}
          </p>
        </div>

        <div className="pt-4 border-t border-[#F2DDE1]/60 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#252124]/50 block">
              Starting From
            </span>
            <span className="font-serif text-lg font-semibold text-[#572A39]">
              ₹{Number(priceDisplay).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/services/${service.slug}`}
              className="text-xs font-semibold text-[#572A39] hover:text-[#431E2A] flex items-center gap-1 hover:underline underline-offset-4 py-2 px-1"
            >
              Details
            </Link>
            <Link to={`/book?service=${service._id}`}>
              <Button variant="primary" size="sm">
                Book
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
