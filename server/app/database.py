from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate


db: SQLAlchemy = SQLAlchemy()
migrate = Migrate(db=db)

def init_db(app: Flask):
    db.init_app(app)
    migrate.init_app(app)