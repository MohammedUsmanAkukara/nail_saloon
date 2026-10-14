import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Sparkles } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import GalleryGrid from '../../components/gallery/GalleryGrid';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import api from '../../services/api';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        if (res.data?.success) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.error('Gallery load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portfolio &amp; Lookbook"
          title="The Nail Art Atelier Collection"
          subtitle="A curated archive of bespoke hard gel extensions, glazed chrome powders, bridal embellishments, and dimensional 3D artwork crafted by our resident artists."
        />

        {loading ? (
          <LoadingSpinner text="Curating artwork..." />
        ) : (
          <GalleryGrid items={items} showFilters={true} />
        )}

        {/* Custom Nail Art Commission Banner */}
        <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-white border border-[#F2DDE1] text-center max-w-3xl mx-auto space-y-4 shadow-sm">
          <span className="editorial-badge bg-[#F2DDE1] text-[#572A39]">
            <Sparkles className="w-3 h-3 text-[#D8BE9A]" />
            CUSTOM COMMISSIONS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#252124]">
            Have an Inspiring Reference in Mind?
          </h2>
          <p className="text-sm text-[#252124]/75 font-light leading-relaxed max-w-xl mx-auto">
            Book an appointment and upload or bring your inspiration photos. Our master artists will tailor the composition specifically to your hand silhouette and nail bed proportions.
          </p>
          <div className="pt-2 flex justify-center">
            <Link to="/book">
              <Button variant="primary" size="lg">
                <Calendar className="w-4 h-4 mr-2" />
                Reserve Nail Art Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
