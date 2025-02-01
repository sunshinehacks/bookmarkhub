import React from 'react';
import { ArrowLeft, BookMarked, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
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
            <BookMarked className="w-12 h-12 text-accent-yellow animate-float" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white ml-4">About BookmarkHub</h1>
          </div>

          <div className="space-y-6 text-white">
            <p className="text-lg leading-relaxed">
              BookmarkHub is your personal bookmark manager designed to help you organize and access your favorite web resources efficiently. Our platform combines beautiful design with powerful functionality to create the ultimate bookmarking experience.
            </p>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-accent-yellow">Our Mission</h2>
              <p className="leading-relaxed">
                We believe in making web organization simple and beautiful. Our mission is to help users maintain their digital life organized while providing a seamless and enjoyable experience.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-accent-yellow">Key Features</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>Beautiful and intuitive interface</li>
                <li>Customizable bookmark categories</li>
                <li>Secure user authentication</li>
                <li>Cloud synchronization</li>
                <li>Responsive design for all devices</li>
                <li>Custom icons and colors</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-accent-yellow">Our Team</h2>
              <p className="leading-relaxed">
                BookmarkHub is created by a passionate team of developers and designers who love creating beautiful and functional web applications. We're constantly working to improve and enhance the platform based on user feedback.
              </p>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center text-lg">
                Made with <Heart className="w-5 h-5 mx-2 text-accent-orange animate-pulse" /> by INFIP
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}