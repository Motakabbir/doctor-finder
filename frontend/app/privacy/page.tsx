'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { pageService, Page } from '../services/api';

export default function PrivacyPolicyPage() {
  const [pageContent, setPageContent] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        const response = await pageService.getPageBySlug('privacy');
        setPageContent(response);
      } catch (err) {
        console.error('Error fetching Privacy Policy content:', err);
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
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Privacy Policy</h1>
          <p className="mt-4 text-lg text-gray-500">
            Last updated: June 1, 2023
          </p>
        </div>

        <div className="mt-12 prose prose-blue prose-lg mx-auto">
          <h2>Introduction</h2>
          <p>
            At Doctor Finder, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our service. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <h2>Information We Collect</h2>
          <p>
            We collect information that you provide directly to us when you register for an account, create or modify your profile, set preferences, sign-up for or make purchases through the Services.
          </p>
          <p>
            This information may include:
          </p>
          <ul>
            <li>Name, email address, phone number, and other contact information</li>
            <li>Password and security information</li>
            <li>Profile information such as your photo, address, and preferences</li>
            <li>Health information that you choose to share when booking appointments</li>
            <li>Payment information when you make transactions</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, maintain, and improve our services</li>
            <li>Process transactions and send related information</li>
            <li>Send administrative messages, updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Personalize your experience and deliver content relevant to your interests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          </ul>

          <h2>Information Sharing and Disclosure</h2>
          <p>
            We may share your personal information with:
          </p>
          <ul>
            <li>Healthcare providers when you book appointments</li>
            <li>Service providers who perform services on our behalf</li>
            <li>Professional advisors, such as lawyers, auditors, and insurers</li>
            <li>Government bodies when required by law</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
          </p>

          <h2>Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, such as:
          </p>
          <ul>
            <li>The right to access personal information we hold about you</li>
            <li>The right to request that we correct any inaccurate personal information</li>
            <li>The right to request that we delete your personal information</li>
            <li>The right to opt out of marketing communications</li>
          </ul>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
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