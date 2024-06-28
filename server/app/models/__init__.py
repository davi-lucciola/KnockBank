from app.db import db


BaseModel = db.Model


from .person import Person
from .user import User
from .account import Account, AccountType
from .transaction import Transaction, TransactionType
