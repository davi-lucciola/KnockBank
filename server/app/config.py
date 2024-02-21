import os
from dotenv import load_dotenv


load_dotenv()


class Config:
    API_TITLE = "Knock Bank API"
    DESCRIPTION = "API para gerenciar transações bancárias do Knock Bank"
    JSON_SORT_KEYS = False

    DEBUG = os.getenv("DEBUG")
    SECRET_KEY: str = os.getenv("TOKEN_SECRET")
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
