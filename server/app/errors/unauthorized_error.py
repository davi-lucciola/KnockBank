from http import HTTPStatus
from apiflask import HTTPError
from dataclasses import dataclass



@dataclass
class UnauthorizedError(HTTPError):
    message: str
    status_code: int =  HTTPStatus.UNAUTHORIZED

