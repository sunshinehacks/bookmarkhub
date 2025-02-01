import React, { useState } from 'react';
import { ArrowLeft, Send, Mail, MessageSquare, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setLoading(false);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
            <MessageSquare className="w-12 h-12 text-accent-yellow" />
            <h1 className="text-3xl sm:text-4xl font-bold text-white ml-4">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Get in Touch</h2>
                <p className="text-white/90 leading-relaxed">
                  Have questions or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-white">
                  <Mail className="w-5 h-5 text-accent-yellow mr-3" />
                  <span>support@bookmarkhub.com</span>
                </div>
                <div className="flex items-center text-white">
                  <Phone className="w-5 h-5 text-accent-yellow mr-3" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-white">
                  <MapPin className="w-5 h-5 text-accent-yellow mr-3" />
                  <span>123 Bookmark Street, Web City, IN 12345</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                  required
                  disabled={loading}
                />
              </div>

              {success && (
                <div className="p-4 bg-primary/20 border border-primary/50 text-white rounded-lg text-sm">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}