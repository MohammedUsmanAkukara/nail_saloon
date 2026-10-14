import React, { useState } from 'react';
import { Gift, Sparkles, CheckCircle2, Search, ArrowRight, ShieldCheck } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';
import api from '../../services/api';

const DENOMINATIONS = [2500, 5000, 10000, 15000];

const GiftCards = () => {
  // Purchase form state
  const [denomination, setDenomination] = useState(5000);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [purchasedCard, setPurchasedCard] = useState(null);
  const [purchaseError, setPurchaseError] = useState('');

  // Balance Check state
  const [checkCode, setCheckCode] = useState('');
  const [cardDetails, setCardDetails] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkError, setCheckError] = useState('');

  const handlePurchase = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setPurchaseError('');
    try {
      const res = await api.post('/gift-cards/purchase', {
        denomination,
        recipientName,
        recipientEmail,
        senderName,
        senderEmail,
        message,
      });
      if (res.data?.success) {
        setPurchasedCard(res.data.data);
      }
    } catch (err) {
      setPurchaseError(err.response?.data?.message || 'Error processing gift card enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckBalance = async (e) => {
    e.preventDefault();
    if (!checkCode) return;
    setChecking(true);
    setCheckError('');
    setCardDetails(null);
    try {
      const res = await api.get(`/gift-cards/check/${checkCode.trim().toUpperCase()}`);
      if (res.data?.success) {
        setCardDetails(res.data.data);
      }
    } catch (err) {
      setCheckError(err.response?.data?.message || 'Invalid or expired gift card code.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Gifting The Atelier Experience"
          title="Nail Salon & Spa Gift Card"
          subtitle="Treat someone exceptional to an afternoon of tranquil luxury, bespoke Japanese gel sculpting, and precision cuticle care."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          {/* Left Column: Visual Gift Card Presentation */}
          <div className="lg:col-span-5 space-y-8">
            {/* Luxury Metallic Card Mockup */}
            <div className="relative aspect-[16/10] rounded-3xl p-8 bg-gradient-to-br from-[#572A39] via-[#431E2A] to-[#252124] text-white shadow-2xl border border-[#D8BE9A]/40 flex flex-col justify-between overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-[#D8BE9A]/10 blur-xl"></div>
              <div className="flex items-center justify-between z-10">
                <span className="font-serif text-xl tracking-[0.08em]">NAIL SALON &amp; SPA</span>
                <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/20">
                  Salon Concierge Pass
                </span>
              </div>
              <div className="z-10 my-4">
                <span className="text-xs uppercase tracking-widest text-[#D8BE9A] block mb-1">
                  Card Value
                </span>
                <span className="font-serif text-4xl sm:text-5xl font-bold">
                  ₹{Number(denomination).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-white/70 font-light z-10 border-t border-white/10 pt-3">
                <span>Valid for 12 months</span>
                <span className="font-mono tracking-widest">GIFT-CARD-••••</span>
              </div>
            </div>

            {/* Inclusions summary */}
            <div className="bg-white rounded-2xl p-6 border border-[#F2DDE1] space-y-3">
              <h4 className="font-serif text-lg font-medium text-[#252124]">
                The Gift Card Experience Includes:
              </h4>
              <ul className="text-xs text-[#252124]/75 space-y-2 font-light">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#572A39]" />
                  <span>Redeemable across all Mumbai &amp; Bengaluru studios</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#572A39]" />
                  <span>Applicable to all gel extensions, rituals &amp; retail products</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#572A39]" />
                  <span>Complimentary organic tea &amp; champagne pairing during visit</span>
                </li>
              </ul>
            </div>

            {/* Check Card Balance Box */}
            <div className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#F2DDE1] space-y-4">
              <h4 className="font-serif text-lg font-medium text-[#252124]">
                Check Gift Card Balance
              </h4>
              <form onSubmit={handleCheckBalance} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. GIFT-LUX100"
                  value={checkCode}
                  onChange={(e) => setCheckCode(e.target.value.toUpperCase())}
                  required
                  className="flex-1 px-4 py-2 rounded-full border border-[#F2DDE1] text-xs uppercase tracking-wider focus:outline-none focus:border-[#572A39] bg-white"
                />
                <Button type="submit" variant="secondary" size="sm" isLoading={checking}>
                  Check
                </Button>
              </form>

              {checkError && <p className="text-xs text-red-600">{checkError}</p>}

              {cardDetails && (
                <div className="p-4 bg-white rounded-xl border border-[#F2DDE1] text-xs space-y-1">
                  <p className="font-medium text-[#572A39]">
                    Code: <strong>{cardDetails.code}</strong> ({cardDetails.status.toUpperCase()})
                  </p>
                  <p className="text-sm font-serif font-bold text-[#252124]">
                    Available Balance: ₹{Number(cardDetails.balance).toLocaleString('en-IN')} / ₹
                    {Number(cardDetails.denomination).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[#252124]/60 font-light">
                    Issued to: {cardDetails.recipientName}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order / Purchase Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#F2DDE1] shadow-sm">
            {purchasedCard ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#572A39] mx-auto" />
                <span className="editorial-badge bg-[#F2DDE1] text-[#572A39]">
                  GIFT CARD GENERATED
                </span>
                <h3 className="font-serif text-3xl font-normal text-[#252124]">
                  Gift Card Order Registered!
                </h3>
                <p className="text-sm text-[#252124]/75 font-light max-w-md mx-auto">
                  A digital gift certificate and confirmation voucher have been prepared for{' '}
                  <strong>{purchasedCard.recipientName}</strong>.
                </p>
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#F2DDE1] inline-block font-mono text-sm tracking-wider font-semibold text-[#572A39]">
                  Card Code: {purchasedCard.code}
                </div>
                <div className="pt-4">
                  <Button variant="primary" size="md" onClick={() => setPurchasedCard(null)}>
                    Order Another Gift Card
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePurchase} className="space-y-6">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-[#252124] mb-1">
                    Select Gift Denomination
                  </h3>
                  <p className="text-xs text-[#252124]/60 font-light mb-4">
                    Choose from our signature atelier amounts:
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {DENOMINATIONS.map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => setDenomination(amount)}
                        className={`py-3 px-2 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                          denomination === amount
                            ? 'bg-[#572A39] text-[#FAF7F2] shadow-sm'
                            : 'bg-white border border-[#F2DDE1] text-[#252124] hover:border-[#572A39]'
                        }`}
                      >
                        ₹{amount.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                </div>

                {purchaseError && (
                  <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                    {purchaseError}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Recipient Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maya Sengupta"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Recipient Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="maya@example.com"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Siddharth Roy"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="siddharth@example.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#F2DDE1] text-xs focus:outline-none focus:border-[#572A39]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                    Personalized Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Wishing you a luminous birthday! Treat your nails to something exquisite..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
                    Purchase Gift Card (₹{denomination.toLocaleString('en-IN')})
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

export default GiftCards;
