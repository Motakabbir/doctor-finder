'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { faqService, Faq } from '../services/api';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setLoading(true);
        const response = await faqService.getFaqs();
        setFaqs(response);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg text-gray-500">
            Find answers to common questions about Doctor Finder services.
          </p>
        </div>

        {loading ? (
          <div className="mt-12 text-center">
            <p>Loading FAQs...</p>
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="mt-12">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12">
              {faqs.length > 0 ? faqs.map((faq) => (
                <div key={faq.id} className="border-b border-gray-200 pb-4">
                  <dt className="text-lg font-medium text-gray-900">{faq.question}</dt>
                  <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
                </div>
              )) : (
                <div className="col-span-2 text-center py-10">
                  <p>No FAQs found.</p>
                </div>
              )}
            </dl>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-base text-gray-500">
            Can't find the answer you're looking for? Contact our{' '}
            <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
              customer support team
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

// The FAQs are now fetched dynamically from the API using faqService.getFaqs()