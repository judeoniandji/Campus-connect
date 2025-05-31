import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Grid, 
  Avatar,
  Button,
  TextField,
  CircularProgress,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tab,
  Tabs,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    website: '',
    education: [],
    experience: [],
    skills: []
  });

  // Simuler le chargement des données du profil
  useEffect(() => {
    setLoading(true);
    // Simuler un appel API
    setTimeout(() => {
      const mockProfile = {
        name: user?.name || 'Amadou Diallo',
        email: user?.email || 'amadou.diallo@example.com',
        phone: '+221 77 123 45 67',
        location: 'Dakar, Sénégal',
        bio: 'Étudiant passionné par le développement web et l\'intelligence artificielle. Je recherche actuellement un stage de fin d\'études dans ces domaines.',
        website: 'www.amadoudiallo.sn',
        education: [
          {
            id: 1,
            institution: 'Université Cheikh Anta Diop (UCAD)',
            degree: 'Master en Informatique',
            field: 'Intelligence Artificielle',
            startDate: '2023',
            endDate: '2025',
            description: 'Spécialisation en apprentissage automatique et traitement du langage naturel.'
          },
          {
            id: 2,
            institution: 'Université Gaston Berger (UGB)',
            degree: 'Licence en Informatique',
            field: 'Développement logiciel',
            startDate: '2020',
            endDate: '2023',
            description: 'Formation généraliste en informatique avec un accent sur le développement logiciel.'
          }
        ],
        experience: [
          {
            id: 1,
            company: 'TechCorp',
            position: 'Stagiaire développeur web',
            startDate: 'Juin 2023',
            endDate: 'Août 2023',
            description: 'Développement d\'une application web avec React et Node.js. Mise en place d\'une API RESTful et intégration avec une base de données MongoDB.'
          },
          {
            id: 2,
            company: 'DataAnalytics',
            position: 'Projet étudiant',
            startDate: 'Janvier 2023',
            endDate: 'Mai 2023',
            description: 'Projet de groupe sur l\'analyse de données massives. Utilisation de Python, Pandas et scikit-learn pour l\'analyse prédictive.'
          }
        ],
        skills: [
          { id: 1, name: 'JavaScript', level: 4 },
          { id: 2, name: 'React', level: 4 },
          { id: 3, name: 'Node.js', level: 3 },
          { id: 4, name: 'Python', level: 4 },
          { id: 5, name: 'Machine Learning', level: 3 },
          { id: 6, name: 'SQL', level: 3 },
          { id: 7, name: 'Git', level: 4 },
          { id: 8, name: 'HTML/CSS', level: 5 }
        ]
      };
      
      setProfileData(mockProfile);
      setLoading(false);
    }, 1000);
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleSaveProfile = () => {
    setLoading(true);
    // Simuler un appel API pour sauvegarder les données
    setTimeout(() => {
      setEditMode(false);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  // Rendu des étoiles pour le niveau de compétence
  const renderSkillLevel = (level) => {
    return Array(5).fill().map((_, index) => (
      <StarIcon 
        key={index} 
        fontSize="small" 
        sx={{ color: index < level ? 'gold' : 'grey.300' }} 
      />
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Profil
      </Typography>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 4 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="profile tabs" sx={{ mb: 2 }}>
              <Tab label="Résumé" icon={<PersonIcon />} />
              <Tab label="Formation" icon={<SchoolIcon />} />
              <Tab label="Expérience" icon={<WorkIcon />} />
            </Tabs>
            
            {/* Onglet Résumé */}
            {tabValue === 0 && (
              <>
                <Paper sx={{ p: 3, mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar
                        sx={{ width: 64, height: 64, mr: 2 }}
                        src="/static/images/avatar/user.jpg"
                      >
                        {profileData.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h5">{profileData.name}</Typography>
                        <Typography variant="body1" color="text.secondary">
                          {profileData.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Button
                      variant={editMode ? "contained" : "outlined"}
                      color={editMode ? "success" : "primary"}
                      startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                      onClick={editMode ? handleSaveProfile : handleEditToggle}
                    >
                      {editMode ? "Enregistrer" : "Modifier"}
                    </Button>
                  </Box>
                  
                  {editMode && (
                    <Alert severity="info" sx={{ mb: 3 }}>
                      Vous êtes en mode édition. Modifiez vos informations puis cliquez sur "Enregistrer" pour sauvegarder vos changements.
                    </Alert>
                  )}
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Paper sx={{ p: 3, mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}
                          src="/static/images/avatar/user.jpg"
                        >
                          {profileData.name.charAt(0)}
                        </Avatar>
                        
                        <Typography variant="h5" gutterBottom>
                          {profileData.name}
                        </Typography>
                        
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          Étudiant en informatique
                        </Typography>
                        
                        <Divider sx={{ width: '100%', my: 2 }} />
                        
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Compétences
                          </Typography>
                          
                          {profileData.skills.slice(0, 5).map((skill) => (
                            <Box key={skill.id} sx={{ mb: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">{skill.name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {skill.level}/5
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex' }}>
                                {renderSkillLevel(skill.level)}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Paper>
                      
                      {!editMode && (
                        <Paper sx={{ p: 3 }}>
                          <Typography variant="subtitle1" gutterBottom>
                            Contact
                          </Typography>
                          
                          <List dense>
                            <ListItem>
                              <ListItemIcon>
                                <EmailIcon />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Email" 
                                secondary={profileData.email} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <PhoneIcon />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Téléphone" 
                                secondary={profileData.phone || "Non renseigné"} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <LocationIcon />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Localisation" 
                                secondary={profileData.location || "Non renseignée"} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <LanguageIcon />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Site web" 
                                secondary={profileData.website || "Non renseigné"} 
                              />
                            </ListItem>
                            <ListItem>
                              <ListItemIcon>
                                <DescriptionIcon />
                              </ListItemIcon>
                              <ListItemText 
                                primary="Bio" 
                                secondary={profileData.bio || "Non renseignée"} 
                              />
                            </ListItem>
                          </List>
                        </Paper>
                      )}
                    </Grid>
                    
                    <Grid item xs={12} md={8}>
                      {editMode ? (
                        <Paper sx={{ p: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Informations personnelles
                          </Typography>
                          
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Nom complet"
                                name="name"
                                value={profileData.name}
                                onChange={handleInputChange}
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={profileData.email}
                                onChange={handleInputChange}
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Téléphone"
                                name="phone"
                                value={profileData.phone}
                                onChange={handleInputChange}
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Localisation"
                                name="location"
                                value={profileData.location}
                                onChange={handleInputChange}
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Site web"
                                name="website"
                                value={profileData.website}
                                onChange={handleInputChange}
                                margin="normal"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Bio"
                                name="bio"
                                value={profileData.bio}
                                onChange={handleInputChange}
                                margin="normal"
                                multiline
                                rows={4}
                              />
                            </Grid>
                          </Grid>
                        </Paper>
                      ) : (
                        <>
                          <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                              À propos
                            </Typography>
                            <Typography variant="body1">
                              {profileData.bio}
                            </Typography>
                          </Paper>
                          
                          <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                              Expérience
                            </Typography>
                            
                            {profileData.experience.map((exp) => (
                              <Box key={exp.id} sx={{ mb: 2 }}>
                                <Typography variant="subtitle1">
                                  {exp.position}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {exp.company} | {exp.startDate} - {exp.endDate}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  {exp.description}
                                </Typography>
                                {exp.id !== profileData.experience.length && (
                                  <Divider sx={{ my: 2 }} />
                                )}
                              </Box>
                            ))}
                          </Paper>
                          
                          <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                              Formation
                            </Typography>
                            
                            {profileData.education.map((edu) => (
                              <Box key={edu.id} sx={{ mb: 2 }}>
                                <Typography variant="subtitle1">
                                  {edu.degree}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {edu.institution} | {edu.startDate} - {edu.endDate}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  {edu.description}
                                </Typography>
                                {edu.id !== profileData.education.length && (
                                  <Divider sx={{ my: 2 }} />
                                )}
                              </Box>
                            ))}
                          </Paper>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              </>
            )}
            
            {/* Onglet Formation */}
            {tabValue === 1 && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Formation
                  </Typography>
                  {editMode && (
                    <Button variant="outlined" size="small">
                      Ajouter une formation
                    </Button>
                  )}
                </Box>
                
                {profileData.education.map(edu => (
                  <Card key={edu.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6">
                            {edu.degree}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary">
                            {edu.institution}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {edu.field} | {edu.startDate} - {edu.endDate}
                          </Typography>
                          <Typography variant="body2">
                            {edu.description}
                          </Typography>
                        </Box>
                        {editMode && (
                          <Button size="small" startIcon={<EditIcon />}>
                            Modifier
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            )}
            
            {/* Onglet Expérience */}
            {tabValue === 2 && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Expérience professionnelle
                  </Typography>
                  {editMode && (
                    <Button variant="outlined" size="small">
                      Ajouter une expérience
                    </Button>
                  )}
                </Box>
                
                {profileData.experience.map(exp => (
                  <Card key={exp.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                          <Typography variant="h6">
                            {exp.position}
                          </Typography>
                          <Typography variant="subtitle1" color="text.secondary">
                            {exp.company}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {exp.startDate} - {exp.endDate}
                          </Typography>
                          <Typography variant="body2">
                            {exp.description}
                          </Typography>
                        </Box>
                        {editMode && (
                          <Button size="small" startIcon={<EditIcon />}>
                            Modifier
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default Profile;
