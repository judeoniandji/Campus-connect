import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as MoneyIcon,
  School as SchoolIcon,
  Upload as UploadIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getSenegalJobs } from '../api/senegal';  // Assurez-vous que cette API existe
import { submitJobApplication } from '../api/applications';

const Jobs = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [fieldFilter, setFieldFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [experience, setExperience] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Liste des domaines d'études disponibles
  const studyFields = [
    { id: '', name: 'Tous les domaines' },
    { id: 'computer_science', name: 'Informatique' },
    { id: 'law', name: 'Droit' },
    { id: 'finance', name: 'Finance' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'engineering', name: 'Ingénierie' },
    { id: 'environmental_law', name: 'Droit environnemental' },
    { id: 'data_science', name: 'Science des données' },
    { id: 'logistics', name: 'Logistique' },
    { id: 'electrical_engineering', name: 'Génie électrique' }
  ];
  
  // Liste des localisations au Sénégal
  const senegalLocations = [
    { id: '', name: 'Toutes les villes' },
    { id: 'Dakar', name: 'Dakar' },
    { id: 'Saint-Louis', name: 'Saint-Louis' },
    { id: 'Thiès', name: 'Thiès' },
    { id: 'Ziguinchor', name: 'Ziguinchor' },
    { id: 'Kaolack', name: 'Kaolack' },
    { id: 'Touba', name: 'Touba' },
    { id: 'Richard-Toll', name: 'Richard-Toll' },
    { id: 'Mbour', name: 'Mbour' },
    { id: 'Remote', name: 'Télétravail' }
  ];

  // Charger les offres d'emploi depuis l'API
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // Utiliser l'API réelle si disponible, sinon simuler
        const response = await getSenegalJobs();
        if (response && response.status === 'success') {
          setJobs(response.data);
        } else {
          // Données simulées en cas d'échec de l'API
          setJobs([
            {
              id: "sonatel_dev_1",
              title: "Développeur Full-Stack",
              company_name: "Sonatel (Orange Sénégal)",
              location: "Dakar",
              job_type: "full_time",
              salary: "1 500 000 - 2 000 000 FCFA",
              description: "Sonatel recherche un développeur Full-Stack pour rejoindre notre équipe de développement numérique.",
              required_skills: ["javascript", "react", "node.js", "mongodb", "api_rest"],
              field_of_study: "computer_science",
              posted_date: "2025-03-20"
            },
            {
              id: "sgbs_juriste",
              title: "Juriste d'Entreprise",
              company_name: "Société Générale de Banques au Sénégal",
              location: "Dakar",
              job_type: "full_time",
              salary: "1 800 000 - 2 300 000 FCFA",
              description: "La SGBS recherche un juriste d'entreprise pour gérer les aspects juridiques des opérations bancaires.",
              required_skills: ["droit_des_affaires", "droit_bancaire", "rédaction_juridique"],
              field_of_study: "law",
              posted_date: "2025-03-15"
            },
            {
              id: "cabinet_avocat",
              title: "Avocat Spécialisé en Droit des Affaires",
              company_name: "Cabinet Juridique Dakar",
              location: "Dakar",
              job_type: "full_time",
              salary: "2 000 000 - 2 800 000 FCFA",
              description: "Cabinet d'avocats de premier plan à Dakar recherche un avocat spécialisé en droit des affaires.",
              required_skills: ["droit_commercial", "droit_ohada", "contentieux"],
              field_of_study: "law",
              posted_date: "2025-03-10"
            },
            {
              id: "ong_environnement",
              title: "Juriste Environnemental",
              company_name: "ONG Environnement Sénégal",
              location: "Dakar",
              job_type: "full_time",
              salary: "1 400 000 - 1 900 000 FCFA",
              description: "ONG internationale basée à Dakar recherche un juriste spécialisé en droit de l'environnement.",
              required_skills: ["droit_environnemental", "droit_international", "plaidoyer"],
              field_of_study: "environmental_law",
              posted_date: "2025-04-01"
            },
          ]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des offres d'emploi:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Gérer l'ouverture du dialogue de candidature
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setOpenApplyDialog(true);
    // Réinitialiser les champs du formulaire
    setCvFile(null);
    setCoverLetter('');
    setExperience('');
  };
  
  // Gérer la fermeture du dialogue de candidature
  const handleCloseDialog = () => {
    setOpenApplyDialog(false);
    setCvFile(null);
  };
  
  // Gérer la sélection du CV
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setCvFile(event.target.files[0]);
    }
  };
  
  // Gérer la soumission de la candidature
  const handleSubmitApplication = async () => {
    if (!cvFile || !coverLetter) {
      setSnackbarMessage('Veuillez remplir tous les champs obligatoires');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Préparer les données de la candidature
      const applicationData = {
        jobId: selectedJob.id,
        companyName: selectedJob.company_name,
        jobTitle: selectedJob.title,
        coverLetter: coverLetter,
        experienceLevel: experience
      };
      
      // Envoyer la candidature via l'API
      await submitJobApplication(applicationData, cvFile);
      
      // Fermer le dialogue et afficher un message de confirmation
      handleCloseDialog();
      setSnackbarMessage('Votre candidature a été soumise avec succès!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Rediriger vers la page de détails de l'offre après 1 seconde
      setTimeout(() => {
        navigate(`/jobs/${selectedJob.id}`);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la soumission de la candidature:', error);
      setSnackbarMessage('Une erreur est survenue lors de la soumission de votre candidature');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Gérer la fermeture du snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  // Formater le type d'emploi
  const formatJobType = (type) => {
    const types = {
      'full_time': 'Temps plein',
      'part_time': 'Temps partiel',
      'internship': 'Stage',
      'apprenticeship': 'Alternance',
      'freelance': 'Freelance'
    };
    return types[type] || type;
  };

  // Filtrer les offres d'emploi en fonction des critères
  const filteredJobs = jobs.filter(job => {
    // Filtrer par terme de recherche
    const matchesSearchTerm = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.company_name && job.company_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (job.required_skills && job.required_skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    
    // Filtrer par domaine d'études
    const matchesField = !fieldFilter || job.field_of_study === fieldFilter;
    
    // Filtrer par localisation
    const matchesLocation = !locationFilter || job.location === locationFilter;
    
    return matchesSearchTerm && matchesField && matchesLocation;
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Offres d'emploi et stages au Sénégal
      </Typography>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Rechercher par titre, entreprise ou compétence"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="field-filter-label">Domaine</InputLabel>
              <Select
                labelId="field-filter-label"
                value={fieldFilter}
                label="Domaine"
                onChange={(e) => setFieldFilter(e.target.value)}
              >
                {studyFields.map(field => (
                  <MenuItem key={field.id} value={field.id}>{field.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel id="location-filter-label">Localisation</InputLabel>
              <Select
                labelId="location-filter-label"
                value={locationFilter}
                label="Localisation"
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                {senegalLocations.map(location => (
                  <MenuItem key={location.id} value={location.id}>{location.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {filteredJobs.length} offres disponibles
          </Typography>
          
          <Grid container spacing={3}>
            {filteredJobs.map(job => (
              <Grid item xs={12} key={job.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {job.title}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.company_name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <WorkIcon fontSize="small" sx={{ mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatJobType(job.job_type)}
                          </Typography>
                        </Box>
                        {job.salary && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <MoneyIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {job.salary}
                            </Typography>
                          </Box>
                        )}
                        {job.field_of_study && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <SchoolIcon fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {studyFields.find(f => f.id === job.field_of_study)?.name || job.field_of_study}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      <Box>
                        <Chip 
                          label={`Publié le ${new Date(job.posted_date).toLocaleDateString('fr-SN')}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="body1" paragraph>
                      {job.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {job.required_skills && job.required_skills.map((skill, index) => (
                        <Chip key={index} label={skill.replace('_', ' ')} size="small" />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      color="primary"
                      component={Link}
                      to={`/jobs/${job.id}`}
                    >
                      Voir les détails
                    </Button>
                    <Button 
                      size="small" 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleApplyClick(job)}
                      startIcon={<UploadIcon />}
                    >
                      Postuler
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {filteredJobs.length === 0 && (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6">
                Aucune offre ne correspond à votre recherche
              </Typography>
              <Typography variant="body1">
                Essayez d'autres termes de recherche ou consultez toutes les offres disponibles.
              </Typography>
            </Paper>
          )}
        </>
      )}
      
      {/* Dialogue de candidature */}
      <Dialog open={openApplyDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Postuler à l'offre : {selectedJob?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Pour postuler à cette offre chez {selectedJob?.company_name}, veuillez téléverser votre CV et remplir les informations ci-dessous.
          </DialogContentText>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3, p: 2, border: '1px dashed grey', borderRadius: 1, textAlign: 'center' }}>
                <input
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  id="cv-file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="cv-file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<UploadIcon />}
                    sx={{ mb: 1 }}
                    fullWidth
                  >
                    Téléverser votre CV
                  </Button>
                </label>
                <Typography variant="body2" color="text.secondary">
                  {cvFile ? `Fichier sélectionné : ${cvFile.name}` : "Formats acceptés : PDF, DOC, DOCX"}
                </Typography>
              </Box>
              
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="experience-label">Niveau d'expérience</InputLabel>
                <Select
                  labelId="experience-label"
                  value={experience}
                  label="Niveau d'expérience"
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <MenuItem value="">Sélectionnez votre niveau d'expérience</MenuItem>
                  <MenuItem value="0-1">Débutant (0-1 an)</MenuItem>
                  <MenuItem value="1-3">Junior (1-3 ans)</MenuItem>
                  <MenuItem value="3-5">Intermédiaire (3-5 ans)</MenuItem>
                  <MenuItem value="5-10">Senior (5-10 ans)</MenuItem>
                  <MenuItem value="10+">Expert (10+ ans)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Lettre de motivation"
                multiline
                rows={10}
                fullWidth
                variant="outlined"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Expliquez pourquoi vous êtes intéressé(e) par ce poste et ce que vous pouvez apporter..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Annuler</Button>
          <Button 
            onClick={handleSubmitApplication} 
            variant="contained" 
            color="primary"
            disabled={submitting || !cvFile || !coverLetter}
          >
            {submitting ? 'Envoi en cours...' : 'Soumettre ma candidature'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar pour les notifications */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Jobs;
