'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { pageService, Page } from '../services/api';

export default function TermsOfServicePage() {
  const [pageContent, setPageContent] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        const response = await pageService.getPageBySlug('terms');
        setPageContent(response);
      } catch (err) {
        console.error('Error fetching Terms of Service content:', err);
        setError('Failed to load page content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // If we have dynamic content, use it, otherwise fall back to the static content
  if (pageContent && pageContent.content) {
    return (
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">{pageContent.title}</h1>
            <p className="mt-4 text-lg text-gray-500">
              Last updated: {new Date(pageContent.updated_at || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="mt-12 prose prose-blue prose-lg mx-auto" 
               dangerouslySetInnerHTML={{ __html: pageContent.content }} />
        </div>
      </div>
    );
  }
  
  // Fallback to static content if API fails or returns empty content
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Terms of Service</h1>
          <p className="mt-4 text-lg text-gray-500">
            Last updated: June 1, 2023
          </p>
        </div>

        <div className="mt-12 prose prose-blue prose-lg mx-auto">
          <h2>Introduction</h2>
          <p>
            Welcome to Doctor Finder. These Terms of Service ("Terms") govern your use of our website, services, and applications (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.
          </p>

          <h2>Use of the Service</h2>
          <p>
            Doctor Finder provides a platform for users to find healthcare professionals and book appointments. We do not provide medical advice, diagnosis, or treatment. The content on our Service is for informational purposes only.
          </p>
          <p>
            You are responsible for:
          </p>
          <ul>
            <li>Providing accurate and complete information when creating an account</li>
            <li>Maintaining the security of your account credentials</li>
            <li>All activities that occur under your account</li>
            <li>Complying with all applicable laws and regulations</li>
          </ul>

          <h2>User Accounts</h2>
          <p>
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <p>
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. We encourage you to use "strong" passwords (passwords that use a combination of upper and lower case letters, numbers, and symbols) with your account.
          </p>

          <h2>Appointments and Cancellations</h2>
          <p>
            When you book an appointment through our Service, you agree to attend the appointment or cancel it according to the healthcare provider's cancellation policy. Repeated no-shows or late cancellations may result in restrictions on your ability to use the Service.
          </p>

          <h2>Reviews and Content</h2>
          <p>
            Our Service may allow you to post reviews, comments, and other content. You are solely responsible for the content that you post, and you agree not to post content that:
          </p>
          <ul>
            <li>Is false, misleading, or deceptive</li>
            <li>Is defamatory, obscene, or offensive</li>
            <li>Infringes on any third party's intellectual property rights</li>
            <li>Violates any law or regulation</li>
          </ul>

          <h2>Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Doctor Finder and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>

          <h2>Limitation of Liability</h2>
          <p>
            In no event shall Doctor Finder, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
          </p>

          <h2>Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <p>
            <Link href="/contact" className="text-blue-600 hover:text-blue-800">
              Contact Us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}