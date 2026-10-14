import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, MessageSquarePlus, X } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import TestimonialCard from '../../components/common/TestimonialCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import api from '../../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Submit Review Form
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    locationName: 'Bandra West, Mumbai',
    serviceName: 'Sculpted Hard Gel Extensions',
    reviewText: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchReviews = async () => {
    try {
      const res = await api.get('/testimonials');
      if (res.data?.success) {
        setReviews(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await api.post('/testimonials', formData);
      if (res.data?.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setModalOpen(false);
          setSubmitSuccess(false);
          setFormData({
            customerName: '',
            rating: 5,
            locationName: 'Bandra West, Mumbai',
            serviceName: 'Sculpted Hard Gel Extensions',
            reviewText: '',
          });
        }, 2000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error submitting review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Guest Endorsements"
          title="Client Reviews &amp; Reflections"
          subtitle="Honest testimonials from our community of bridal clients, creative directors, and discerning regulars."
        />

        {/* Rating Overview Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#F2DDE1] mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="text-center sm:text-left">
              <span className="font-serif text-5xl font-bold text-[#572A39]">4.9</span>
              <div className="flex items-center gap-1 text-[#D8BE9A] my-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current text-[#D8BE9A]" />
                ))}
              </div>
              <p className="text-xs text-[#252124]/60">Based on 180+ verified guest sessions</p>
            </div>
            <div className="hidden sm:block h-16 w-[1px] bg-[#F2DDE1]"></div>
            <div className="hidden sm:block space-y-1 text-xs text-[#252124]/75 font-light">
              <p>✓ 100% Autoclave sterilization compliance</p>
              <p>✓ 7-Day complimentary repair guarantee</p>
              <p>✓ Certified European non-damaging gel formulas</p>
            </div>
          </div>

          <Button variant="primary" size="md" onClick={() => setModalOpen(true)}>
            <MessageSquarePlus className="w-4 h-4 mr-2" />
            Share Your Experience
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving reviews..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((testimonial) => (
              <TestimonialCard key={testimonial._id} testimonial={testimonial} />
            ))}
          </div>
        )}

        {/* Submit Review Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-[#F2DDE1] relative shadow-2xl">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-widest text-[#C98F9A] font-semibold block mb-1">
                  Guest Feedback
                </span>
                <h3 className="font-serif text-2xl font-normal text-[#252124]">
                  Review Your Atelier Visit
                </h3>
              </div>

              {submitSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <CheckCircle className="w-12 h-12 text-[#572A39] mx-auto" />
                  <h4 className="font-serif text-xl font-medium">Thank You For Your Review!</h4>
                  <p className="text-xs text-[#252124]/70 font-light">
                    Your testimonial has been submitted to salon management for moderation and publication.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  {errorMsg && <p className="text-xs text-red-600">{errorMsg}</p>}

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Radhika Merchant"
                      value={formData.customerName}
                      onChange={(e) =>
                        setFormData({ ...formData, customerName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                        Rating *
                      </label>
                      <select
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39] bg-white cursor-pointer"
                      >
                        <option value={5}>5 Stars - Flawless</option>
                        <option value={4}>4 Stars - Very Good</option>
                        <option value={3}>3 Stars - Average</option>
                        <option value={2}>2 Stars - Needs Improvement</option>
                        <option value={1}>1 Star - Dissatisfied</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                        Studio Visited *
                      </label>
                      <select
                        value={formData.locationName}
                        onChange={(e) =>
                          setFormData({ ...formData, locationName: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39] bg-white cursor-pointer"
                      >
                        <option value="Bandra West, Mumbai">Bandra West, Mumbai</option>
                        <option value="Colaba Heritage, Mumbai">Colaba Heritage, Mumbai</option>
                        <option value="Indiranagar Studio, Bengaluru">
                          Indiranagar, Bengaluru
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Service Received
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sculpted Gel Extensions & Glazed Chrome"
                      value={formData.serviceName}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceName: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Review Comments *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Describe the manicure quality, artist precision, and overall atmosphere..."
                      value={formData.reviewText}
                      onChange={(e) =>
                        setFormData({ ...formData, reviewText: e.target.value })
                      }
                      className="w-full p-3 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
                      Submit Review
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
