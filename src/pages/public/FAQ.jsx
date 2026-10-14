import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';
import { Link } from 'react-router-dom';

const FAQS = [
  {
    q: 'What is a Russian Dry Manicure and how does it differ from traditional manicures?',
    a: 'A Russian dry manicure is an advanced hardware technique using sanitized diamond e-file burrs to exfoliate the proximal nail fold and eponychium without soaking in water. By avoiding water submersion, the nail plate doesn’t swell and contract, resulting in zero premature lifting and allowing gel polish to be applied cleanly beneath the cuticle perimeter for an extra two weeks of flawless growth.',
  },
  {
    q: 'How long do your gel nail extensions last?',
    a: 'Our sculpted European hard gel extensions typically last between 3 to 4 weeks before requiring a structural rebalance or refill. Because we sculpt directly to your nail plate curvature rather than gluing pre-made plastic tips, they absorb daily wear without popping off.',
  },
  {
    q: 'What are your hygiene and instrument sterilization protocols?',
    a: 'We adhere to hospital-standard autoclave sterilization. All steel nippers, pushers, and carbide burrs undergo ultrasonic enzymatic baths followed by high-pressure steam autoclave sterilization at 134°C. Instruments are unsealed from individual single-client sterilization pouches in front of you. Files, buffers, and foot soakers are 100% single-use and disposable.',
  },
  {
    q: 'Can I bring my own nail-art reference or inspiration picture?',
    a: 'Absolutely! In fact, we encourage it. Every service commences with a 5 to 10 minute bespoke consultation where our artists evaluate your reference, examine your nail bed proportions, and harmonize the design with your skin tone and lifestyle.',
  },
  {
    q: 'What is your appointment cancellation and rescheduling policy?',
    a: 'We understand that unexpected schedule changes happen. We kindly request at least 4 hours advance notice to cancel or reschedule an appointment so that our artists can release the reserved time slot to waiting guests. You can cancel directly online using your booking reference or by messaging our WhatsApp concierge.',
  },
  {
    q: 'Do you offer a repair guarantee if a nail chips or lifts?',
    a: 'Yes. We offer a 7-day complimentary repair guarantee on all gel extensions and manicures. In the rare event of lifting or accidental breakage, simply contact us and we will promptly repair it at no charge.',
  },
  {
    q: 'Do you take walk-in clients?',
    a: 'Due to our unhurried, dedicated time allocation philosophy, our appointments are predominantly reserved in advance. While we occasionally accommodate walk-in guests when a cancellation occurs, we strongly recommend reserving your slot online or via WhatsApp.',
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Help &amp; Guidance"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about our techniques, sterilization protocols, extension longevity, and studio etiquette."
        />

        <div className="space-y-4 mb-16">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#F2DDE1] overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span className="font-serif text-lg sm:text-xl font-normal text-[#252124]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#572A39] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-[#252124]/75 font-light leading-relaxed border-t border-[#F2DDE1]/60 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center p-8 rounded-3xl bg-[#FAF7F2] border border-[#F2DDE1] space-y-4">
          <h3 className="font-serif text-2xl font-normal">Still have a question?</h3>
          <p className="text-xs sm:text-sm text-[#252124]/70 font-light max-w-md mx-auto">
            Our salon concierge desk is delighted to guide you through services, bridal packages, and bespoke art estimates.
          </p>
          <div className="pt-2">
            <Link to="/contact">
              <Button variant="primary" size="md">
                Inquire With Concierge Desk
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
