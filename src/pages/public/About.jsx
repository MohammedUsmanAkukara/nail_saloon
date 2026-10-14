import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart, Award, CheckCircle, ArrowRight } from 'lucide-react';
import SectionHeading from '../../components/common/SectionHeading';
import Button from '../../components/common/Button';

const About = () => {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Hero Banner */}
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
          <span className="editorial-badge bg-[#F2DDE1] text-[#572A39]">
            OUR PHILOSOPHY
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal leading-tight text-[#252124]">
            Where High-Fashion Artistry Meets <span className="italic text-[#572A39]">Restorative Care.</span>
          </h1>
          <p className="text-base sm:text-lg text-[#252124]/75 font-light leading-relaxed max-w-2xl mx-auto">
            Founded on the conviction that nail care is a premier form of personal identity and self-expression, Nail Salon &amp; Spa offers an unhurried, hygienic sanctuary tailored to the modern woman.
          </p>
        </div>

        {/* Double Image Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 items-center">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-[#F2DDE1]">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
              alt="Salon Atelier Interior"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6 md:pl-8">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C98F9A]">
              The Craft &amp; Origins
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#252124]">
              Rejecting Compromise. Championing Health.
            </h2>
            <p className="text-sm sm:text-base text-[#252124]/75 font-light leading-relaxed">
              Traditional salons frequently prioritize speed over the integrity of the natural nail plate. Aggressive buffing, toxic chemical fumes, and wet cuticle cutting weaken keratin bonds and lead to peeling.
            </p>
            <p className="text-sm sm:text-base text-[#252124]/75 font-light leading-relaxed">
              At Nail Salon &amp; Spa, we pioneered the integration of European hard gel sculpting and Russian dry diamond e-file techniques in India. Our formulas are strictly 10-Free, hypoallergenic, and odorless.
            </p>
            <ul className="space-y-3 pt-2">
              {[
                'Medical autoclave sterilization for all metal instruments',
                'Single-use biodegradable nail files, buffers, and towels',
                'Nail plates analyzed individually before application',
                'Master technicians with international accreditations',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[#252124]/85 font-light">
                  <CheckCircle className="w-4 h-4 text-[#C98F9A] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pillars of Atelier */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#F2DDE1] mb-24">
          <SectionHeading
            eyebrow="The Four Pillars"
            title="The Standards That Define Our Atelier"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#F2DDE1] text-[#572A39] flex items-center justify-center mx-auto sm:mx-0">
                <Sparkles className="w-6 h-6 text-[#C98F9A]" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#252124]">Editorial Aesthetic</h3>
              <p className="text-xs text-[#252124]/70 font-light leading-relaxed">
                Designs influenced by global couture, architectural minimalism, and refined textures.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#F2DDE1] text-[#572A39] flex items-center justify-center mx-auto sm:mx-0">
                <Shield className="w-6 h-6 text-[#C98F9A]" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#252124]">Absolute Hygiene</h3>
              <p className="text-xs text-[#252124]/70 font-light leading-relaxed">
                Hospitality that meets surgical sterile protocols for your total peace of mind.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#F2DDE1] text-[#572A39] flex items-center justify-center mx-auto sm:mx-0">
                <Heart className="w-6 h-6 text-[#C98F9A]" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#252124]">Unhurried Care</h3>
              <p className="text-xs text-[#252124]/70 font-light leading-relaxed">
                We never rush your session. Dedicated appointment buffers ensure complete tranquility.
              </p>
            </div>

            <div className="space-y-3 text-center sm:text-left">
              <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#F2DDE1] text-[#572A39] flex items-center justify-center mx-auto sm:mx-0">
                <Award className="w-6 h-6 text-[#C98F9A]" />
              </div>
              <h3 className="font-serif text-xl font-normal text-[#252124]">Continuous Mastery</h3>
              <p className="text-xs text-[#252124]/70 font-light leading-relaxed">
                Our technicians participate in seasonal masterclasses in Tokyo, Milan, and Seoul.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-[#252124]">
            Experience The Difference Firsthand
          </h2>
          <Link to="/book">
            <Button variant="primary" size="lg">
              Reserve Your Appointment
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
