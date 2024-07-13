from typing import TypedDict


class UserLoginDTO(TypedDict):
    cpf: str
    password: str
