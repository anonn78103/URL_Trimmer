import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ScissorsLineDashed, 
  ArrowLeft,
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Footer from './Footer';

const Terms = () => {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: `By accessing and using URL Trimmer, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`
    },
    {
      title: 'Description of Service',
      content: `URL Trimmer provides a web-based service that allows users to create shortened URLs. The service includes URL shortening, click tracking, and link management features.`
    },
    {
      title: 'User Accounts',
      content: `To use certain features of the service, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`
    },
    {
      title: 'Acceptable Use',
      content: `You agree not to use the service to: (a) violate any applicable laws or regulations; (b) infringe upon the rights of others; (c) distribute malware or harmful content; (d) engage in spam or phishing activities.`
    },
    {
      title: 'Content and Links',
      content: `You are responsible for the content and links you create. We do not endorse, support, or verify the content of shortened URLs. Users should exercise caution when clicking on shortened links.`
    },
    {
      title: 'Privacy and Data',
      content: `We collect and process data as described in our Privacy Policy. By using the service, you consent to such processing and warrant that all data provided is accurate.`
    },
    {
      title: 'Service Availability',
      content: `We strive to maintain high service availability but do not guarantee uninterrupted access. The service may be temporarily unavailable due to maintenance, updates, or technical issues.`
    },
    {
      title: 'Limitation of Liability',
      content: `In no event shall URL Trimmer be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.`
    },
    {
      title: 'Termination',
      content: `We may terminate or suspend your account and access to the service at any time, with or without cause, with or without notice, effective immediately.`
    },
    {
      title: 'Changes to Terms',
      content: `We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service. Continued use after changes constitutes acceptance of new terms.`
    }
  ];

  const prohibitedUses = [
    'Malware distribution',
    'Phishing websites',
    'Illegal content',
    'Spam campaigns',
    'Copyright infringement',
    'Harassment or abuse',
    'Fraudulent activities',
    'Violence or hate speech'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link to="/" className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <ScissorsLineDashed className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">URL Trimmer</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
              <Link
                to="/login"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="mx-auto h-20 w-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Terms of
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {' '}Service
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Please read these terms carefully before using our service. 
                By using URL Trimmer, you agree to be bound by these terms.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Last updated: January 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span>Legal compliance</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {sections.map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-3">
                    <span className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </span>
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Prohibited Uses */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Prohibited Uses
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The following activities are strictly prohibited and may result in account termination
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prohibitedUses.map((use, index) => (
                <motion.div
                  key={use}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg border border-red-200"
                >
                  <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{use}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/about"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Learn More About Us
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Terms;
