import typing
from sqlalchemy.orm import Mapped, relationship, mapped_column
from sqlalchemy import String
from werkzeug.security import generate_password_hash, check_password_hash
from knockbankapi.domain.models import BaseModel, BigIntegerPK

if typing.TYPE_CHECKING:
    from knockbankapi.domain.models import Account


class User(BaseModel):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(BigIntegerPK, primary_key=True, autoincrement=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)
    token: Mapped[str] = mapped_column(String(255), nullable=True)
    refresh_token: Mapped[str] = mapped_column(String(255), nullable=True)

    account: Mapped["Account"] = relationship("Account", back_populates="user")

    def __init__(self, password: str) -> None:
        self.password = password

    def verify_password_hash(self, password: str) -> bool:
        return check_password_hash(self.password, password)

    def generate_password_hash(self):
        self.password = generate_password_hash(self.password)
