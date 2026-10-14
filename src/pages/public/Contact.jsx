import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, CheckCircle2, Send } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

const Contact = () => {
  const { settings } = useSettings();
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Bespoke Nail Art Consultation',
    message: '',
    preferredLocation: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await api.get('/locations');
        if (res.data?.success) {
          setLocations(res.data.data);
          if (res.data.data.length > 0) {
            setFormData((prev) => ({ ...prev, preferredLocation: res.data.data[0]._id }));
          }
        }
      } catch (e) {
        // ignore
      }
    };
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    try {
      const res = await api.post('/enquiries', formData);
      if (res.data?.success) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Bespoke Nail Art Consultation',
          message: '',
          preferredLocation: locations[0]?._id || '',
        });
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error submitting your inquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${settings.contactInfo?.whatsappNumber || '919876543210'}?text=${encodeURIComponent('Hello Nail Salon & Spa concierge! I have an inquiry.')}`;

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Concierge Desk"
          title="Connect With Our Salon Atelier"
          subtitle="Whether planning a bridal session, inquiring about custom acrylic sculpting, or booking a private studio suite."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Left Contact Info & Locations */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2DDE1] shadow-sm space-y-6">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#C98F9A] font-semibold block mb-1">
                  Direct Line
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#252124]">
                  Studio Concierge
                </h3>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-[#252124]/80 font-light">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#572A39] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#252124] font-medium">Telephone Concierge:</strong>
                    <a
                      href={`tel:${settings.contactInfo?.phone || '+9102226408901'}`}
                      className="hover:text-[#572A39]"
                    >
                      {settings.contactInfo?.phone || '+91 (022) 2640-8901'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#572A39] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#252124] font-medium">Email Inquiries:</strong>
                    <a
                      href={`mailto:${settings.contactInfo?.email || 'concierge@nailsalonandspa.com'}`}
                      className="hover:text-[#572A39]"
                    >
                      {settings.contactInfo?.email || 'concierge@nailsalonandspa.com'}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#572A39] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[#252124] font-medium">Studio Hours:</strong>
                    <p>{settings.contactInfo?.businessHours || 'Monday – Sunday: 10:00 AM – 08:30 PM'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#F2DDE1]">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="champagne" size="md" className="w-full">
                    <MessageCircle className="w-4 h-4 mr-2 text-[#25D366]" />
                    Instant WhatsApp Concierge
                  </Button>
                </a>
              </div>
            </div>

            {/* Quick Addresses List */}
            <div className="space-y-4">
              <h4 className="font-serif text-xl font-normal text-[#252124]">
                Our Atelier Addresses
              </h4>
              <div className="space-y-3">
                {locations.map((loc) => (
                  <div
                    key={loc._id}
                    className="p-4 rounded-xl bg-[#FAF7F2] border border-[#F2DDE1] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-serif font-medium text-[#572A39]">
                        {loc.name}
                      </strong>
                      <span className="editorial-badge bg-white text-[9px]">{loc.city}</span>
                    </div>
                    <p className="text-[#252124]/70 font-light">{loc.address}</p>
                    <p className="text-[#252124]/60 font-light">Tel: {loc.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#F2DDE1] shadow-sm">
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-widest text-[#C98F9A] font-semibold block mb-1">
                Consultation Request
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#252124]">
                Send An Atelier Message
              </h3>
              <p className="text-xs text-[#252124]/60 font-light mt-1">
                Our front-of-house concierge team will respond within 2 to 4 business hours.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4 bg-[#FAF7F2] rounded-2xl border border-[#F2DDE1] p-8">
                <CheckCircle2 className="w-14 h-14 text-[#572A39] mx-auto" />
                <h4 className="font-serif text-2xl font-normal text-[#252124]">
                  Message Received With Care
                </h4>
                <p className="text-xs sm:text-sm text-[#252124]/75 font-light max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. One of our salon concierges has received your inquiry and will contact you shortly.
                </p>
                <div className="pt-2">
                  <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Note
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    {errorMessage}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Naina Batra"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="naina@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98200 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Preferred Studio
                    </label>
                    <select
                      value={formData.preferredLocation}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredLocation: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39] bg-white cursor-pointer"
                    >
                      <option value="">Any Studio</option>
                      {locations.map((l) => (
                        <option key={l._id} value={l._id}>
                          {l.name} ({l.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the desired nail design, bridal package requirements, or event dates..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={submitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Submit Inquiry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
