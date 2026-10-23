import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { contactApi } from "@/api";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useToast } from "@/components/common/Toast";
import Button from "@/components/common/Button";

// Validate contact form fields.
function validate({ name, email, message }) {
  const errors = {};
  if (!name.trim()) errors.name = "Name is required.";
  // Simple email format check.
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!message.trim()) {
    errors.message = "Message is required.";
  } else if (message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }
  return errors;
}

export default function Contact() {
  useDocumentTitle("Contact Us — GiveHope");

  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await contactApi.create(form);
      setSubmitted(true);
      toast("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      toast("Failed to send message. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (fieldName) =>
    [
      "w-full px-4 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all",
      errors[fieldName] ? "border-red-300 bg-red-50/30" : "border-gray-200",
    ].join(" ");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Get in Touch
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Have a question, partnership idea, or want to learn more?
          We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Contact info */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: Mail, label: "Email", value: "hello@givehope.org" },
            { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
            { icon: MapPin, label: "Address", value: "123 Impact Street, Portland, OR 97201" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-teal-50 text-teal-600 shrink-0">
                <item.icon className="w-5 h-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-5"
          >
            {submitted && (
              <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                <CheckCircle2 className="w-5 h-5" />
                Message sent! We'll get back to you soon.
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass("name")}
                placeholder="Your name"
              />
              {errors.name && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass("email")}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                Message
              </label>
              <textarea
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                className={inputClass("message") + " resize-none"}
                placeholder="How can we help? (min 10 characters)"
              />
              {errors.message && (
                <p className="flex items-center gap-1 mt-1 text-xs text-red-600">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message}
                </p>
              )}
            </div>

            <Button type="submit" size="lg" fullWidth loading={submitting}>
              <Send className="w-4 h-4" />
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
