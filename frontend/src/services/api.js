import axios from 'axios';

// Configuration de l'API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

// Intercepteur pour ajouter le token aux requêtes
api.interceptors.request.use(
  (config) => {
    // Utiliser le token du localStorage si disponible
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Activer l'envoi des cookies avec les requêtes
    config.withCredentials = true;
    
    console.log('API Request:', {
      url: `${config.baseURL}${config.url}`,
      method: config.method,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: `${response.config.baseURL}${response.config.url}`,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Response Error:', {
      status: error.response?.status,
      url: error.config ? `${error.config.baseURL}${error.config.url}` : 'Unknown URL',
      data: error.response?.data,
      message: error.message
    });

    // Gérer les erreurs 401 (non autorisé)
    if (error.response && error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        // Essayer de rafraîchir le token
        const refreshResponse = await api.post('/api/auth/refresh');
        const newToken = refreshResponse.data.token;
        
        if (newToken) {
          localStorage.setItem('token', newToken);
          // Mettre à jour le header d'autorisation avec le nouveau token
          error.config.headers.Authorization = `Bearer ${newToken}`;
          // Réessayer la requête originale
          return api(error.config);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Rediriger vers la page de connexion en cas d'échec
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Fonction pour créer les en-têtes d'authentification HTTP Basic
const createBasicAuthHeader = (username, password) => {
  // Créer un token Base64 à partir des identifiants (username:password)
  const token = btoa(`${username}:${password}`);
  return {
    headers: {
      'Authorization': `Basic ${token}`
    }
  };
};

// Services d'authentification
export const authService = {
  // Méthode de connexion avec HTTP Basic Auth
  login: (credentials) => {
    return api.post(
      '/api/auth/login', 
      {}, 
      createBasicAuthHeader(credentials.email, credentials.password)
    );
  },
  
  // Méthode d'inscription standard
  register: (userData) => api.post('/api/auth/register', userData),
  
  // Méthodes d'authentification sociale
  googleAuth: (tokenData) => api.post('/api/auth/social/google', tokenData),
  facebookAuth: (tokenData) => api.post('/api/auth/social/facebook', tokenData),
  
  // Méthodes pour obtenir les URLs d'authentification
  getGoogleAuthUrl: () => api.get('/login/google'),
  getFacebookAuthUrl: () => api.get('/login/facebook'),
  
  // Autres méthodes d'authentification
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/api/auth/reset-password', { token, password }),
  logout: () => api.post('/api/auth/logout'),
  getProfile: () => api.get('/api/auth/profile'),
  updateProfile: (profileData) => api.put('/api/auth/profile', profileData),
};

// Services des offres d'emploi
export const jobsService = {
  getJobs: (params) => api.get('/api/jobs', { params }),
  getJob: (id) => api.get(`/api/jobs/${id}`),
  createJob: (jobData) => api.post('/api/jobs', jobData),
  updateJob: (id, jobData) => api.put(`/api/jobs/${id}`, jobData),
  deleteJob: (id) => api.delete(`/api/jobs/${id}`),
  applyToJob: (id) => api.post(`/api/jobs/${id}/apply`),
};

// Services des événements
export const eventsService = {
  getEvents: (params) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  registerToEvent: (id) => api.post(`/events/${id}/register`),
};

// Services de messagerie
export const messagesService = {
  getConversations: () => api.get('/messages/conversations'),
  getMessages: (userId) => api.get(`/messages/${userId}`),
  sendMessage: (userId, content) => api.post(`/messages/${userId}`, { content }),
};

// Services des paramètres
export const settingsService = {
  getSettings: () => api.get('/settings'),
  updateNotifications: (settings) => api.put('/settings/notifications', settings),
  updatePrivacy: (settings) => api.put('/settings/privacy', settings),
};

export default api;