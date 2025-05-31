"""
Script d'initialisation pour télécharger les ressources NLTK nécessaires
Ce script est exécuté lors du déploiement sur Render
"""

import nltk
import os
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def download_nltk_resources():
    """Télécharge les ressources NLTK nécessaires pour l'application"""
    resources = [
        'punkt',           # Tokenizer
        'stopwords',       # Mots vides pour plusieurs langues
        'wordnet',         # Base de données lexicale
        'omw-1.4'          # Open Multilingual WordNet
    ]
    
    # Définir le répertoire de données NLTK (utiliser un répertoire accessible en écriture)
    nltk_data_dir = os.environ.get('NLTK_DATA', os.path.join(os.getcwd(), 'nltk_data'))
    os.environ['NLTK_DATA'] = nltk_data_dir
    
    # Créer le répertoire s'il n'existe pas
    if not os.path.exists(nltk_data_dir):
        os.makedirs(nltk_data_dir)
        logger.info(f"Répertoire NLTK_DATA créé: {nltk_data_dir}")
    
    # Télécharger les ressources
    for resource in resources:
        try:
            logger.info(f"Téléchargement de la ressource NLTK: {resource}")
            nltk.download(resource, download_dir=nltk_data_dir, quiet=False)
            logger.info(f"Ressource {resource} téléchargée avec succès")
        except Exception as e:
            logger.error(f"Erreur lors du téléchargement de {resource}: {e}")

if __name__ == "__main__":
    logger.info("Démarrage du téléchargement des ressources NLTK...")
    download_nltk_resources()
    logger.info("Téléchargement des ressources NLTK terminé")
