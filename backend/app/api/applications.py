import os
from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from app.api import bp
from app.models import User, JobApplication
from app import db
from datetime import datetime

# Configuration pour le téléversement de fichiers
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'uploads', 'cvs')
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# Créer le dossier d'upload s'il n'existe pas
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/applications', methods=['POST'])
@jwt_required()
def create_application():
    current_user_id = get_jwt_identity()
    user = User.query.get_or_404(current_user_id)
    
    # Vérifier si le formulaire contient un fichier
    if 'cv_file' not in request.files:
        return jsonify({'error': 'Aucun fichier CV trouvé'}), 400
    
    file = request.files['cv_file']
    
    # Si l'utilisateur n'a pas sélectionné de fichier
    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400
    
    # Vérifier si le fichier est d'un type autorisé
    if not allowed_file(file.filename):
        return jsonify({'error': 'Type de fichier non autorisé'}), 400
    
    # Sécuriser le nom du fichier et créer un nom unique
    filename = secure_filename(file.filename)
    unique_filename = f"{current_user_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{filename}"
    
    # Enregistrer le fichier
    file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
    file.save(file_path)
    
    # Récupérer les autres données du formulaire
    job_id = request.form.get('job_id')
    company_name = request.form.get('company_name')
    job_title = request.form.get('job_title')
    cover_letter = request.form.get('cover_letter')
    experience_level = request.form.get('experience_level')
    
    # Créer une nouvelle candidature
    application = JobApplication(
        user_id=current_user_id,
        job_id=job_id,
        company_name=company_name,
        job_title=job_title,
        cv_filename=unique_filename,
        cover_letter=cover_letter,
        experience_level=experience_level,
        status='pending'
    )
    
    db.session.add(application)
    db.session.commit()
    
    return jsonify({
        'message': 'Candidature soumise avec succès',
        'application': application.to_dict()
    }), 201

@bp.route('/applications', methods=['GET'])
@jwt_required()
def get_user_applications():
    current_user_id = get_jwt_identity()
    
    applications = JobApplication.query.filter_by(user_id=current_user_id).order_by(JobApplication.created_at.desc()).all()
    
    return jsonify({
        'applications': [app.to_dict() for app in applications]
    })

@bp.route('/applications/<int:application_id>', methods=['GET'])
@jwt_required()
def get_application(application_id):
    current_user_id = get_jwt_identity()
    
    application = JobApplication.query.get_or_404(application_id)
    
    # Vérifier que l'utilisateur est autorisé à voir cette candidature
    if application.user_id != current_user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    return jsonify({
        'application': application.to_dict()
    })

@bp.route('/applications/<int:application_id>', methods=['DELETE'])
@jwt_required()
def delete_application(application_id):
    current_user_id = get_jwt_identity()
    
    application = JobApplication.query.get_or_404(application_id)
    
    # Vérifier que l'utilisateur est autorisé à supprimer cette candidature
    if application.user_id != current_user_id:
        return jsonify({'error': 'Non autorisé'}), 403
    
    # Supprimer le fichier CV associé
    if application.cv_filename:
        file_path = os.path.join(UPLOAD_FOLDER, application.cv_filename)
        if os.path.exists(file_path):
            os.remove(file_path)
    
    db.session.delete(application)
    db.session.commit()
    
    return jsonify({
        'message': 'Candidature supprimée avec succès'
    })
