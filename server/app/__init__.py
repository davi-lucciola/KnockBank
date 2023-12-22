from .controllers import conta_bp
from .config import Config
from .database import init_db
from apiflask import APIFlask


def create_app() -> APIFlask:
    api = APIFlask(__name__, title=Config.API_TITLE)
    api.json.sort_keys = False
    api.config.from_object(Config)

    @api.get('/info')
    def info():
        return {
            'title': Config.API_TITLE,
            'description': Config.DESCRIPTION
        }
    
    # Routers
    api.register_blueprint(conta_bp)

    with api.app_context():
        init_db(api)

    return api