import os
from dotenv import load_dotenv


load_dotenv()

class Config:
    API_TITLE = 'Knock Bank API'
    DESCRIPTION = 'API para gerenciar transações bancárias do Knock Bank'
    DEBUG = os.getenv('DEBUG')
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI')