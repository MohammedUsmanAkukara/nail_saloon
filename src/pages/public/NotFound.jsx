import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <span className="editorial-badge bg-[#F2DDE1] text-[#572A39]">
          <Sparkles className="w-3.5 h-3.5 text-[#D8BE9A]" />
          PAGE NOT FOUND • 404
        </span>
        <h1 className="font-serif text-5xl sm:text-6xl font-normal text-[#252124]">
          A Moment of <span className="italic text-[#572A39]">Stillness.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#252124]/70 font-light leading-relaxed">
          The page or treatment path you are looking for does not exist or may have been relocated in our atelier directory.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <Link to="/">
            <Button variant="primary" size="md">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Homepage
            </Button>
          </Link>
          <Link to="/services">
            <Button variant="secondary" size="md">
              Explore Services
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
