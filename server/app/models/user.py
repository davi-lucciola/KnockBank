from app.models import BaseModel
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy import Column, BigInteger, String
from werkzeug.security import generate_password_hash, check_password_hash
import typing

if typing.TYPE_CHECKING:
    from models import Account


class User(BaseModel):
    __tablename__ = "users"

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    password: str = Column(String(255), nullable=False)
    token: str = Column(String(255))
    refresh_token: str = Column(String(255))

    account: Mapped["Account"] = relationship("Account", back_populates="user")

    def __init__(self, password: str) -> None:
        self.password = password

    def verify_password_hash(self, password: str) -> bool:
        return check_password_hash(self.password, password)

    def generate_password_hash(self):
        self.password = generate_password_hash(self.password)
