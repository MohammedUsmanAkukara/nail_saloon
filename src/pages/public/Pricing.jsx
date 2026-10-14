import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Sparkles, MapPin, Check } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const Pricing = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, servRes, locRes] = await Promise.all([
          api.get('/services/categories'),
          api.get('/services'),
          api.get('/locations'),
        ]);

        if (catRes.data?.success) setCategories(catRes.data.data);
        if (servRes.data?.success) setServices(servRes.data.data);
        if (locRes.data?.success) setLocations(locRes.data.data);
      } catch (err) {
        console.error('Pricing data load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Transparent Luxury"
          title="Treatment Menu &amp; Pricing Directory"
          subtitle="All treatments include single-use files, diamond burr sanitization, and complimentary artisanal refreshments."
        />

        {/* Location selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#F2DDE1] mb-12 shadow-sm">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#252124]">
            <MapPin className="w-4 h-4 text-[#C98F9A]" />
            <span className="font-medium">Display pricing for salon studio:</span>
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 rounded-full border border-[#F2DDE1] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-none focus:border-[#572A39] cursor-pointer"
          >
            <option value="">Base Atelier Pricing</option>
            {locations.map((loc) => (
              <option key={loc._id} value={loc._id}>
                {loc.name} ({loc.city})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <LoadingSpinner text="Compiling treatment rates..." />
        ) : (
          <div className="space-y-12">
            {categories.map((category) => {
              const catServices = services.filter(
                (s) => s.category?._id === category._id || s.category === category._id
              );

              if (!catServices.length) return null;

              return (
                <div key={category._id} className="bg-white rounded-2xl p-6 sm:p-8 border border-[#F2DDE1] shadow-sm">
                  <div className="border-b border-[#F2DDE1] pb-4 mb-6">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#C98F9A] block mb-1">
                      Category
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#252124]">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-xs sm:text-sm text-[#252124]/70 font-light mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>

                  <div className="divide-y divide-[#F2DDE1]/60">
                    {catServices.map((service) => {
                      let displayPrice = service.basePrice;
                      if (selectedLocation && service.locationPricing?.length) {
                        const override = service.locationPricing.find(
                          (lp) => lp.location?.toString() === selectedLocation.toString()
                        );
                        if (override) displayPrice = override.price;
                      }

                      return (
                        <div
                          key={service._id}
                          className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/services/${service.slug}`}
                                className="font-serif text-lg sm:text-xl font-normal text-[#252124] group-hover:text-[#572A39] transition-colors"
                              >
                                {service.name}
                              </Link>
                              {service.featured && (
                                <span className="text-[9px] bg-[#F2DDE1] text-[#572A39] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                                  Signature
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#252124]/60 font-light mt-1 line-clamp-1 max-w-lg">
                              {service.shortDescription}
                            </p>
                          </div>

                          <div className="flex items-center gap-6 shrink-0 self-end sm:self-center">
                            <span className="text-xs text-[#252124]/50 flex items-center gap-1 font-light">
                              <Clock className="w-3.5 h-3.5 text-[#C98F9A]" />
                              {service.duration} mins
                            </span>
                            <span className="font-serif text-xl font-semibold text-[#572A39] min-w-[70px] text-right">
                              ₹{Number(displayPrice).toLocaleString('en-IN')}
                            </span>
                            <Link to={`/book?service=${service._id}`}>
                              <Button variant="primary" size="sm">
                                Book
                              </Button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Transparent Guarantee Cards */}
        <div className="mt-16 bg-[#FAF7F2] border border-[#F2DDE1] rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-normal text-[#252124]">
              Zero Surprise Surcharges
            </h4>
            <p className="text-xs text-[#252124]/70 font-light leading-relaxed">
              Cuticle prep, nail shaping, and take-home cuticle oils are integrated into the price.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-normal text-[#252124]">
              7-Day Longevity Warranty
            </h4>
            <p className="text-xs text-[#252124]/70 font-light leading-relaxed">
              If any gel extension chips or lifts within 7 days, our studio will fix it compliantly free.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-serif text-lg font-normal text-[#252124]">
              Custom Art Consultations
            </h4>
            <p className="text-xs text-[#252124]/70 font-light leading-relaxed">
              Bring your Pinterest boards! We provide a free 10-minute design alignment before polishing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
