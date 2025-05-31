import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Chip, 
  CircularProgress, 
  Divider, 
  Container,
  Alert,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SchoolIcon from '@mui/icons-material/School';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import UploadIcon from '@mui/icons-material/Upload';
import { STUDY_FIELDS } from '../constants/formOptions';
import { getSenegalJob } from '../api/senegal';
import { submitJobApplication } from '../api/applications';

// Style pour les puces de compétences
const SkillChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  '& .MuiChip-label': {
    fontWeight: 500,
  },
}));

// Style pour l'avatar de l'entreprise
const CompanyAvatar = styled(Avatar)(({ theme }) => ({
  width: 100,
  height: 100,
  marginBottom: theme.spacing(2),
  boxShadow: theme.shadows[2]
}));

/**
 * Page de détails d'une offre d'emploi
 */
const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [job, setJob] = useState(null);
  const [openApplyDialog, setOpenApplyDialog] = useState(false);
  const [cvFile, setCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [experience, setExperience] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Types d'emploi disponibles
  const jobTypes = {
    'full_time': 'Temps plein',
    'part_time': 'Temps partiel',
    'internship': 'Stage',
    'apprenticeship': 'Alternance',
    'freelance': 'Freelance'
  };

  // Charger les détails de l'offre d'emploi
  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);
  
  // Fonction pour récupérer les détails de l'offre d'emploi
  const fetchJobDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getSenegalJob(jobId);
      
      if (response.status === 'success') {
        setJob(response.data);
      } else {
        setError("Impossible de charger les détails de l'offre d'emploi.");
      }
    } catch (err) {
      console.error("Erreur lors du chargement des détails de l'offre:", err);
      setError("Une erreur s'est produite lors du chargement des détails de l'offre. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };
  
  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-SN', options);
  };
  
  // Formater le salaire en FCFA
  const formatSalary = (salary) => {
    if (!salary) return '';
    
    // Si le salaire est déjà au format FCFA, le retourner tel quel
    if (salary.includes('FCFA') || salary.includes('XOF')) {
      return salary;
    }
    
    // Si c'est "Selon projet", le retourner tel quel
    if (salary === "Selon projet") {
      return salary;
    }
    
    // Sinon, ajouter le format FCFA
    return `${salary} FCFA`;
  };
  
  // Obtenir le nom du domaine d'études
  const getFieldOfStudyName = (fieldId) => {
    const field = STUDY_FIELDS.find(f => f.id === fieldId);
    return field ? field.name : fieldId;
  };
  
  // Gérer l'ouverture du dialogue de candidature
  const handleApplyClick = () => {
    setOpenApplyDialog(true);
  };
  
  // Gérer la fermeture du dialogue de candidature
  const handleCloseDialog = () => {
    setOpenApplyDialog(false);
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
        jobId: job.id,
        companyName: job.company_name,
        jobTitle: job.title,
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
      
      // Rediriger vers la page des offres d'emploi après 2 secondes
      setTimeout(() => {
        navigate('/jobs');
      }, 2000);
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

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || "Offre d'emploi non trouvée."}
        </Alert>
        <Button component={Link} to="/jobs" variant="contained">
          Retour aux offres d'emploi
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Fil d'Ariane */}
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Accueil
        </Link>
        <Link to="/jobs" style={{ textDecoration: 'none', color: 'inherit' }}>
          Offres d'emploi
        </Link>
        <Typography color="text.primary">{job.title}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Détails de l'offre */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {job.title}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
              <Chip 
                icon={<WorkIcon />} 
                label={jobTypes[job.job_type] || job.job_type} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                icon={<LocationOnIcon />} 
                label={job.location} 
                variant="outlined" 
              />
              <Chip 
                icon={<CalendarTodayIcon />} 
                label={`Publié le ${formatDate(job.posted_date)}`} 
                variant="outlined" 
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              Description du poste
            </Typography>
            
            <Typography variant="body1" paragraph>
              {job.description}
            </Typography>
            
            <Typography variant="h6" gutterBottom>
              Compétences requises
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 3 }}>
              {job.required_skills.map((skill, index) => (
                <SkillChip 
                  key={index} 
                  label={skill} 
                  color="primary" 
                  variant="outlined" 
                />
              ))}
            </Box>
            
            <List>
              {job.field_of_study && (
                <ListItem>
                  <ListItemIcon>
                    <SchoolIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Domaine d'études" 
                    secondary={getFieldOfStudyName(job.field_of_study)} 
                  />
                </ListItem>
              )}
              
              {job.experience_years && (
                <ListItem>
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Expérience requise" 
                    secondary={`${job.experience_years} ans`} 
                  />
                </ListItem>
              )}
              
              {job.salary && (
                <ListItem>
                  <ListItemIcon>
                    <AttachMoneyIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Rémunération" 
                    secondary={formatSalary(job.salary)} 
                  />
                </ListItem>
              )}
              
              {job.application_deadline && (
                <ListItem>
                  <ListItemIcon>
                    <CalendarTodayIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Date limite de candidature" 
                    secondary={formatDate(job.application_deadline)} 
                  />
                </ListItem>
              )}
            </List>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                startIcon={<UploadIcon />}
                onClick={handleApplyClick}
              >
                Postuler à cette offre
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Informations sur l'entreprise */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CompanyAvatar 
                src={job.company_logo || '/static/images/company-placeholder.png'} 
                alt={job.company_name}
              >
                {!job.company_logo && job.company_name?.charAt(0)}
              </CompanyAvatar>
              
              <Typography variant="h6" gutterBottom>
                {job.company_name}
              </Typography>
              
              {job.company_industry && (
                <Chip 
                  label={job.company_industry} 
                  color="secondary" 
                  variant="outlined" 
                  sx={{ mb: 2 }} 
                />
              )}
              
              {job.company_description && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {job.company_description}
                </Typography>
              )}
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth
                component={Link}
                to={`/companies/${job.company_id}`}
                startIcon={<BusinessIcon />}
              >
                Voir le profil de l'entreprise
              </Button>
              
              {job.company_website && (
                <Button 
                  variant="text" 
                  color="primary" 
                  fullWidth
                  href={job.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: 1 }}
                >
                  Visiter le site web
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Offres similaires
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Fonctionnalité à venir prochainement...
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 4 }}>
        <Button 
          component={Link} 
          to="/jobs" 
          variant="outlined"
          startIcon={<NavigateNextIcon sx={{ transform: 'rotate(180deg)' }} />}
        >
          Retour aux offres d'emploi
        </Button>
      </Box>
      
      {/* Dialogue de candidature */}
      <Dialog open={openApplyDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Postuler à l'offre : {job?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 3 }}>
            Pour postuler à cette offre chez {job?.company_name}, veuillez téléverser votre CV et remplir les informations ci-dessous.
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

export default JobDetails;
