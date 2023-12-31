from app.database import db


BaseModel = db.Model


from .pessoa import Pessoa
from .user import User
from .conta import Conta, TipoConta
