'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { blogService, Blog } from '../services/api';
import { format } from 'date-fns';

export default function BlogPage() {  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const postsPerPage = 9;

  const categories = [
    'All Categories',
    'Wellness',
    'Mental Health',
    'Nutrition',
    'Fitness',
    'Chronic Care',
    'Sleep',
    'Preventive Care'
  ];
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await blogService.getBlogs({
          page: currentPage,
          per_page: postsPerPage,
          search: searchTerm,
          category: selectedCategory
        });
        setBlogs(response.data);
        setTotalPages(Math.ceil(response.total / postsPerPage));
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blog posts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Add debounce for search
    const timeoutId = setTimeout(fetchBlogs, 300);
    return () => clearTimeout(timeoutId);
  }, [currentPage, searchTerm, selectedCategory]);

  // Function to estimate reading time based on content length
  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min`;
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Health Tips & Articles</h1>          <p className="mt-4 text-lg text-gray-500">
            Expert advice and insights to help you maintain optimal health
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mt-8 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                id="search"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map((category) => (
                  <option key={category} value={category === 'All Categories' ? '' : category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-12 text-center">
            <p>Loading blog posts...</p>
          </div>
        ) : error ? (
          <div className="mt-12 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.length > 0 ? blogs.map((post) => (
              <div key={post.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div className="flex-shrink-0">
                  <img 
                    className="h-48 w-full object-cover" 
                    src={post.image_url || 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'} 
                    alt={post.title} 
                  />
                </div>
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-blue-600">
                      {post.category}
                    </p>
                    <Link href={`/blog/${post.slug}`} className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                      <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                    </Link>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full" 
                        src={post.author?.imageUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'} 
                        alt={post.author?.name || 'Author'} 
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{post.author?.name || 'Anonymous'}</p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{getReadingTime(post.content)} read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-3 text-center py-10">
                <p>No blog posts found.</p>
              </div>
            )}          </div>
        )}

        {/* Pagination */}
        {!loading && !error && blogs.length > 0 && (
          <div className="mt-12">
            <nav className="flex items-center justify-center" aria-label="Pagination">
              <button
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b">
                Page {currentPage} of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-base text-gray-500">
            Want to contribute or have a topic suggestion?{' '}
            <Link href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

const blogPosts = [
  {
    id: '1',
    title: 'Understanding Preventive Healthcare',
    excerpt: 'Learn how preventive care can help you avoid serious health problems and save money in the long run.',
    imageUrl: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Wellness',
    date: 'Mar 16, 2023',
    datetime: '2023-03-16',
    readingTime: '6 min',
    author: {
      name: 'Dr. Sarah Johnson',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    }
  },
  {
    id: '2',
    title: 'The Importance of Mental Health',
    excerpt: 'Discover why mental health is just as important as physical health and how to maintain good mental wellbeing.',
    imageUrl: 'https://images.unsplash.com/photo-1493836512294-502baa1986e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Mental Health',
    date: 'Apr 2, 2023',
    datetime: '2023-04-02',
    readingTime: '8 min',
    author: {
      name: 'Dr. Michael Chen',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    }
  },
  {
    id: '3',
    title: 'Nutrition Basics: Eating for Health',
    excerpt: 'A comprehensive guide to understanding nutrition labels and making healthier food choices.',
    imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Nutrition',
    date: 'May 11, 2023',
    datetime: '2023-05-11',
    readingTime: '5 min',
    author: {
      name: 'Dr. Emily Rodriguez',
      imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    }
  },
  {
    id: '4',
    title: 'Exercise at Any Age: Staying Active',
    excerpt: 'Tips for maintaining an active lifestyle regardless of your age or fitness level.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Fitness',
    date: 'Jun 7, 2023',
    datetime: '2023-06-07',
    readingTime: '7 min',
    author: {
      name: 'Dr. James Wilson',
      imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    }
  },
  {
    id: '5',
    title: 'Managing Chronic Conditions',
    excerpt: 'Strategies for effectively managing chronic health conditions and improving quality of life.',
    imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Chronic Care',
    date: 'Jul 22, 2023',
    datetime: '2023-07-22',
    readingTime: '9 min',
    author: {
      name: 'Dr. Patricia Lee',
      imageUrl: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    }
  },
  {
    id: '6',
    title: 'Sleep Hygiene: The Key to Better Rest',
    excerpt: 'Learn how to improve your sleep habits for better health and increased energy.',
    imageUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    category: 'Sleep',
    date: 'Aug 14, 2023',
    datetime: '2023-08-14',
    readingTime: '6 min',
    author: {
      name: 'Dr. Robert Thompson',
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80'
    }
  }
];