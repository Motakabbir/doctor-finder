// API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types
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