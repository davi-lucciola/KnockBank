from typing import Type
from apiflask import APIFlask
from flask_cors import CORS
from .infra import Config, init_db
from .app import account_bp, auth_bp, transaction_bp


def create_app(config: Type[Config] = Config) -> APIFlask:
    # Flask APP
    app = APIFlask(
        __name__,
        title=Config.API_TITLE,
        version=Config.API_VERSION,
        docs_path="/api/docs",
        spec_path="/api/openapi.json",
    )

    # Config
    CORS(app, origins=["*"])
    app.json.sort_keys = False
    app.url_map.strict_slashes = False
    app.config.from_object(config)

    # Info
    @app.get(f"/api/info")
    def info():
        return {
            "title": Config.API_TITLE,
            "description": Config.DESCRIPTION,
            "version": Config.API_VERSION,
        }

    # Routers
    app.register_blueprint(auth_bp)
    app.register_blueprint(account_bp)
    app.register_blueprint(transaction_bp)

    # Initialization
    with app.app_context():
        init_db(app)

    return app
