from http import HTTPStatus
from apiflask import HTTPError
from dataclasses import dataclass



@dataclass
class ForbiddenError(HTTPError):
    message: str
    status_code: int =  HTTPStatus.FORBIDDEN

