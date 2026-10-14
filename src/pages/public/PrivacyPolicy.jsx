import React from 'react';
import SectionHeading from '../../components/common/SectionHeading';

const PrivacyPolicy = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Legal &amp; Privacy"
          title="Privacy Policy"
          subtitle="How Nail Salon & Spa safeguards and respects your personal client data."
        />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F2DDE1] shadow-sm space-y-8 text-xs sm:text-sm text-[#252124]/80 font-light leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              1. Information We Collect
            </h3>
            <p>
              When you reserve an appointment, subscribe to our Salon Gazette, or purchase a gift card, we collect information including your full name, email address, telephone/WhatsApp number, preferred salon studio, and appointment styling preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              2. How We Utilize Your Data
            </h3>
            <p>
              Your contact details are strictly utilized to:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Coordinate and confirm your salon appointments and time slots</li>
              <li>Deliver important appointment reminders and cancellation updates via SMS/WhatsApp</li>
              <li>Provide personalized customer care and maintain historical visit preferences</li>
              <li>Send seasonal editorial journals if you have voluntarily subscribed to our newsletter</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              3. Protection &amp; Confidentiality
            </h3>
            <p>
              We implement industry-standard encryption, strict database access controls, and hashed authentication protocols. We never sell, lease, or distribute your private contact records or booking history to third-party commercial marketing entities.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              4. Contacting Our Data Concierge
            </h3>
            <p>
              If you wish to review, update, or request the deletion of your customer profile, you may reach our privacy desk directly at <strong>concierge@nailsalonandspa.com</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
