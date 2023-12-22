from app.database import db


BaseModel = db.Model


from .pessoa import Pessoa
from .conta import Conta, TipoConta
