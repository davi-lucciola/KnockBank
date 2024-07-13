import tomllib
from apiflask import APIFlask
from flask_cors import CORS
from .infra.config import Config
from .infra.db import init_db
from .app.controllers import account_bp, auth_bp, transaction_bp


def create_app() -> APIFlask:
    # Flask APP
    app = APIFlask(__name__, title=Config.API_TITLE)

    # Config
    CORS(app, origins=["*"])
    app.json.sort_keys = False
    app.url_map.strict_slashes = False
    app.config.from_object(Config)

    # Info
    @app.get("/info")
    def info():
        with open("./pyproject.toml", mode="rb") as pyproject:
            version = tomllib.load(pyproject)["tool"]["poetry"]["version"]
            return {
                "title": Config.API_TITLE,
                "description": Config.DESCRIPTION,
                "version": version,
            }

    # Routers
    app.register_blueprint(auth_bp)
    app.register_blueprint(account_bp)
    app.register_blueprint(transaction_bp)

    # Initialization
    with app.app_context():
        init_db(app)

    return app
