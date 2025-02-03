import React, { useState, useRef } from 'react';
import { ArrowLeft, Send, Mail, MessageSquare, Phone, MapPin, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';

interface ValidationErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const navigate = useNavigate();
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateName = (name: string) => {
    if (!name.trim()) return 'Name is required';
    if (name.length < 2) return 'Name must be at least 2 characters long';
    if (name.length > 50) return 'Name must be less than 50 characters';
    if (!/^[a-zA-Z\s'-]+$/.test(name)) return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    return '';
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validateSubject = (subject: string) => {
    if (!subject.trim()) return 'Subject is required';
    if (subject.length < 3) return 'Subject must be at least 3 characters long';
    if (subject.length > 100) return 'Subject must be less than 100 characters';
    return '';
  };

  const validateMessage = (message: string) => {
    if (!message.trim()) return 'Message is required';
    if (message.length < 10) return 'Message must be at least 10 characters long';
    if (message.length > 1000) return 'Message must be less than 1000 characters';
    return '';
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    let error = '';
    switch (field) {
      case 'name':
        error = validateName(formData.name);
        break;
      case 'email':
        error = validateEmail(formData.email);
        break;
      case 'subject':
        error = validateSubject(formData.subject);
        break;
      case 'message':
        error = validateMessage(formData.message);
        break;
    }
    setValidationErrors(prev => ({ ...prev, [field]: error }));
    return error;
  };

  const validateForm = () => {
    const errors: ValidationErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      subject: validateSubject(formData.subject),
      message: validateMessage(formData.message)
    };
    setValidationErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true
    });

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (!form.current) return;

      await emailjs.sendForm(
        'service_76theav',
        'template_1xo50e1',
        form.current,
        'iBfIJ_kHmDoP-KeEp'
      );

      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setValidationErrors({});
      setTouched({});
    } catch (err: any) {
      setError('Failed to send message. Please try again later.');
      console.error('Email error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (touched[name]) {
      validateField(name);
    }
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

            <form ref={form} onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-accent-orange/20 border border-accent-orange/50 text-white rounded-lg text-sm flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-primary/20 border border-primary/50 text-white rounded-lg text-sm">
                  Thank you for your message! We'll get back to you soon.
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('name')}
                  className={`w-full bg-primary-dark/30 border ${
                    touched.name && validationErrors.name
                      ? 'border-accent-orange'
                      : 'border-primary/50'
                  } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300`}
                  required
                  disabled={loading}
                />
                {touched.name && validationErrors.name && (
                  <p className="mt-2 text-sm text-accent-orange">{validationErrors.name}</p>
                )}
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
                  onBlur={() => handleBlur('email')}
                  className={`w-full bg-primary-dark/30 border ${
                    touched.email && validationErrors.email
                      ? 'border-accent-orange'
                      : 'border-primary/50'
                  } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300`}
                  required
                  disabled={loading}
                />
                {touched.email && validationErrors.email && (
                  <p className="mt-2 text-sm text-accent-orange">{validationErrors.email}</p>
                )}
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
                  onBlur={() => handleBlur('subject')}
                  className={`w-full bg-primary-dark/30 border ${
                    touched.subject && validationErrors.subject
                      ? 'border-accent-orange'
                      : 'border-primary/50'
                  } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300`}
                  required
                  disabled={loading}
                />
                {touched.subject && validationErrors.subject && (
                  <p className="mt-2 text-sm text-accent-orange">{validationErrors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={() => handleBlur('message')}
                  rows={4}
                  className={`w-full bg-primary-dark/30 border ${
                    touched.message && validationErrors.message
                      ? 'border-accent-orange'
                      : 'border-primary/50'
                  } rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-accent-yellow transition-all duration-300`}
                  required
                  disabled={loading}
                />
                {touched.message && validationErrors.message && (
                  <p className="mt-2 text-sm text-accent-orange">{validationErrors.message}</p>
                )}
              </div>

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