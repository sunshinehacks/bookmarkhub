import React from 'react';
import { ArrowLeft, Scale, FileText, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Terms() {
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
            <Scale className="w-12 h-12 text-accent-yellow" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white ml-4">Terms of Service</h1>
          </div>

          <div className="space-y-8 text-white">
            <section className="space-y-4">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-accent-yellow mr-2" />
                <h2 className="text-2xl font-semibold">Agreement to Terms</h2>
              </div>
              <p className="leading-relaxed">
                By accessing or using BookmarkHub, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-accent-yellow">Use License</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Personal and non-commercial use only</li>
                <li>No reproduction or distribution without permission</li>
                <li>No modification or derivative works</li>
                <li>No unauthorized access attempts</li>
              </ul>
            </section>

            <section className="space-y-4">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-accent-yellow mr-2" />
                <h2 className="text-2xl font-semibold">Limitations</h2>
              </div>
              <p className="leading-relaxed">
                BookmarkHub shall not be liable for any damages arising out of the use or inability to use our services. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Modify or discontinue services</li>
                <li>Remove content violating our policies</li>
                <li>Suspend accounts for violations</li>
                <li>Update these terms at any time</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-accent-yellow">User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintain account security</li>
                <li>Provide accurate information</li>
                <li>Comply with all applicable laws</li>
                <li>Report suspicious activities</li>
              </ul>
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