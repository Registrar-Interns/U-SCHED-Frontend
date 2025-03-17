// // Base API configuration
// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// // Helper function for making API requests
// async function fetchApi(endpoint: string, options: RequestInit = {}) {
//   const url = `${API_BASE_URL}${endpoint}`;
  
//   // Get token from localStorage if available
//   const token = localStorage.getItem('token');
  
//   // Set default headers
//   const headers = {
//     'Content-Type': 'application/json',
//     ...(token && { Authorization: `Bearer ${token}` }),
//     ...options.headers,
//   };
  
//   try {
//     const response = await fetch(url, {
//       ...options,
//       headers,
//     });
    
//     // Handle non-2xx responses
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       throw new Error(errorData.message || `API Error: ${response.status}`);
//     }
    
//     // Parse JSON response
//     return await response.json();
//   } catch (error) {
//     console.error('API request failed:', error);
//     throw error;
//   }
// }

// // Professor API endpoints
// export const professorApi = {
//   // Get all professors
//   getAll: () => fetchApi('/professors'),
  
//   // Get professor by ID
//   getById: (id: string) => fetchApi(`/professors/${id}`),
  
//   // Add new professor
//   add: (data: any) => fetchApi('/professors', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   }),
  
//   // Update professor
//   update: (id: string, data: any) => fetchApi(`/professors/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(data),
//   }),
  
//   // Delete professor
//   delete: (id: string) => fetchApi(`/professors/${id}`, {
//     method: 'DELETE',
//   }),
  
//   // Get professor time availability
//   getTimeAvailability: (id: string) => fetchApi(`/professors/${id}/time-availability`),
  
//   // Update professor time availability
//   updateTimeAvailability: (id: string, data: any) => fetchApi(`/professors/${id}/time-availability`, {
//     method: 'PUT',
//     body: JSON.stringify(data),
//   }),
// };

// // Section API endpoints
// export const sectionApi = {
//   // Get all sections
//   getAll: () => fetchApi('/sections'),
  
//   // Get section by ID
//   getById: (id: string) => fetchApi(`/sections/${id}`),
  
//   // Add new section
//   add: (data: any) => fetchApi('/sections', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   }),
  
//   // Update section
//   update: (id: string, data: any) => fetchApi(`/sections/${id}`, {
//     method: 'PUT',
//     body: JSON.stringify(data),
//   }),
  
//   // Delete section
//   delete: (id: string) => fetchApi(`/sections/${id}`, {
//     method: 'DELETE',
//   }),
// };

// // College API endpoints
// export const collegeApi = {
//   // Get all colleges
//   getAll: () => fetchApi('/professors/colleges/all'),
// };

// // Export other API services as needed 