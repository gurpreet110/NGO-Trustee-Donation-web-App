import { useState, useEffect, useCallback, useId } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  HeartHandshake,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  TrendingUp,
  Tag,
  ArrowRight,
  Info,
  Sparkles,
} from "lucide-react";
import { campaignApi, donationInquiryApi } from "@/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { formatCurrency, formatPercent } from "@/utils";
import Loader from "@/components/common/Loader";
import ErrorState from "@/components/common/ErrorState";

const DONOR_TYPE_OPTIONS = [
  "Individual",
  "Student",
  "Working Professional",
  "Business/Organization",
  "Other",
];

const DONATION_INTEREST_OPTIONS = [
  "One-time donation",
  "Monthly support",
  "Corporate support",
  "Volunteering",
  "Just exploring",
];

const INCOME_RANGE_OPTIONS = [
  "Prefer not to say",
  "Under ₹3,00,000",
  "₹3,00,000 - ₹5,00,000",
  "₹5,00,000 - ₹10,00,000",
  "₹10,00,000 - ₹25,00,000",
  "Above ₹25,00,000",
];

const QUICK_AMOUNT_PRESETS = [
  "₹1,000 - ₹2,500",
  "₹2,500 - ₹5,000",
  "₹5,000 - ₹10,000",
  "₹10,000 - ₹25,000",
  "₹50,000+",
];

export default function Donate() {
  useDocumentTitle("Support a Cause — Donation Inquiry | GiveHope NGO");

  const [searchParams, setSearchParams] = useSearchParams();
  const paramCampaignId = searchParams.get("campaignId");

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);

  // Form State
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [donorType, setDonorType] = useState("Individual");
  const [occupation, setOccupation] = useState("");
  const [incomeRange, setIncomeRange] = useState("Prefer not to say");
  const [donationInterest, setDonationInterest] = useState("One-time donation");
  const [intendedAmount, setIntendedAmount] = useState("");
  const [message, setMessage] = useState("");

  // Submission States
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitFeedback, setSubmitFeedback] = useState("");
  const [lastSubmittedData, setLastSubmittedData] = useState(null);

  // Accessible unique IDs
  const nameId = useId();
  const emailId = useId();
  const phoneId = useId();
  const locationId = useId();
  const donorTypeId = useId();
  const occupationId = useId();
  const incomeId = useId();
  const interestId = useId();
  const amountId = useId();
  const campaignSelectorId = useId();
  const messageId = useId();

  // Load campaigns from API
  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const data = await campaignApi.getAll();
      const list = Array.isArray(data) ? data : [];
      setCampaigns(list);

      // Preselect campaign based on route/query parameter
      if (paramCampaignId && list.some((c) => c.id === paramCampaignId)) {
        setSelectedCampaignId(paramCampaignId);
      } else if (list.length > 0) {
        setSelectedCampaignId(list[0].id);
      }
      setLoading(false);
    } catch {
      setPageError("Failed to load campaigns for the donation inquiry. Please try again.");
      setLoading(false);
    }
  }, [paramCampaignId]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  // Synchronize campaign selection with query parameter so refresh preserves selection
  const handleCampaignChange = (newId) => {
    setSelectedCampaignId(newId);
    if (newId) {
      setSearchParams({ campaignId: newId }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
    if (errors.campaignId) {
      setErrors((prev) => ({ ...prev, campaignId: null }));
    }
  };

  // Find currently selected campaign object
  const currentCampaign = campaigns.find((c) => c.id === selectedCampaignId) || null;

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    if (!selectedCampaignId) {
      newErrors.campaignId = "Please select a campaign you would like to support.";
    }

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (phone.trim()) {
      const phoneRegex = /^[0-9+\s\-()]{7,25}$/;
      if (!phoneRegex.test(phone.trim())) {
        newErrors.phone = "Please enter a valid phone number with area/country code.";
      }
    }

    if (!donorType) {
      newErrors.donorType = "Please select who you are.";
    }

    if (!donationInterest) {
      newErrors.donationInterest = "Please select your donation interest.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return; // Prevent duplicate submissions

    if (!validateForm()) {
      // Scroll to top of form or first error
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    setSubmitFeedback("");

    const payload = {
      campaignId: selectedCampaignId,
      name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      donorType,
      occupation: occupation.trim(),
      incomeRange: incomeRange || "Prefer not to say",
      donationInterest,
      intendedAmount: intendedAmount.trim(),
      message: message.trim(),
    };

    try {
      const res = await donationInquiryApi.create(payload);
      setSubmitting(false);
      setSubmitSuccess(true);
      setSubmitFeedback(
        res?.message ||
          "Thank you for your interest in supporting our cause! Your response has been received. Our team may contact you with the next steps."
      );
      setLastSubmittedData({
        name: payload.name,
        email: payload.email,
        campaignTitle: currentCampaign?.title || "GiveHope Initiative",
        donationInterest: payload.donationInterest,
      });
      window.scrollTo({ top: 100, behavior: "smooth" });
    } catch (err) {
      setSubmitting(false);
      const serverMessage =
        err?.response?.data?.message ||
        "We could not save your inquiry at this moment. Please check your connection and try again.";
      const fieldErrors = err?.response?.data?.errors;

      if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
        const mappedErrors = {};
        fieldErrors.forEach((fe) => {
          if (fe.field === "email") mappedErrors.email = fe.message;
          if (fe.field === "name") mappedErrors.fullName = fe.message;
          if (fe.field === "phone") mappedErrors.phone = fe.message;
          if (fe.field === "campaignId") mappedErrors.campaignId = fe.message;
        });
        setErrors((prev) => ({ ...prev, ...mappedErrors }));
      }

      setSubmitFeedback(serverMessage);
    }
  };

  const handleResetForm = () => {
    setSubmitSuccess(false);
    setSubmitFeedback("");
    setErrors({});
    setFullName("");
    setEmail("");
    setPhone("");
    setLocation("");
    setOccupation("");
    setIntendedAmount("");
    setMessage("");
  };

  if (pageError && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <ErrorState message={pageError} onRetry={fetchCampaigns} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Page Hero Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <HeartHandshake className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            Transparent Philanthropy
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Support a Cause That Matters
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your inquiry connects you directly with our trustee programs. Every rupee raised is deployed
            transparently to provide clean water, quality education, emergency relief, and community health.
          </p>
        </div>

        {loading ? (
          <div className="py-20">
            <Loader />
          </div>
        ) : submitSuccess ? (
          /* Confirmation & Success Screen */
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-teal-100 dark:border-teal-900/60 shadow-xl p-8 sm:p-12 text-center animate-slide-up">
            <div className="w-20 h-20 bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Inquiry Received Successfully!
            </h2>

            <div className="max-w-xl mx-auto bg-teal-50/60 dark:bg-teal-950/40 rounded-2xl p-6 border border-teal-100 dark:border-teal-800/60 text-left text-sm space-y-3 mb-8">
              <p className="text-teal-900 dark:text-teal-200 font-semibold text-base">
                {submitFeedback}
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Thank you, <span className="font-semibold text-gray-900 dark:text-white">{lastSubmittedData?.name}</span>.
                We have registered your interest in{" "}
                <span className="font-semibold text-teal-800 dark:text-teal-300">{lastSubmittedData?.campaignTitle}</span> for{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{lastSubmittedData?.donationInterest}</span>.
                A confirmation summary has been directed to{" "}
                <span className="font-semibold text-gray-900 dark:text-white">{lastSubmittedData?.email}</span>.
              </p>
              <div className="pt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5 border-t border-teal-100 dark:border-teal-850">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>Notice: No financial transaction has taken place. Our trustee team coordinates official tax-deductible contributions directly.</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-all shadow-md shadow-teal-700/20"
              >
                Submit Another Inquiry
              </button>
              <Link
                to="/campaigns"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Browse All Impact Campaigns
              </Link>
            </div>
          </div>
        ) : (
          /* Main Donation Inquiry Form Card */
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-xl overflow-hidden transition-colors">
            {/* Selected Campaign Spotlight Banner */}
            {currentCampaign ? (
              <div className="bg-gradient-to-r from-teal-900 to-teal-800 text-white p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <img
                    src={currentCampaign.image}
                    alt={currentCampaign.title}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 shadow-md border border-white/20"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur">
                        <Tag className="w-3 h-3" />
                        {currentCampaign.category}
                      </span>
                      <span className="text-teal-200 text-xs font-medium">
                        Target: {formatCurrency(currentCampaign.goal)}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-white truncate">
                      {currentCampaign.title}
                    </h2>

                    <p className="mt-1 text-xs sm:text-sm text-teal-100/90 line-clamp-2 leading-relaxed">
                      {currentCampaign.shortDescription || currentCampaign.description}
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <span className="text-teal-200 font-medium">
                        Progress:{" "}
                        <strong className="text-white">
                          {formatPercent(currentCampaign.raised, currentCampaign.goal)}%
                        </strong>{" "}
                        raised ({formatCurrency(currentCampaign.raised || 0)})
                      </span>
                      <Link
                        to={`/campaigns/${currentCampaign.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-teal-300 hover:text-white transition-colors font-medium underline underline-offset-2"
                      >
                        Read Campaign Story <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-teal-800 text-white p-6 text-center">
                <p className="text-sm font-medium">Select a campaign below to begin your inquiry.</p>
              </div>
            )}

            {/* General Submission Error Banner */}
            {submitFeedback && !submitSuccess && (
              <div className="mx-6 sm:mx-8 mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Unable to submit inquiry</h4>
                  <p className="mt-0.5 text-xs text-red-600">{submitFeedback}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="p-6 sm:p-10 space-y-8">
              {/* Campaign Selection Field */}
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <label
                    htmlFor={campaignSelectorId}
                    className="block text-sm font-bold text-gray-900 dark:text-white"
                  >
                    Preferred Campaign <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Change campaign anytime
                  </span>
                </div>
                <select
                  id={campaignSelectorId}
                  value={selectedCampaignId}
                  onChange={(e) => handleCampaignChange(e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm text-gray-800 dark:text-gray-100 font-medium focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all ${
                    errors.campaignId ? "border-red-400 bg-red-50/50 dark:bg-red-950/20" : "border-gray-200 dark:border-gray-700"
                  }`}
                >
                  <option value="" disabled className="dark:bg-gray-800">
                    -- Choose a cause or initiative --
                  </option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id} className="dark:bg-gray-800">
                      {c.title} ({c.category}) — Goal: {formatCurrency(c.goal)}
                    </option>
                  ))}
                </select>
                {errors.campaignId && (
                  <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.campaignId}
                  </p>
                )}
              </div>

              {/* Section 1: Personal Information */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    1. Personal Information
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor={nameId}
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                    >
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id={nameId}
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          if (errors.fullName) setErrors((p) => ({ ...p, fullName: null }));
                        }}
                        placeholder="e.g. Priya Sharma"
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all ${
                          errors.fullName ? "border-red-400 bg-red-50/50 dark:bg-red-950/20" : "border-gray-200 dark:border-gray-700"
                        }`}
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor={emailId}
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id={emailId}
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((p) => ({ ...p, email: null }));
                        }}
                        placeholder="e.g. priya@example.com"
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all ${
                          errors.email ? "border-red-400 bg-red-50/50 dark:bg-red-950/20" : "border-gray-200 dark:border-gray-700"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone (Optional) */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label
                        htmlFor={phoneId}
                        className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Phone Number
                      </label>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">Optional</span>
                    </div>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id={phoneId}
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value);
                          if (errors.phone) setErrors((p) => ({ ...p, phone: null }));
                        }}
                        placeholder="+91 98765 43210"
                        className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border rounded-xl text-sm text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all ${
                          errors.phone ? "border-red-400 bg-red-50/50 dark:bg-red-950/20" : "border-gray-200 dark:border-gray-700"
                        }`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Location (Optional) */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label
                        htmlFor={locationId}
                        className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        City or Location
                      </label>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">Optional</span>
                    </div>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        id={locationId}
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. New Delhi, Bengaluru"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: About the Donor & Giving Interests */}
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    2. About You & Giving Interests
                  </h3>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Who Are You? */}
                  <div>
                    <label
                      htmlFor={donorTypeId}
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                    >
                      Who Are You? <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        id={donorTypeId}
                        value={donorType}
                        onChange={(e) => setDonorType(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium"
                      >
                        {DONOR_TYPE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="dark:bg-gray-800">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Occupation */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label
                        htmlFor={occupationId}
                        className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Occupation or Field
                      </label>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">Optional</span>
                    </div>
                    <input
                      id={occupationId}
                      type="text"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      placeholder="e.g. Teacher, Engineer, Consultant"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    />
                  </div>

                  {/* Annual Income Range (Optional) */}
                  <div>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <label
                        htmlFor={incomeId}
                        className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                      >
                        Annual Income Range
                      </label>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">Optional</span>
                    </div>
                    <select
                      id={incomeId}
                      value={incomeRange}
                      onChange={(e) => setIncomeRange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-gray-700 dark:text-gray-200"
                    >
                      {INCOME_RANGE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="dark:bg-gray-800">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Donation Interest */}
                  <div>
                    <label
                      htmlFor={interestId}
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                    >
                      Donation Interest <span className="text-red-500">*</span>
                    </label>
                    <select
                      id={interestId}
                      value={donationInterest}
                      onChange={(e) => setDonationInterest(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all font-medium text-gray-900 dark:text-white"
                    >
                      {DONATION_INTEREST_OPTIONS.map((opt) => (
                        <option key={opt} value={opt} className="dark:bg-gray-800">
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Intended Donation Amount or Range */}
                <div className="mt-5">
                  <div className="flex justify-between items-baseline mb-2">
                    <label
                      htmlFor={amountId}
                      className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                    >
                      Intended Contribution Amount or Range
                    </label>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">Approximate</span>
                  </div>

                  {/* Quick pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {QUICK_AMOUNT_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setIntendedAmount(preset)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          intendedAmount === preset
                            ? "bg-teal-700 dark:bg-teal-600 text-white shadow-sm"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <input
                    id={amountId}
                    type="text"
                    value={intendedAmount}
                    onChange={(e) => setIntendedAmount(e.target.value)}
                    placeholder="e.g. ₹5,000 one-time, or ₹1,000 monthly, or custom"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                  />
                </div>

                {/* Optional Message */}
                <div className="mt-5">
                  <label
                    htmlFor={messageId}
                    className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5"
                  >
                    Personal Message or Inquiries
                  </label>
                  <textarea
                    id={messageId}
                    rows={3}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us how you would like to help, questions about the cause, or specific trustee inquiries..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-teal-500 outline-none transition-all resize-none"
                  />
                </div>
              </div>

              {/* Security & Privacy Explanation Card */}
              <div className="rounded-2xl bg-slate-50 dark:bg-gray-800/60 border border-slate-200 dark:border-gray-700 p-4 text-xs text-gray-600 dark:text-gray-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-teal-700 dark:text-teal-400 shrink-0 mt-0.5" />
                <div className="leading-relaxed space-y-1">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Why we collect this information:
                  </p>
                  <p>
                    GiveHope requests your occupation, general giving interest, and contact information
                    strictly to provide personalized impact reports, coordinate 80G tax receipt paperwork,
                    and arrange volunteer or CSR collaborations.
                  </p>
                  <p className="font-medium text-teal-800 dark:text-teal-300">
                    We never request bank credentials, PINs, card CVVs, or exact personal balance details.
                  </p>
                </div>
              </div>

              {/* Call to Action — Donate Now Button */}
              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative inline-flex items-center justify-center gap-2 w-full sm:w-auto sm:min-w-[320px] px-8 py-4 rounded-2xl bg-teal-600 text-white font-bold text-base shadow-lg shadow-teal-700/25 transition-all duration-300 ease-out hover:bg-teal-700 hover:shadow-xl hover:shadow-teal-700/35 hover:-translate-y-0.5 hover:scale-[1.01] active:translate-y-0 active:scale-95 focus:ring-4 focus:ring-teal-400 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <HeartHandshake className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                      <span>Donate Now — Submit Inquiry</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                <p className="mt-3 text-xs text-gray-400 flex items-center justify-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>
                    This form records your donation intention. No immediate payment or bank transfer is executed.
                  </span>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
