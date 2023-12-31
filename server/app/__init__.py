from .controllers import conta_bp, auth_bp
from .config import Config
from .database import init_db
from flask_cors import CORS
from apiflask import APIFlask


def create_app() -> APIFlask:
    app = APIFlask(__name__, title=Config.API_TITLE)
    
    # Config
    CORS(app, origins=['*'])
    app.json.sort_keys = False
    app.url_map.strict_slashes = False
    app.config.from_object(Config)
    
    # Info
    # Routers
    @app.get('/info')
    def info():
        return {
            'title': Config.API_TITLE,
            'description': Config.DESCRIPTION
        }
    
    app.register_blueprint(conta_bp)
    app.register_blueprint(auth_bp)

    # Initialization
    with app.app_context():
        init_db(app)

    return app
