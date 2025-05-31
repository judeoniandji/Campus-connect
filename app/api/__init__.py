from flask import Blueprint

bp = Blueprint('api', __name__)

# Importer les routes principales et les modules
from app.api import routes, admin, discussion_groups

# Enregistrer le blueprint de santé (endpoint de health check)
from app.api.health import health_bp
bp.register_blueprint(health_bp)

# Enregistrer le blueprint d'administration
from app.api.admin import bp as admin_bp
bp.register_blueprint(admin_bp, url_prefix='/admin')

# Enregistrer le blueprint des groupes de discussion
from app.api.discussion_groups import discussion_groups as groups_bp
bp.register_blueprint(groups_bp, url_prefix='/groups')
