from sqlalchemy.types import BigInteger
from sqlalchemy.dialects import sqlite
from knockbankapi.infra.db import db


BaseModel = db.Model

big_integer_type = BigInteger()
BigIntegerPK = big_integer_type.with_variant(sqlite.INTEGER(), "sqlite")


from .person import Person
from .user import User
from .account import Account, AccountType
from .transaction import Transaction, TransactionType
