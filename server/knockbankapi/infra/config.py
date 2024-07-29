import os
import tomllib
import dotenv as env


env.load_dotenv()

with open("./pyproject.toml", mode="rb") as pyproject:
    api_version = tomllib.load(pyproject)["tool"]["poetry"]["version"]


class Config:
    API_TITLE = "Knock Bank API"
    API_VERSION = api_version
    DESCRIPTION = "API para gerenciar transacoes bancarias do Knock Bank"
    JSON_SORT_KEYS = False

    SECRET_KEY: str = os.getenv("TOKEN_SECRET")
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
