from string import ascii_lowercase, ascii_uppercase, digits, punctuation
from app.models import BaseModel
from sqlalchemy.orm import Mapped, relationship
from sqlalchemy import Column, BigInteger, String
from werkzeug.security import generate_password_hash, check_password_hash
import typing

if typing.TYPE_CHECKING:
    from models import Conta

class User(BaseModel):
    __tablename__ = 'user'

    id: int = Column(BigInteger, primary_key=True, autoincrement=True)
    senha: str = Column(String(255), nullable=False)
    token: str = Column(String(255))
    refresh_token: str = Column(String(255))
    
    conta: Mapped['Conta'] = relationship('Conta', back_populates='user')
    
    def __init__(self, senha: str) -> None:
        self.senha = senha

    def verificar_hash_senha(self, senha: str) -> bool:
        return check_password_hash(self.senha, senha)
    
    def gerar_hash_senha(self):
        self.senha = generate_password_hash(self.senha)

    @staticmethod
    def validar_senha(senha: str) -> None:
        if len(senha) < 8:
            raise ValueError('A senha deve conter no minimo 8 digitos.')

        have_lower = have_upper = have_digits = have_special = False
        for char in senha:
            if char in ascii_lowercase: 
                have_lower = True
            
            if char in ascii_uppercase: 
                have_upper = True
            
            if char in digits: 
                have_digits = True
            
            if char in punctuation: 
                have_special = True

            if have_upper and have_digits and have_lower and have_special:
                break

        else:
            if have_lower is False:
                raise ValueError('A senha deve conter letras minúsculas.')

            if have_upper is False:
                raise ValueError('A senha deve conter letras maiúsculas.')

            if have_digits is False:
                raise ValueError('A senha deve conter numeros.')
            
            if have_special is False:
                raise ValueError('A senha deve conter carácteres especiais.')

