import React, { useState, useEffect } from 'react';
import SectionHeading from '../../components/common/SectionHeading';
import LocationCard from '../../components/locations/LocationCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/locations');
        if (res.data?.success) {
          setLocations(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load locations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  const cities = ['All', ...new Set(locations.map((l) => l.city))];
  const filtered =
    selectedCity === 'All' ? locations : locations.filter((l) => l.city === selectedCity);

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Our Boutiques"
          title="Ateliers in Premier Neighborhoods"
          subtitle="Designed with soft lighting, architectural limestone, custom velvet loungers, and unhurried appointment paces."
        />

        {/* City Filter Pills */}
        <div className="flex justify-center gap-3 mb-12">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer ${
                selectedCity === city
                  ? 'bg-[#572A39] text-[#FAF7F2] shadow-sm'
                  : 'bg-white border border-[#F2DDE1] text-[#252124]/70 hover:border-[#572A39]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text="Locating studios..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((location) => (
              <LocationCard key={location._id} location={location} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Locations;
