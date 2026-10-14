import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Sparkles,
  UserCheck,
  Calendar as CalendarIcon,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Check,
} from 'lucide-react';
import Button from '../../components/common/Button';
import SectionHeading from '../../components/common/SectionHeading';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

const STEPS = [
  { id: 1, title: 'Salon Location' },
  { id: 2, title: 'Services' },
  { id: 3, title: 'Nail Artist' },
  { id: 4, title: 'Date & Time' },
  { id: 5, title: 'Your Details' },
  { id: 6, title: 'Review & Confirm' },
];

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [staffList, setStaffList] = useState([]);

  // Selections
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || '');
  const [selectedServices, setSelectedServices] = useState(
    searchParams.get('service') ? [searchParams.get('service')] : []
  );
  const [selectedStaff, setSelectedStaff] = useState(searchParams.get('artist') || '');

  // Calendar & Slot selection
  const [selectedDate, setSelectedDate] = useState(() => {
    // Tomorrow by default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  // Customer Form
  const [customer, setCustomer] = useState({
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // 1. Initial Load of Locations, Services, Staff
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [locRes, servRes, staffRes] = await Promise.all([
          api.get('/locations'),
          api.get('/services'),
          api.get('/staff'),
        ]);

        if (locRes.data?.success) {
          setLocations(locRes.data.data);
          if (!selectedLocation && locRes.data.data.length > 0) {
            setSelectedLocation(locRes.data.data[0]._id);
          }
        }
        if (servRes.data?.success) setServices(servRes.data.data);
        if (staffRes.data?.success) setStaffList(staffRes.data.data);
      } catch (err) {
        console.error('Failed to load initial booking data:', err);
      }
    };

    fetchInitialData();
  }, []);

  // Filter staff by selected location
  const availableStaffForLocation = staffList.filter((s) =>
    selectedLocation ? s.assignedLocations?.some((l) => (l._id || l) === selectedLocation) : true
  );

  // Calculate totals
  const chosenServicesData = services.filter((s) => selectedServices.includes(s._id));
  const totalDuration = chosenServicesData.reduce((acc, curr) => acc + (curr.duration || 45), 0);
  const totalPrice = chosenServicesData.reduce((acc, curr) => {
    const override = curr.locationPricing?.find(
      (lp) => (lp.location?._id || lp.location) === selectedLocation
    );
    return acc + (override ? override.price : curr.basePrice);
  }, 0);

  // 2. Fetch Availability when Location, Services, Date, or Staff change
  useEffect(() => {
    if (currentStep !== 4 || !selectedLocation || selectedServices.length === 0 || !selectedDate) {
      return;
    }

    const fetchSlots = async () => {
      setSlotsLoading(true);
      setAvailabilityMessage('');
      try {
        const params = {
          salonLocationId: selectedLocation,
          date: selectedDate,
          serviceIds: selectedServices.join(','),
        };
        if (selectedStaff) {
          params.staffId = selectedStaff;
        }

        const res = await api.get('/appointments/availability', { params });
        if (res.data?.success) {
          const avail = res.data.data;
          if (avail.available) {
            setAvailableSlots(avail.slots || []);
            if (!avail.slots.includes(selectedSlot)) {
              setSelectedSlot(avail.slots[0] || '');
            }
          } else {
            setAvailableSlots([]);
            setSelectedSlot('');
            setAvailabilityMessage(avail.reason || 'No available slots for this date.');
          }
        }
      } catch (err) {
        setAvailableSlots([]);
        setSelectedSlot('');
        setAvailabilityMessage(err.response?.data?.message || 'Error fetching available times.');
      } finally {
        setSlotsLoading(false);
      }
    };

    fetchSlots();
  }, [currentStep, selectedLocation, selectedServices, selectedDate, selectedStaff]);

  // Validation before going to next step
  const handleNext = () => {
    setBookingError('');

    if (currentStep === 1) {
      if (!selectedLocation) {
        setBookingError('Please select a salon location.');
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (selectedServices.length === 0) {
        setBookingError('Please select at least one treatment to continue.');
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!selectedSlot) {
        setBookingError('Please select an available appointment time slot.');
        return;
      }
      setCurrentStep(5);
    } else if (currentStep === 5) {
      const errors = {};
      if (!customer.fullName.trim()) errors.fullName = 'Full name is required';
      if (!customer.email.trim() || !/^\S+@\S+\.\S+$/.test(customer.email)) {
        errors.email = 'Valid email is required';
      }
      if (!customer.phone.trim() || customer.phone.length < 8) {
        errors.phone = 'Valid phone number is required';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    setBookingError('');
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Final Confirmation Submission
  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setBookingError('');

    try {
      const payload = {
        salonLocationId: selectedLocation,
        serviceIds: selectedServices,
        staffId: selectedStaff || null,
        appointmentDate: selectedDate,
        startTime: selectedSlot,
        customer,
        customerNotes: customer.notes,
      };

      const res = await api.post('/appointments', payload);
      if (res.data?.success) {
        const booking = res.data.data;
        navigate(`/booking/confirmation/${booking.bookingReference}`);
      }
    } catch (err) {
      setBookingError(
        err.response?.data?.message ||
          'Failed to complete reservation. The slot might have been taken. Please select another slot.'
      );
      if (err.response?.status === 409) {
        // Slot collision! Send back to step 4
        setCurrentStep(4);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      if (selectedServices.length === 1) return; // Keep at least one
      setSelectedServices(selectedServices.filter((sId) => sId !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  // Next 14 dates generator
  const getUpcomingDates = () => {
    const list = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      list.push({ iso, weekday, dayNum, month });
    }
    return list;
  };

  return (
    <div className="py-12 md:py-20 min-h-screen bg-[#FAF7F2]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Online Concierge"
          title="Reserve Your Salon Experience"
          subtitle="Select your preferred salon studio, tailored rituals, artist, and timing."
        />

        {/* Multi-step progress indicator */}
        <div className="mb-10 overflow-x-auto no-scrollbar pb-2">
          <div className="flex items-center justify-between min-w-[500px]">
            {STEPS.map((step, idx) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      currentStep === step.id
                        ? 'bg-[#572A39] text-[#FAF7F2] ring-4 ring-[#F2DDE1]'
                        : currentStep > step.id
                        ? 'bg-[#D8BE9A] text-[#252124]'
                        : 'bg-white border border-[#F2DDE1] text-[#252124]/40'
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold mt-2 whitespace-nowrap ${
                      currentStep === step.id ? 'text-[#572A39]' : 'text-[#252124]/50'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-[2px] mx-2 -mt-5 ${
                      currentStep > step.id ? 'bg-[#D8BE9A]' : 'bg-[#F2DDE1]'
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Global Error Banner */}
        {bookingError && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{bookingError}</span>
          </div>
        )}

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#F2DDE1] shadow-sm mb-8">
          {/* STEP 1: SELECT SALON LOCATION */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-serif text-2xl font-normal text-[#252124] mb-2">
                1. Select Your Salon Location
              </h3>
              <p className="text-xs text-[#252124]/60 font-light mb-6">
                Choose the salon studio you would like to visit for your appointment.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {locations.map((loc) => (
                  <div
                    key={loc._id}
                    onClick={() => setSelectedLocation(loc._id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedLocation === loc._id
                        ? 'border-[#572A39] bg-[#FAF7F2]'
                        : 'border-[#F2DDE1] hover:border-[#C98F9A] bg-white'
                    }`}
                  >
                    <span className="editorial-badge bg-[#F2DDE1] text-[#572A39] text-[9px] mb-2">
                      {loc.city}
                    </span>
                    <h4 className="font-serif text-lg font-medium text-[#252124] mb-1">
                      {loc.name}
                    </h4>
                    <p className="text-xs text-[#252124]/70 font-light line-clamp-2">
                      {loc.address}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: SELECT SERVICES */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-[#252124] mb-1">
                    2. Select Your Services &amp; Rituals
                  </h3>
                  <p className="text-xs text-[#252124]/60 font-light">
                    You can select multiple treatments (e.g. Gel Extensions + Glazed Chrome Art).
                  </p>
                </div>
                {/* Running total tag */}
                <div className="text-right">
                  <span className="text-[10px] uppercase text-[#252124]/50 font-semibold block">
                    Estimated Total
                  </span>
                  <span className="font-serif text-xl font-bold text-[#572A39]">
                    ₹{totalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-[#252124]/60 block font-light">
                    ({totalDuration} mins)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-1">
                {services.map((serv) => {
                  const isSelected = selectedServices.includes(serv._id);
                  const override = serv.locationPricing?.find(
                    (lp) => (lp.location?._id || lp.location) === selectedLocation
                  );
                  const price = override ? override.price : serv.basePrice;

                  return (
                    <div
                      key={serv._id}
                      onClick={() => toggleService(serv._id)}
                      className={`p-4 rounded-2xl border-2 flex items-start gap-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#572A39] bg-[#FAF7F2]'
                          : 'border-[#F2DDE1] hover:border-[#C98F9A] bg-white'
                      }`}
                    >
                      <img
                        src={serv.coverImage}
                        alt={serv.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <h4 className="font-serif text-base font-medium text-[#252124]">
                            {serv.name}
                          </h4>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-1 accent-[#572A39]"
                          />
                        </div>
                        <p className="text-[11px] text-[#252124]/65 font-light line-clamp-1 mt-0.5">
                          {serv.shortDescription}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs">
                          <span className="font-semibold text-[#572A39]">
                            ₹{Number(price).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[#252124]/50 flex items-center gap-1 font-light">
                            <Clock className="w-3 h-3 text-[#C98F9A]" />
                            {serv.duration} mins
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: SELECT NAIL ARTIST */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-serif text-2xl font-normal text-[#252124] mb-2">
                3. Select Preferred Nail Artist
              </h3>
              <p className="text-xs text-[#252124]/60 font-light mb-6">
                Choose a specific master technician or select "Any Available Artist" for maximum scheduling flexibility.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Any Artist Option */}
                <div
                  onClick={() => setSelectedStaff('')}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                    selectedStaff === ''
                      ? 'border-[#572A39] bg-[#FAF7F2]'
                      : 'border-[#F2DDE1] hover:border-[#C98F9A] bg-white'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-[#572A39] text-[#FAF7F2] flex items-center justify-center font-serif text-lg font-bold shrink-0">
                    ✨
                  </div>
                  <div>
                    <h4 className="font-serif text-lg font-normal text-[#252124]">
                      Any Available Artist
                    </h4>
                    <p className="text-xs text-[#252124]/60 font-light">
                      Assigned to first available technician
                    </p>
                  </div>
                </div>

                {/* Specific Staff */}
                {availableStaffForLocation.map((st) => (
                  <div
                    key={st._id}
                    onClick={() => setSelectedStaff(st._id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                      selectedStaff === st._id
                        ? 'border-[#572A39] bg-[#FAF7F2]'
                        : 'border-[#F2DDE1] hover:border-[#C98F9A] bg-white'
                    }`}
                  >
                    <img
                      src={st.avatar}
                      alt={st.name}
                      className="w-14 h-14 rounded-full object-cover shrink-0 border border-[#C98F9A]/30"
                    />
                    <div>
                      <h4 className="font-serif text-lg font-normal text-[#252124]">
                        {st.name}
                      </h4>
                      <p className="text-[11px] text-[#C98F9A] uppercase tracking-wider font-semibold">
                        {st.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: SELECT DATE & TIME */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-serif text-2xl font-normal text-[#252124] mb-2">
                4. Select Date &amp; Time
              </h3>
              <p className="text-xs text-[#252124]/60 font-light mb-6">
                Our booking engine validates slot collisions, salon operating hours, and technician working schedules.
              </p>

              {/* Date Horizontal Carousel */}
              <div className="mb-8">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-3">
                  Appointment Date:
                </label>
                <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
                  {getUpcomingDates().map((item) => (
                    <button
                      key={item.iso}
                      type="button"
                      onClick={() => setSelectedDate(item.iso)}
                      className={`p-3 rounded-2xl border min-w-[75px] text-center transition-all cursor-pointer ${
                        selectedDate === item.iso
                          ? 'border-[#572A39] bg-[#572A39] text-[#FAF7F2] shadow-sm'
                          : 'border-[#F2DDE1] bg-white text-[#252124] hover:border-[#572A39]'
                      }`}
                    >
                      <span className="text-[10px] uppercase tracking-widest block font-medium opacity-80">
                        {item.weekday}
                      </span>
                      <span className="font-serif text-xl font-bold block my-0.5">
                        {item.dayNum}
                      </span>
                      <span className="text-[10px] uppercase font-light block opacity-80">
                        {item.month}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slots Section */}
              <div>
                <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-3">
                  Available Start Time ({totalDuration} mins required):
                </label>

                {slotsLoading ? (
                  <LoadingSpinner size="sm" text="Checking real-time calendar availability..." />
                ) : availableSlots.length === 0 ? (
                  <div className="p-6 text-center bg-[#FAF7F2] rounded-2xl border border-[#F2DDE1]">
                    <Clock className="w-8 h-8 text-[#C98F9A] mx-auto mb-2" />
                    <p className="text-sm font-medium text-[#252124]">
                      {availabilityMessage || 'No open appointments found for this date.'}
                    </p>
                    <p className="text-xs text-[#252124]/60 font-light mt-1">
                      Please pick another date or select 'Any Available Artist'.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                          selectedSlot === slot
                            ? 'bg-[#572A39] text-[#FAF7F2] shadow-sm'
                            : 'bg-white border border-[#F2DDE1] text-[#252124] hover:border-[#572A39]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 5: CUSTOMER DETAILS */}
          {currentStep === 5 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-serif text-2xl font-normal text-[#252124] mb-2">
                5. Guest Details
              </h3>
              <p className="text-xs text-[#252124]/60 font-light mb-6">
                Please provide your contact information to receive appointment confirmation details.
              </p>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#C98F9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Ayesha Mehra"
                      value={customer.fullName}
                      onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F2DDE1] text-sm focus:outline-none focus:border-[#572A39] bg-[#FAF7F2]/40"
                    />
                  </div>
                  {formErrors.fullName && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#C98F9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="ayesha@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F2DDE1] text-sm focus:outline-none focus:border-[#572A39] bg-[#FAF7F2]/40"
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#C98F9A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="+91 98200 12345"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F2DDE1] text-sm focus:outline-none focus:border-[#572A39] bg-[#FAF7F2]/40"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-[11px] text-red-600 mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Notes or Preferences (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-[#C98F9A] absolute left-3.5 top-3" />
                    <textarea
                      rows={3}
                      placeholder="e.g. Bringing inspiration photo for glazed chrome finish, sensitive cuticles..."
                      value={customer.notes}
                      onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#F2DDE1] text-sm focus:outline-none focus:border-[#572A39] bg-[#FAF7F2]/40"
                    ></textarea>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 6: REVIEW & CONFIRM */}
          {currentStep === 6 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h3 className="font-serif text-2xl font-normal text-[#252124] mb-2">
                6. Review Your Reservation
              </h3>
              <p className="text-xs text-[#252124]/60 font-light mb-6">
                Please review your selected services, timing, and contact details before confirming.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#FAF7F2] border border-[#F2DDE1]">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39] block">
                      Salon Studio
                    </span>
                    <p className="font-serif text-lg font-medium text-[#252124]">
                      {locations.find((l) => l._id === selectedLocation)?.name}
                    </p>
                    <p className="text-xs text-[#252124]/70 font-light">
                      {locations.find((l) => l._id === selectedLocation)?.address}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39] block">
                      Date &amp; Time
                    </span>
                    <p className="font-serif text-lg font-medium text-[#252124]">
                      {new Date(selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-xs text-[#572A39] font-semibold">
                      {selectedSlot} ({totalDuration} mins duration)
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39] block">
                      Artist
                    </span>
                    <p className="text-sm font-medium text-[#252124]">
                      {selectedStaff
                        ? staffList.find((s) => s._id === selectedStaff)?.name
                        : 'Any Available Master Artist'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 md:border-l md:border-[#F2DDE1] md:pl-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39] block mb-2">
                      Selected Rituals
                    </span>
                    <div className="space-y-2">
                      {chosenServicesData.map((s) => {
                        const override = s.locationPricing?.find(
                          (lp) => (lp.location?._id || lp.location) === selectedLocation
                        );
                        const price = override ? override.price : s.basePrice;
                        return (
                          <div key={s._id} className="flex justify-between text-xs">
                            <span className="text-[#252124]/85">{s.name}</span>
                            <span className="font-semibold text-[#572A39]">
                              ₹{Number(price).toLocaleString('en-IN')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="pt-3 mt-3 border-t border-[#F2DDE1] flex justify-between font-serif text-xl font-bold text-[#572A39]">
                      <span>Total Amount:</span>
                      <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#572A39] block">
                      Guest Contact
                    </span>
                    <p className="text-xs text-[#252124]/80 mt-1">
                      {customer.fullName} • {customer.phone}
                    </p>
                    <p className="text-xs text-[#252124]/80">{customer.email}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="mt-8 pt-6 border-t border-[#F2DDE1] flex items-center justify-between">
            {currentStep > 1 ? (
              <Button variant="secondary" size="md" onClick={handleBack} disabled={isSubmitting}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous Step
              </Button>
            ) : (
              <div></div>
            )}

            {currentStep < 6 ? (
              <Button variant="primary" size="md" onClick={handleNext}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                variant="primary"
                size="lg"
                onClick={handleConfirmBooking}
                isLoading={isSubmitting}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Appointment (₹{totalPrice.toLocaleString('en-IN')})
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
