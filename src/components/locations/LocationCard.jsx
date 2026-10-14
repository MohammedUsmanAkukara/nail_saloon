import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight } from 'lucide-react';
import Button from '../common/Button';

const LocationCard = ({ location }) => {
  // Extract today's hours
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[new Date().getDay()];
  const todayHours = location.openingHours?.find((h) => h.day === todayName);

  return (
    <div className="luxury-card overflow-hidden flex flex-col group h-full">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#F2DDE1]/30">
        <img
          src={
            location.coverImage ||
            'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'
          }
          alt={location.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span className="editorial-badge bg-[#FAF7F2]/95 backdrop-blur-sm shadow-sm text-[10px] text-[#572A39]">
            {location.city}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div className="space-y-3">
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-[#252124] group-hover:text-[#572A39] transition-colors">
            {location.name}
          </h3>

          <div className="flex items-start gap-2.5 text-xs text-[#252124]/75 font-light">
            <MapPin className="w-4 h-4 text-[#C98F9A] shrink-0 mt-0.5" />
            <p className="line-clamp-2">{location.address}</p>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#252124]/75 font-light">
            <Phone className="w-4 h-4 text-[#C98F9A] shrink-0" />
            <a href={`tel:${location.phone}`} className="hover:text-[#572A39]">
              {location.phone}
            </a>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-[#252124]/75 font-light">
            <Clock className="w-4 h-4 text-[#D8BE9A] shrink-0" />
            <span>
              Today: {todayHours?.isClosed ? 'Closed' : `${todayHours?.open || '10:00 AM'} - ${todayHours?.close || '08:30 PM'}`}
            </span>
          </div>
        </div>

        <div className="pt-5 border-t border-[#F2DDE1]/60 flex items-center justify-between gap-3 mt-6">
          <Link
            to={`/locations/${location.slug}`}
            className="text-xs font-semibold text-[#572A39] hover:underline underline-offset-4 flex items-center gap-1"
          >
            Studio Details
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to={`/book?location=${location._id}`}>
            <Button variant="primary" size="sm">
              Book Here
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
