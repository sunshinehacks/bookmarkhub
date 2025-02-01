import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Privacy() {
  const navigate = useNavigate();

  return (
    <main className="flex-grow z-10 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-white hover:text-accent-yellow transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Home
        </button>

        <div className="bg-primary-dark/40 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-primary/50">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 text-accent-yellow" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white ml-4">Privacy Policy</h1>
          </div>

          <div className="space-y-8 text-white">
            <section className="space-y-4">
              <div className="flex items-center">
                <Lock className="w-6 h-6 text-accent-yellow mr-2" />
                <h2 className="text-2xl font-semibold">Data Security</h2>
              </div>
              <p className="leading-relaxed">
                We take the security of your data seriously. All your bookmarks and personal information are encrypted and stored securely. We use industry-standard encryption protocols to protect your data during transmission and storage.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center">
                <Eye className="w-6 h-6 text-accent-yellow mr-2" />
                <h2 className="text-2xl font-semibold">Data Collection</h2>
              </div>
              <p className="leading-relaxed">
                We collect only the necessary information needed to provide our service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email address for authentication</li>
                <li>Bookmark data you choose to save</li>
                <li>Basic profile information</li>
                <li>Usage analytics to improve our service</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center">
                <UserCheck className="w-6 h-6 text-accent-yellow mr-2" />
                <h2 className="text-2xl font-semibold">Your Rights</h2>
              </div>
              <p className="leading-relaxed">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Request data deletion</li>
                <li>Export your bookmarks</li>
                <li>Update your information</li>
                <li>Opt-out of communications</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-accent-yellow">Contact Us</h2>
              <p className="leading-relaxed">
                If you have any questions about our privacy policy or how we handle your data, please contact us through our support channels.
              </p>
            </section>

            <div className="text-sm text-white/70 mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}