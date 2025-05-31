import axios from 'axios';
import { API_URL } from '../config';

// Configurer l'instance axios avec l'URL de base
const api = axios.create({
  baseURL: API_URL
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Soumettre une candidature à une offre d'emploi
 * @param {Object} applicationData - Les données de la candidature
 * @param {File} cvFile - Le fichier CV
 * @returns {Promise} - La réponse de l'API
 */
export const submitJobApplication = async (applicationData, cvFile) => {
  try {
    // Créer un objet FormData pour envoyer des fichiers
    const formData = new FormData();
    formData.append('cv_file', cvFile);
    formData.append('job_id', applicationData.jobId);
    formData.append('company_name', applicationData.companyName);
    formData.append('job_title', applicationData.jobTitle);
    formData.append('cover_letter', applicationData.coverLetter);
    formData.append('experience_level', applicationData.experienceLevel);

    const response = await api.post('/api/applications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la soumission de la candidature:', error);
    throw error;
  }
};

/**
 * Récupérer toutes les candidatures de l'utilisateur connecté
 * @returns {Promise} - La réponse de l'API
 */
export const getUserApplications = async () => {
  try {
    const response = await api.get('/api/applications');
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des candidatures:', error);
    throw error;
  }
};

/**
 * Récupérer une candidature spécifique
 * @param {number} applicationId - L'ID de la candidature
 * @returns {Promise} - La réponse de l'API
 */
export const getApplicationById = async (applicationId) => {
  try {
    const response = await api.get(`/api/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération de la candidature ${applicationId}:`, error);
    throw error;
  }
};

/**
 * Supprimer une candidature
 * @param {number} applicationId - L'ID de la candidature à supprimer
 * @returns {Promise} - La réponse de l'API
 */
export const deleteApplication = async (applicationId) => {
  try {
    const response = await api.delete(`/api/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la suppression de la candidature ${applicationId}:`, error);
    throw error;
  }
};
