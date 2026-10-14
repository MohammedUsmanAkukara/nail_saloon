import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, CheckCircle, ShieldCheck, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import ServiceCard from '../../components/services/ServiceCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

const ServiceDetail = () => {
  const { slug } = useParams();
  const { settings } = useSettings();
  const [service, setService] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/services/${slug}`);
        if (res.data?.success) {
          setService(res.data.data);
          setRelated(res.data.related || []);
          setActiveImage(res.data.data.coverImage);
        }
      } catch (err) {
        console.error('Service load error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner text="Retrieving service details..." />;
  }

  if (!service) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-3xl mb-4">Treatment Not Found</h2>
        <Link to="/services">
          <Button variant="primary">Return to Services</Button>
        </Link>
      </div>
    );
  }

  const whatsappMsg = `Hello Nail Salon & Spa! I would like to inquire about booking '${service.name}'.`;
  const whatsappUrl = `https://wa.me/${settings.contactInfo?.whatsappNumber || '919876543210'}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/services"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#572A39] hover:text-[#431E2A] mb-8 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Treatment Menu
        </Link>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 items-start">
          {/* Left Images Column */}
          <div className="lg:col-span-6 space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#F2DDE1] shadow-lg bg-white">
              <img
                src={activeImage || service.coverImage}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Gallery Thumbnails */}
            {service.galleryImages?.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                <button
                  onClick={() => setActiveImage(service.coverImage)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                    activeImage === service.coverImage
                      ? 'border-[#572A39]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={service.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                </button>
                {service.galleryImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 cursor-pointer ${
                      activeImage === img
                        ? 'border-[#572A39]'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`View ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Service Content Column */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="editorial-badge bg-[#F2DDE1] text-[#572A39] mb-3">
                {service.category?.name || 'Signature Service'}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#252124] leading-tight mt-2">
                {service.name}
              </h1>
            </div>

            {/* Pricing & Duration Banner */}
            <div className="flex items-center gap-6 p-4 rounded-xl bg-white border border-[#F2DDE1]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#252124]/50 block">
                  Starting Price
                </span>
                <span className="font-serif text-3xl font-semibold text-[#572A39]">
                  ₹{Number(service.basePrice).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="h-8 w-[1px] bg-[#F2DDE1]"></div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#252124]/80">
                <Clock className="w-4 h-4 text-[#C98F9A]" />
                <span>Estimated: <strong>{service.duration} mins</strong></span>
              </div>
            </div>

            {/* Full Description */}
            <div className="space-y-4 text-sm sm:text-base text-[#252124]/80 font-light leading-relaxed">
              <p>{service.shortDescription}</p>
              {service.fullDescription && <p>{service.fullDescription}</p>}
            </div>

            {/* Included Highlights */}
            {service.includedHighlights?.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs uppercase tracking-widest font-semibold text-[#C98F9A] mb-3">
                  Treatment Inclusions:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {service.includedHighlights.map((hl, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#252124]/85">
                      <CheckCircle className="w-4 h-4 text-[#572A39] shrink-0" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location Pricing Transparency */}
            {service.locationPricing?.length > 0 && (
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#F2DDE1]">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#572A39] mb-2">
                  Studio-Specific Rates:
                </h4>
                <div className="space-y-1 text-xs text-[#252124]/75">
                  {service.locationPricing.map((lp, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{lp.location?.name || 'Boutique Studio'}:</span>
                      <span className="font-medium text-[#572A39]">
                        ₹{Number(lp.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Link to={`/book?service=${service._id}`} className="flex-1">
                <Button variant="primary" size="lg" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reserve This Service
                </Button>
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
              >
                <Button variant="secondary" size="lg" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2 text-[#25D366]" />
                  Inquire on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Related Treatments */}
        {related.length > 0 && (
          <div className="border-t border-[#F2DDE1] pt-16">
            <h3 className="font-serif text-2xl sm:text-3xl text-center mb-8">
              Complementary Rituals
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((item) => (
                <ServiceCard key={item._id} service={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
