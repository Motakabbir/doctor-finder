'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { pageService, Page } from '../services/api';

export default function AboutPage() {
  const [pageContent, setPageContent] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        setLoading(true);
        const response = await pageService.getPageBySlug('about');
        setPageContent(response);
      } catch (err) {
        console.error('Error fetching About page content:', err);
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
          </div>
          <div className="mt-12 prose prose-blue prose-lg mx-auto" 
               dangerouslySetInnerHTML={{ __html: pageContent.content }} />
        </div>
      </div>
    );
  }
  
  // Fallback to static content if API fails or returns empty content
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            About Doctor Finder
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-blue-100">
            Connecting patients with the right healthcare professionals since 2023.
          </p>
        </div>
      </div>

      {/* Mission section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Our Mission
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                At Doctor Finder, our mission is to make healthcare more accessible by connecting patients with qualified healthcare professionals. We believe everyone deserves access to quality healthcare, and we're committed to making the process of finding and booking appointments with doctors as seamless as possible.
              </p>
              <p className="mt-4 text-lg text-gray-500">
                We strive to empower patients with information and tools to make informed decisions about their health, while also providing healthcare professionals with a platform to reach more patients and manage their practice efficiently.
              </p>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Medical team meeting"
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              These core principles guide everything we do at Doctor Finder.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              {values.map((value) => (
                <div key={value.name} className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mx-auto">
                    <value.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{value.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Our Leadership Team
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
              Meet the people behind Doctor Finder.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((person) => (
                <div key={person.name} className="text-center">
                  <div className="space-y-4">
                    <img
                      className="mx-auto h-40 w-40 rounded-full xl:w-56 xl:h-56 object-cover"
                      src={person.imageUrl}
                      alt={person.name}
                    />
                    <div className="space-y-2">
                      <div className="text-lg leading-6 font-medium space-y-1">
                        <h3 className="text-gray-900">{person.name}</h3>
                        <p className="text-blue-600">{person.role}</p>
                      </div>
                      <p className="text-gray-500">{person.bio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to find your doctor?</span>
            <span className="block text-blue-200">Start your search today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="/doctors"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Find a Doctor
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple icon components
function ShieldCheckIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}

function HeartIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function LightBulbIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
      />
    </svg>
  );
}

const values = [
  {
    name: 'Trust',
    description: 'We build trust through transparency, verification, and consistently delivering on our promises.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Care',
    description: 'We genuinely care about improving healthcare outcomes and experiences for both patients and providers.',
    icon: HeartIcon,
  },
  {
    name: 'Innovation',
    description: 'We continuously seek new ways to improve our platform and make healthcare more accessible.',
    icon: LightBulbIcon,
  },
];

const team = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'CEO & Co-Founder',
    bio: 'Former practicing physician with 15 years of experience in healthcare management.',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
  },
  {
    name: 'Michael Chen',
    role: 'CTO & Co-Founder',
    bio: 'Tech innovator with a passion for creating solutions that improve healthcare accessibility.',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
  },
  {
    name: 'Dr. Amara Patel',
    role: 'Chief Medical Officer',
    bio: 'Board-certified physician dedicated to ensuring medical excellence across our platform.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80',
  },
];