import React, { useState, useEffect } from 'react';
import { resources } from '../data/resources';
import { ExternalLink, CheckCircle, Send, HelpCircle, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/useLanguage';
import { submitEnquiry, getEnquiries, getHealthStatus } from '../services/api';

export default function Resources() {
  const {
    t,
    getResourceTitle,
    getResourceDescription,
    getResourceCategory
  } = useLanguage();

  // Backend & enquiry state
  const [backendStatus, setBackendStatus] = useState('checking');
  const [enquiries, setEnquiries] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    constituency: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // Check backend health
    getHealthStatus().then((status) => {
      if (status && status.status === 'healthy') {
        setBackendStatus('connected');
      } else {
        setBackendStatus('offline');
      }
    });

    // Fetch initial enquiries
    getEnquiries().then((data) => {
      setEnquiries(data || []);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess('');
    setSubmitError('');

    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setSubmitError('Please fill in your name, contact, and query message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitEnquiry(formData);
      if (res.success && res.data) {
        setSubmitSuccess(t('enquiry_success'));
        setFormData({ name: '', phone: '', constituency: '', message: '' });
        // Refresh enquiries
        const updated = await getEnquiries();
        setEnquiries(updated);
      } else {
        setSubmitError('Unable to record enquiry. Please try again.');
      }
    } catch {
      setSubmitError('Enquiry submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 leading-tight">
            {t('resources_page_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {t('resources_page_sub')}
          </p>
        </div>

        {/* Backend Connectivity Status Indicator */}
        <div className="inline-flex items-center gap-2 self-start sm:self-auto bg-slate-100 border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-slate-700">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              backendStatus === 'connected'
                ? 'bg-emerald-500 animate-pulse'
                : backendStatus === 'offline'
                ? 'bg-amber-500'
                : 'bg-slate-400'
            }`}
          />
          <span>
            {backendStatus === 'connected'
              ? t('backend_connected')
              : backendStatus === 'offline'
              ? t('backend_offline')
              : 'Verifying Backend...'}
          </span>
        </div>
      </div>

      {/* Big Toll-Free Helpline Box */}
      <div className="bg-emerald-600 text-white rounded-3xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-700/80 px-3 py-1 rounded-full text-xs font-semibold">
            📞 {t('helpline_badge')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold leading-tight">
            {t('voter_need_help')}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
            {t('tollfree_desc')}
          </p>
        </div>

        <a
          href="tel:1950"
          className="bg-white text-emerald-800 hover:bg-emerald-50 font-semibold text-base px-8 py-4 rounded-2xl shadow transition-all shrink-0 cursor-pointer whitespace-nowrap"
        >
          {t('call_now')}
        </a>
      </div>

      {/* Interactive Citizen Enquiry Submission (Connected to SQLite API) */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>SQLite Citizen Registry</span>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
            {t('enquiry_form_title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('enquiry_form_sub')}
          </p>
        </div>

        {submitSuccess && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{submitSuccess}</span>
          </div>
        )}

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('input_name')} *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Ramesh Chandra"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('input_phone')} *
            </label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="e.g. +91 98765 43210 / voter@mail.in"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('input_constituency')}
            </label>
            <input
              type="text"
              value={formData.constituency}
              onChange={(e) => setFormData({ ...formData, constituency: e.target.value })}
              placeholder="e.g. Kakinada City / Khairatabad / Coimbatore South"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              {t('input_message')} *
            </label>
            <textarea
              required
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="e.g. How can I verify if my name is present on the updated 2026 electoral roll?"
              className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Recorded in local encrypted SQLite audit table
            </span>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? t('submitting_enquiry') : t('btn_submit_enquiry')}</span>
            </button>
          </div>
        </form>

        {/* Live Enquiries Stream */}
        {enquiries.length > 0 && (
          <div className="pt-6 border-t-2 border-slate-100 space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span>{t('recent_enquiries_title')}</span>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                {enquiries.length}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {enquiries.slice(0, 4).map((enq) => (
                <div key={enq.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-semibold text-slate-800">{enq.name}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      {enq.status || 'Recorded'}
                    </span>
                  </div>
                  <p className="text-slate-700 italic">"{enq.message}"</p>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                    <span>📍 {enq.constituency || 'General Inquiry'}</span>
                    <span>{enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : 'Recent'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4 Simple Steps to Vote */}
      <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
          {t('four_steps_title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
              1
            </div>
            <h3 className="font-semibold text-sm text-slate-900">{t('step1_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('step1_desc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
              2
            </div>
            <h3 className="font-semibold text-sm text-slate-900">{t('step2_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('step2_desc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
              3
            </div>
            <h3 className="font-semibold text-sm text-slate-900">{t('step3_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('step3_desc')}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold flex items-center justify-center text-sm">
              4
            </div>
            <h3 className="font-semibold text-sm text-slate-900">{t('step4_title')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('step4_desc')}
            </p>
          </div>
        </div>
      </div>

      {/* Official Guidelines List */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
          {t('official_docs_title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((res) => {
            const catLabel = getResourceCategory(res);
            const resTitle = getResourceTitle(res);
            const resDesc = getResourceDescription(res);

            return (
              <div key={res.id} className="bg-white p-5 rounded-2xl border-2 border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                      {catLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      {res.fileType}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base text-slate-900 mt-2 mb-1 leading-snug">
                    {resTitle}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {resDesc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs gap-2">
                  <span className="text-slate-400">{t('source_label')}: {res.sourceName}</span>
                  <a
                    href={res.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>{t('visit_portal')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
