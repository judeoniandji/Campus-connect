from app import db
from datetime import datetime

class JobApplication(db.Model):
    __tablename__ = 'job_applications'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.String(50), nullable=False)  # ID de l'offre d'emploi (peut être externe)
    company_name = db.Column(db.String(100), nullable=False)
    job_title = db.Column(db.String(100), nullable=False)
    cv_filename = db.Column(db.String(255), nullable=True)
    cover_letter = db.Column(db.Text, nullable=True)
    experience_level = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(20), default='pending')  # pending, reviewed, accepted, rejected
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relations
    user = db.relationship('User', backref=db.backref('applications', lazy=True))

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'job_id': self.job_id,
            'company_name': self.company_name,
            'job_title': self.job_title,
            'cv_filename': self.cv_filename,
            'cover_letter': self.cover_letter,
            'experience_level': self.experience_level,
            'status': self.status,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
