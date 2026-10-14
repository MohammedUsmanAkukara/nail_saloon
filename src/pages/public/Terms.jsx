import React from 'react';
import SectionHeading from '../../components/common/SectionHeading';

const Terms = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Studio Etiquette"
          title="Terms &amp; Salon Policies"
          subtitle="General conditions of appointment reservations, studio etiquette, and service warranties."
        />

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F2DDE1] shadow-sm space-y-8 text-xs sm:text-sm text-[#252124]/80 font-light leading-relaxed">
          <section className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              1. Appointments &amp; Punctuality
            </h3>
            <p>
              To maintain our serene and unhurried salon atmosphere, appointments are booked in precise time increments. Guests arriving more than 15 minutes past their confirmed start time may have their service scope adjusted to prevent delay for subsequent appointments.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              2. Cancellation &amp; Rescheduling Policies
            </h3>
            <p>
              We request that any cancellation or rescheduling request be made at least 4 hours in advance via our online lookup portal or WhatsApp desk.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              3. 7-Day Treatment Guarantee
            </h3>
            <p>
              We stand by our craftsmanship. If you experience lifting, chipping, or breakage within 7 calendar days of your gel extension or dry manicure service, we will repair the affected nail(s) at no cost.
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              4. Gift Cards
            </h3>
            <p>
              Gift certificates issued by Nail Salon &amp; Spa carry a 12-month validity period from the date of issue and may be redeemed across all services and nail-art add-ons at any active salon studio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
