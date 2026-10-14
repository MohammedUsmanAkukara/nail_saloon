import React, { useState, useEffect } from 'react';
import { Sliders, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

const AdminSettings = () => {
  const { refreshSettings } = useSettings();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings/admin');
        if (res.data?.success) setSettings(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await api.patch('/settings/admin', settings);
      if (res.data?.success) {
        setSavedSuccess(true);
        refreshSettings();
        setTimeout(() => setSavedSuccess(false), 2500);
      }
    } catch (err) {
      alert('Error saving site settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <LoadingSpinner text="Retrieving site CMS settings..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-normal text-[#252124]">
            Website CMS &amp; Branding
          </h1>
          <p className="text-xs text-[#252124]/60 font-light mt-1">
            Configure homepage hero statements, announcement banner, contact info, and SEO.
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Live Changes Saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Top Announcement Bar CMS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F2DDE1] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F2DDE1] pb-3">
            <h3 className="font-serif text-xl font-normal text-[#252124]">
              Top Promotional Announcement Bar
            </h3>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={settings.announcement?.enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, enabled: e.target.checked },
                  })
                }
                className="accent-[#572A39]"
              />
              <span className="font-semibold text-[#572A39]">Enable Bar</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Announcement Message
              </label>
              <input
                type="text"
                value={settings.announcement?.text || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, text: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              />
            </div>
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                CTA Link Destination
              </label>
              <input
                type="text"
                value={settings.announcement?.link || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    announcement: { ...settings.announcement, link: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              />
            </div>
          </div>
        </div>

        {/* Hero Section CMS */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F2DDE1] shadow-xs space-y-4">
          <h3 className="font-serif text-xl font-normal text-[#252124] border-b border-[#F2DDE1] pb-3">
            Homepage Hero Section
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Badge Eyebrow Text
              </label>
              <input
                type="text"
                value={settings.hero?.badgeText || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, badgeText: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Hero Headline (Use line breaks to split)
              </label>
              <textarea
                rows={3}
                value={settings.hero?.headline || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, headline: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              ></textarea>
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Hero Subheadline Description
              </label>
              <textarea
                rows={2}
                value={settings.hero?.subheadline || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, subheadline: e.target.value },
                  })
                }
                className="w-full p-2.5 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              ></textarea>
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Hero Cover Image URL
              </label>
              <input
                type="url"
                value={settings.hero?.heroImage || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    hero: { ...settings.hero, heroImage: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              />
            </div>
          </div>
        </div>

        {/* Contact Info & WhatsApp */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#F2DDE1] shadow-xs space-y-4">
          <h3 className="font-serif text-xl font-normal text-[#252124] border-b border-[#F2DDE1] pb-3">
            Contact &amp; Concierge Numbers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Concierge Phone
              </label>
              <input
                type="text"
                value={settings.contactInfo?.phone || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contactInfo: { ...settings.contactInfo, phone: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                WhatsApp Business Number (digits only, e.g. 919876543210)
              </label>
              <input
                type="text"
                value={settings.contactInfo?.whatsappNumber || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contactInfo: { ...settings.contactInfo, whatsappNumber: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Concierge Email
              </label>
              <input
                type="email"
                value={settings.contactInfo?.email || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contactInfo: { ...settings.contactInfo, email: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              />
            </div>

            <div>
              <label className="uppercase tracking-wider font-semibold text-[#572A39] block mb-1">
                Operating Hours Summary
              </label>
              <input
                type="text"
                value={settings.contactInfo?.businessHours || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    contactInfo: { ...settings.contactInfo, businessHours: e.target.value },
                  })
                }
                className="w-full px-3 py-2 rounded-xl border border-[#F2DDE1] focus:outline-none focus:border-[#572A39]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg" isLoading={saving}>
            <Save className="w-4 h-4 mr-2" />
            Save Site Settings
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
