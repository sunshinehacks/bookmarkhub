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

          <form
            name="contact"
            method="POST"
            data-netlify="true"
            className="space-y-4"
          >
            {/* Hidden Netlify Form Data */}
            <input type="hidden" name="form-name" value="contact" />
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white mb-1">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full bg-primary-dark/30 border border-primary/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gradient-to-r from-accent-orange to-accent-yellow text-white rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-yellow transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Send Message</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
