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
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  Work as WorkIcon,
  Business as BusinessIcon,
  Description as DescriptionIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getUserApplications, deleteApplication } from '../api/applications';

/**
 * Page des candidatures de l'utilisateur
 * Affiche toutes les candidatures soumises par l'utilisateur
 */
const MyApplications = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Charger les candidatures de l'utilisateur
  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await getUserApplications();
        setApplications(response.applications || []);
      } catch (error) {
        console.error('Erreur lors du chargement des candidatures:', error);
        setError('Impossible de charger vos candidatures. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Gérer l'ouverture du dialogue de suppression
  const handleOpenDeleteDialog = (application) => {
    setSelectedApplication(application);
    setOpenDeleteDialog(true);
  };

  // Gérer la fermeture du dialogue de suppression
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Gérer la suppression d'une candidature
  const handleDeleteApplication = async () => {
    if (!selectedApplication) return;
    
    try {
      await deleteApplication(selectedApplication.id);
      
      // Mettre à jour la liste des candidatures
      setApplications(applications.filter(app => app.id !== selectedApplication.id));
      
      // Afficher un message de succès
      setSnackbarMessage('Candidature supprimée avec succès');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Erreur lors de la suppression de la candidature:', error);
      setSnackbarMessage('Erreur lors de la suppression de la candidature');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      handleCloseDeleteDialog();
    }
  };

  // Gérer la fermeture du snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Formater le statut de la candidature
  const formatStatus = (status) => {
    const statusMap = {
      'pending': { label: 'En attente', color: 'warning' },
      'reviewed': { label: 'Examinée', color: 'info' },
      'accepted': { label: 'Acceptée', color: 'success' },
      'rejected': { label: 'Refusée', color: 'error' }
    };
    
    return statusMap[status] || { label: status, color: 'default' };
  };

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-SN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mes candidatures
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Suivez l'état de vos candidatures aux offres d'emploi
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : applications.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            Vous n'avez pas encore soumis de candidature
          </Typography>
          <Typography variant="body1" paragraph>
            Consultez les offres d'emploi disponibles et postulez pour voir vos candidatures ici.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            component={Link} 
            to="/jobs"
            startIcon={<WorkIcon />}
          >
            Voir les offres d'emploi
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Poste</TableCell>
                <TableCell>Entreprise</TableCell>
                <TableCell>Date de candidature</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((application) => {
                const status = formatStatus(application.status);
                
                return (
                  <TableRow key={application.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body1">
                          {application.job_title}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {application.company_name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {formatDate(application.created_at)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={status.label} 
                        color={status.color} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          size="small" 
                          startIcon={<VisibilityIcon />}
                          component={Link}
                          to={`/jobs/${application.job_id}`}
                        >
                          Voir l'offre
                        </Button>
                        <Button 
                          size="small" 
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleOpenDeleteDialog(application)}
                        >
                          Supprimer
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirmer la suppression</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Êtes-vous sûr de vouloir supprimer votre candidature pour le poste "{selectedApplication?.job_title}" chez {selectedApplication?.company_name} ?
            Cette action est irréversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Annuler</Button>
          <Button onClick={handleDeleteApplication} color="error" autoFocus>
            Supprimer
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

export default MyApplications;
