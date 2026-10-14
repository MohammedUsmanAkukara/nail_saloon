import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Sparkles, MapPin } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import ServiceCard from '../../components/services/ServiceCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('sortOrder');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          api.get('/services/categories'),
          api.get('/locations'),
        ]);
        if (catRes.data?.success) setCategories(catRes.data.data);
        if (locRes.data?.success) setLocations(locRes.data.data);
      } catch (err) {
        console.error('Failed to load categories/locations:', err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (selectedLocation) {
          params.locationId = selectedLocation;
        }
        if (searchQuery) {
          params.search = searchQuery;
        }

        const res = await api.get('/services', { params });
        if (res.data?.success) {
          let list = res.data.data;

          // Client-side sort
          if (sortBy === 'priceAsc') {
            list.sort((a, b) => (a.finalPrice || a.basePrice) - (b.finalPrice || b.basePrice));
          } else if (sortBy === 'priceDesc') {
            list.sort((a, b) => (b.finalPrice || b.basePrice) - (a.finalPrice || a.basePrice));
          } else if (sortBy === 'duration') {
            list.sort((a, b) => a.duration - b.duration);
          }

          setServices(list);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory, selectedLocation, searchQuery, sortBy]);

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Treatment Menu"
          title="Curated Nail Services &amp; Artistry"
          subtitle="Explore our comprehensive repertoire of sculpted hard gels, dry Russian manicures, and bespoke editorial nail art."
        />

        {/* Filters & Search Control Bar */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-[#F2DDE1] mb-10 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-[#252124]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search treatments (e.g. Chrome, Sculpted Gel, Pedicure)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#F2DDE1] text-xs sm:text-sm focus:outline-none focus:border-[#572A39] bg-[#FAF7F2]/40"
              />
            </div>

            {/* Location Selector (Location-Specific Pricing) */}
            <div className="md:col-span-4 relative">
              <MapPin className="w-4 h-4 text-[#C98F9A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full pl-10 pr-8 py-2.5 rounded-full border border-[#F2DDE1] text-xs sm:text-sm focus:outline-none focus:border-[#572A39] bg-[#FAF7F2]/40 appearance-none cursor-pointer"
              >
                <option value="">All Salons (Base Pricing)</option>
                {locations.map((loc) => (
                  <option key={loc._id} value={loc._id}>
                    📍 {loc.name} ({loc.city})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-[#F2DDE1] text-xs sm:text-sm focus:outline-none focus:border-[#572A39] bg-[#FAF7F2]/40 cursor-pointer"
              >
                <option value="sortOrder">Featured &amp; Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="duration">Duration: Shortest First</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 no-scrollbar border-t border-[#F2DDE1]/60">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-[#572A39] text-[#FAF7F2]'
                  : 'bg-transparent text-[#252124]/70 hover:bg-[#F2DDE1]/50'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#572A39] text-[#FAF7F2]'
                    : 'bg-transparent text-[#252124]/70 hover:bg-[#F2DDE1]/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <LoadingSpinner text="Fetching treatments..." />
        ) : services.length === 0 ? (
          <EmptyState
            title="No Treatments Found"
            message="No services matched your search or category filter. Try clearing your filters."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
