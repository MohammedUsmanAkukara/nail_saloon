import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Calendar, Navigation, ArrowLeft, ArrowRight } from 'lucide-react';
import Button from '../../components/common/Button';
import TeamCard from '../../components/common/TeamCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const LocationDetail = () => {
  const { slug } = useParams();
  const [location, setLocation] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/locations/${slug}`);
        if (res.data?.success) {
          setLocation(res.data.data);
          // Fetch staff for this location
          const staffRes = await api.get(`/staff?locationId=${res.data.data._id}`);
          if (staffRes.data?.success) {
            setStaff(staffRes.data.data);
          }
        }
      } catch (err) {
        console.error('Location load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner text="Retrieving studio details..." />;
  }

  if (!location) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-3xl mb-4">Studio Not Found</h2>
        <Link to="/locations">
          <Button variant="primary">Return to Studios</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/locations"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#572A39] hover:text-[#431E2A] mb-8 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Studios
        </Link>

        {/* Studio Hero Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="editorial-badge bg-[#F2DDE1] text-[#572A39]">
              {location.city} ATELIER
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#252124] leading-tight">
              {location.name}
            </h1>

            <div className="space-y-3 pt-2 text-sm text-[#252124]/80 font-light">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#C98F9A] shrink-0 mt-0.5" />
                <p>{location.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#C98F9A] shrink-0" />
                <a href={`tel:${location.phone}`} className="hover:text-[#572A39]">
                  {location.phone}
                </a>
              </div>
              {location.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#C98F9A] shrink-0" />
                  <a href={`mailto:${location.email}`} className="hover:text-[#572A39]">
                    {location.email}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link to={`/book?location=${location._id}`}>
                <Button variant="primary" size="lg">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book at This Studio
                </Button>
              </Link>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="secondary" size="lg">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#F2DDE1] shadow-xl">
              <img
                src={location.coverImage}
                alt={location.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Opening Hours & Interactive Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
          {/* Schedule */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#F2DDE1] shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Clock className="w-5 h-5 text-[#572A39]" />
              <h3 className="font-serif text-2xl font-normal text-[#252124]">Opening Hours</h3>
            </div>
            <div className="divide-y divide-[#F2DDE1]/60">
              {location.openingHours?.map((item) => (
                <div key={item.day} className="py-2.5 flex justify-between text-xs sm:text-sm">
                  <span className="font-medium text-[#252124]">{item.day}</span>
                  <span className="text-[#252124]/70">
                    {item.isClosed ? (
                      <span className="text-red-500 font-medium">Closed</span>
                    ) : (
                      `${item.open} – ${item.close}`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Embed */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#F2DDE1] overflow-hidden shadow-sm h-[380px]">
            {location.mapEmbedUrl ? (
              <iframe
                title={`Map of ${location.name}`}
                src={location.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#FAF7F2] text-[#252124]/50 text-sm">
                Map coordinates: {location.coordinates?.lat}, {location.coordinates?.lng}
              </div>
            )}
          </div>
        </div>

        {/* Resident Nail Artists */}
        {staff.length > 0 && (
          <div>
            <h3 className="font-serif text-3xl font-normal text-[#252124] mb-8 text-center">
              Resident Artists at {location.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {staff.map((member) => (
                <TeamCard key={member._id} member={member} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationDetail;
