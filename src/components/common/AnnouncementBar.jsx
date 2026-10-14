import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const AnnouncementBar = () => {
  const { settings, announcementVisible, dismissAnnouncement } = useSettings();

  if (!announcementVisible) return null;

  return (
    <div className="bg-[#572A39] text-[#FAF7F2] text-xs py-2 px-4 transition-all duration-300 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D8BE9A] animate-pulse shrink-0" />
          <span className="font-light tracking-wide">
            {settings.announcement?.text || 'Your next nail obsession starts here.'}
          </span>
          {settings.announcement?.link && (
            <Link
              to={settings.announcement.link}
              className="underline underline-offset-4 font-medium text-[#D8BE9A] hover:text-white transition-colors ml-1"
            >
              Reserve Now
            </Link>
          )}
        </div>
        <button
          onClick={dismissAnnouncement}
          aria-label="Dismiss announcement"
          className="text-[#FAF7F2]/60 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
