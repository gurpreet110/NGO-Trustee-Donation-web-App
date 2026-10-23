import { Link } from "react-router-dom";
import { Heart, Target, Eye, Users, ArrowRight, Award, Globe2 } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function About() {
  useDocumentTitle("About Us — GiveHope");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium mb-4">
          <Heart className="w-4 h-4" />
          Our Story
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Building a world where giving is simple and transparent.
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed">
          GiveHope was founded in 2015 with a simple belief: that everyone deserves
          access to the basics of a dignified life — clean water, education, healthcare,
          and safety. We connect donors directly to vetted, high-impact campaigns
          run by trusted trustees on the ground.
        </p>
      </div>

      {/* Mission, Vision, Values */}
      <div className="grid sm:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Target, title: "Our Mission", desc: "To democratize philanthropy by making it easy for anyone to support verified, high-impact causes anywhere in the world." },
          { icon: Eye, title: "Our Vision", desc: "A world where every community has the resources it needs to thrive, powered by transparent and accountable giving." },
          { icon: Heart, title: "Our Values", desc: "Transparency, accountability, community-driven impact, and respect for the dignity of every person we serve." },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-teal-50 text-teal-600 mb-4">
              <card.icon className="w-6 h-6" />
            </span>
            <h3 className="font-bold text-lg text-gray-900 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Impact stats */}
      <div className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl p-8 sm:p-12 text-white mb-12">
        <h2 className="text-2xl font-bold text-center mb-8">Our Impact So Far</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "₹2.4 Cr", label: "Total Raised" },
            { value: "48", label: "Campaigns Funded" },
            { value: "30+", label: "Countries Reached" },
            { value: "12K+", label: "Donors" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-teal-100 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
        <div className="space-y-4">
          {[
            { icon: Award, title: "Trustees vet campaigns", desc: "Our board of trustees reviews every campaign to ensure it meets our standards for impact and feasibility." },
            { icon: Users, title: "Donors contribute", desc: "Browse active campaigns and donate to the causes that resonate with you. Every rupee is tracked." },
            { icon: Globe2, title: "Impact is delivered", desc: "Funds are disbursed to on-the-ground partners who deliver the promised outcomes, with regular updates." },
          ].map((step, i) => (
            <div
              key={step.title}
              className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
            >
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 text-teal-600 shrink-0 font-bold text-lg">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-gray-50 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Want to be part of the change?
        </h2>
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors"
        >
          Explore Campaigns
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
}
