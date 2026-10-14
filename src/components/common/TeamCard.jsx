import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar, Sparkles } from 'lucide-react';
import Button from './Button';

const TeamCard = ({ member }) => {
  return (
    <div className="luxury-card overflow-hidden flex flex-col group h-full">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F2DDE1]/30">
        <img
          src={
            member.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
          }
          alt={member.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {member.experienceYears && (
          <div className="absolute top-3 right-3 bg-[#252124]/85 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1">
            <Award className="w-3 h-3 text-[#D8BE9A]" />
            <span>{member.experienceYears}+ Yrs Craft</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C98F9A] block mb-1">
            {member.role}
          </span>
          <h3 className="font-serif text-2xl font-normal text-[#252124] group-hover:text-[#572A39] transition-colors mb-2">
            {member.name}
          </h3>
          <p className="text-xs text-[#252124]/75 font-light leading-relaxed line-clamp-3 mb-4">
            {member.bio}
          </p>

          {/* Locations badges */}
          {member.assignedLocations?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {member.assignedLocations.map((loc) => (
                <span
                  key={loc._id || loc}
                  className="text-[10px] bg-[#FAF7F2] border border-[#F2DDE1] text-[#572A39] px-2.5 py-0.5 rounded-full font-medium"
                >
                  📍 {loc.name ? loc.name.split('-')[1]?.trim() || loc.name : loc}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-[#F2DDE1]/60 mt-auto">
          <Link to={`/book?artist=${member._id}`} className="w-full block">
            <Button variant="secondary" size="sm" className="w-full">
              <Calendar className="w-3.5 h-3.5 mr-1.5" />
              Book With {member.name.split(' ')[0]}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
