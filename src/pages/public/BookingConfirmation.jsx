import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  FileText,
  AlertTriangle,
  Search,
} from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

const BookingConfirmation = () => {
  const { reference } = useParams();
  const [searchParams] = useSearchParams();
  const { settings } = useSettings();

  const [booking, setBooking] = useState(null);
  const [lookupRef, setLookupRef] = useState(reference || '');
  const [loading, setLoading] = useState(!!reference);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const fetchBooking = async (refCode) => {
    if (!refCode) return;
    setLoading(true);
    setFeedbackMessage('');
    try {
      const res = await api.get(`/appointments/reference/${refCode.trim()}`);
      if (res.data?.success) {
        setBooking(res.data.data);
        // Confetti celebration if just confirmed
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#572A39', '#C98F9A', '#D8BE9A', '#FAF7F2'],
          });
        } catch (e) {
          // ignore
        }
      }
    } catch (err) {
      setFeedbackMessage(err.response?.data?.message || 'Appointment not found.');
      setBooking(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (reference) {
      fetchBooking(reference);
    }
  }, [reference]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    setCancelling(true);
    try {
      const res = await api.post(`/appointments/reference/${booking.bookingReference}/cancel`, {
        reason: cancelReason || 'Cancelled by guest',
      });
      if (res.data?.success) {
        setBooking(res.data.data);
        setShowCancelModal(false);
        setFeedbackMessage('Your appointment has been cancelled successfully.');
      }
    } catch (err) {
      setFeedbackMessage(err.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(false);
    }
  };

  const whatsappMsg = booking
    ? `Hello Nail Salon & Spa! Regarding my appointment reference ${booking.bookingReference} on ${booking.appointmentDate}.`
    : `Hello Nail Salon & Spa! I need assistance with my booking.`;
  const whatsappUrl = `https://wa.me/${settings.contactInfo?.whatsappNumber || '919876543210'}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="py-12 md:py-20 min-h-[80vh]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Lookup Bar if not directly arriving from confirmation */}
        {!reference && (
          <div className="bg-white p-6 rounded-2xl border border-[#F2DDE1] mb-8 shadow-sm">
            <h3 className="font-serif text-2xl font-normal text-[#252124] mb-2">
              Find Your Appointment
            </h3>
            <p className="text-xs text-[#252124]/60 font-light mb-4">
              Enter your booking reference code (e.g. NAIL-2604-A101) to view status or reschedule.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                fetchBooking(lookupRef);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Enter Booking Reference..."
                value={lookupRef}
                onChange={(e) => setLookupRef(e.target.value.toUpperCase())}
                required
                className="flex-1 px-4 py-2.5 rounded-full border border-[#F2DDE1] text-sm uppercase tracking-wider focus:outline-none focus:border-[#572A39]"
              />
              <Button type="submit" variant="primary" size="md">
                <Search className="w-4 h-4 mr-1.5" />
                Look Up
              </Button>
            </form>
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Retrieving booking confirmation..." />
        ) : booking ? (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F2DDE1] shadow-xl space-y-8">
            {/* Success Header */}
            <div className="text-center space-y-3 pb-6 border-b border-[#F2DDE1]">
              <div className="w-16 h-16 rounded-full bg-[#F2DDE1] text-[#572A39] flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-10 h-10 text-[#572A39]" />
              </div>
              <span className="editorial-badge bg-[#FAF7F2] text-[#572A39]">
                STATUS: {booking.status.toUpperCase()}
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#252124]">
                Your Appointment is Confirmed!
              </h1>
              <p className="text-sm text-[#252124]/75 font-light">
                Booking Reference:{' '}
                <strong className="text-[#572A39] font-mono tracking-wider text-base">
                  {booking.bookingReference}
                </strong>
              </p>
            </div>

            {/* Appointment Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAF7F2] p-6 rounded-2xl border border-[#F2DDE1]">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C98F9A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39] block">
                      Studio Location
                    </span>
                    <h4 className="font-serif text-lg font-medium text-[#252124]">
                      {booking.salonLocation?.name}
                    </h4>
                    <p className="text-xs text-[#252124]/70 font-light mt-0.5">
                      {booking.salonLocation?.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-[#C98F9A] shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39] block">
                      Date &amp; Time
                    </span>
                    <h4 className="font-serif text-lg font-medium text-[#252124]">
                      {new Date(booking.appointmentDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </h4>
                    <p className="text-xs font-semibold text-[#572A39] mt-0.5">
                      {booking.startTime} - {booking.endTime} ({booking.totalDuration} mins)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 md:border-l md:border-[#F2DDE1] md:pl-6">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39] block mb-2">
                    Reserved Rituals
                  </span>
                  <div className="space-y-1.5">
                    {booking.services?.map((s, idx) => (
                      <div key={idx} className="flex justify-between text-xs">
                        <span className="text-[#252124]/85">{s.name}</span>
                        <span className="font-semibold text-[#572A39]">
                          ₹{Number(s.price).toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 mt-2 border-t border-[#F2DDE1] flex justify-between font-serif text-lg font-bold text-[#572A39]">
                    <span>Total Amount:</span>
                    <span>₹{Number(booking.totalPrice).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39] block">
                    Guest Name
                  </span>
                  <p className="text-xs text-[#252124]/80">
                    {booking.customer?.fullName} • {booking.customer?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions & WhatsApp button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#F2DDE1]">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="md">
                  <MessageCircle className="w-4 h-4 mr-2 text-[#25D366]" />
                  Chat With Salon Concierge
                </Button>
              </a>

              {booking.status !== 'cancelled' && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="text-xs font-semibold text-red-600 hover:text-red-800 hover:underline cursor-pointer"
                >
                  Cancel Appointment
                </button>
              )}
            </div>

            {/* Cancellation Modal */}
            {showCancelModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#F2DDE1] space-y-4">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-serif text-xl font-normal">Cancel Reservation?</h3>
                  </div>
                  <p className="text-xs text-[#252124]/70 leading-relaxed font-light">
                    Are you sure you wish to cancel booking{' '}
                    <strong>{booking.bookingReference}</strong>? This slot will immediately be made
                    available to other guests.
                  </p>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-[#572A39] block mb-1">
                      Reason for cancellation:
                    </label>
                    <textarea
                      rows={2}
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="e.g. Schedule conflict..."
                      className="w-full p-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    ></textarea>
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCancelModal(false)}
                      disabled={cancelling}
                    >
                      Keep Booking
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleCancelBooking}
                      isLoading={cancelling}
                    >
                      Confirm Cancellation
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          feedbackMessage && (
            <div className="p-6 bg-red-50 text-red-800 border border-red-200 rounded-2xl text-center text-sm">
              {feedbackMessage}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BookingConfirmation;
