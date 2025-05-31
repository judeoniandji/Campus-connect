from flask import Blueprint, jsonify
from datetime import datetime

health_bp = Blueprint('health', __name__)

@health_bp.route('/health')
def health_check():
    """Endpoint de vérification de santé pour confirmer que l'API est opérationnelle"""
    return jsonify({
        'status': 'ok',
        'timestamp': datetime.now().isoformat(),
        'service': 'CampusConnect API',
        'version': '1.0'
    })
