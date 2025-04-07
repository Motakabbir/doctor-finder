// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
// Blog types
export interface BlogAuthor {
  id: number;
  name: string;
  imageUrl: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  category: string;
  published_at: string;
  is_published: boolean;
  author: BlogAuthor;
}

export interface BlogListResponse {
  data: Blog[];
  total: number;
  page: number;
  per_page: number;
}

// FAQ types
export interface Faq {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_active: boolean;
}

// Page types
export interface Page {
  id: number;
  slug: string;
  title: string;
  content: any;
  meta_title: string;
  meta_description: string;
  is_active: boolean;
}

// Settings types
export interface Settings {
  [key: string]: any;
}

export interface Doctor {
  id: number;
  name: string;
  slug: string;
  photo: string;
  bio: string;
  speciality: string;
  experience_years: number;
  rating: number;
  degrees: string[];
  certifications: string[];
  availability: {
    day: string;
    slots: string[];
  }[];
}

export interface DoctorListResponse {
  data: Doctor[];
  total: number;
  page: number;
  per_page: number;
}

// API error type
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.message);
  }
  return response.json();
}

// Doctor API services
export const doctorService = {
  // Get all doctors with optional filters
  async getDoctors(params?: {
    search?: string;
    speciality?: string;
    page?: number;
    per_page?: number;
  }): Promise<DoctorListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.set('search', params.search);
    if (params?.speciality) queryParams.set('speciality', params.speciality);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.per_page) queryParams.set('per_page', params.per_page.toString());

    const response = await fetch(`${API_BASE_URL}/doctors?${queryParams}`);
    return handleResponse<DoctorListResponse>(response);
  },

  // Get a single doctor by slug
  async getDoctorBySlug(slug: string): Promise<Doctor> {
    const response = await fetch(`${API_BASE_URL}/doctors/${slug}`);
    return handleResponse<Doctor>(response);
  },

  // Book an appointment
  async bookAppointment(doctorId: number, data: {
    date: string;
    time: string;
    patient_name: string;
    patient_email: string;
    patient_phone: string;
  }): Promise<{ appointment_id: number }> {
    const response = await fetch(`${API_BASE_URL}/doctors/${doctorId}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse<{ appointment_id: number }>(response);
  },
};

// Blog API services
export const blogService = {
  // Get all blogs with optional filters
  async getBlogs(params?: {
    category?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<BlogListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.set('category', params.category);
    if (params?.search) queryParams.set('search', params.search);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.per_page) queryParams.set('per_page', params.per_page.toString());

    const response = await fetch(`${API_BASE_URL}/blogs?${queryParams}`);
    return handleResponse<BlogListResponse>(response);
  },

  // Get a single blog by slug or ID
  async getBlogBySlug(slug: string): Promise<Blog> {
    const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
    return handleResponse<Blog>(response);
  },
};

// FAQ API services
export const faqService = {
  // Get all FAQs with optional category filter
  async getFaqs(category?: string): Promise<Faq[]> {
    const queryParams = new URLSearchParams();
    if (category) queryParams.set('category', category);

    const response = await fetch(`${API_BASE_URL}/faqs?${queryParams}`);
    return handleResponse<Faq[]>(response);
  },

  // Get a single FAQ by ID
  async getFaqById(id: number): Promise<Faq> {
    const response = await fetch(`${API_BASE_URL}/faqs/${id}`);
    return handleResponse<Faq>(response);
  },
};

// Page API services
export const pageService = {
  // Get all pages
  async getPages(): Promise<Page[]> {
    const response = await fetch(`${API_BASE_URL}/pages`);
    return handleResponse<Page[]>(response);
  },

  // Get a single page by slug
  async getPageBySlug(slug: string): Promise<Page> {
    const response = await fetch(`${API_BASE_URL}/pages/${slug}`);
    return handleResponse<Page>(response);
  },
};

// Settings API services
export const settingService = {
  // Get all settings or settings by group
  async getSettings(group?: string): Promise<Settings> {
    const queryParams = new URLSearchParams();
    if (group) queryParams.set('group', group);

    const response = await fetch(`${API_BASE_URL}/settings?${queryParams}`);
    return handleResponse<Settings>(response);
  },

  // Get a specific setting by key
  async getSettingByKey(key: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/settings/${key}`);
    return handleResponse<any>(response);
  },
};