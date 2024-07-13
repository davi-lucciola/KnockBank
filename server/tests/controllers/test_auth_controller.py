from http import HTTPStatus
from flask.testing import FlaskClient
from knockbankapi.domain.dto import UserLoginDTO


# def test_login_successfully(client: FlaskClient):
#     user_payload = UserLoginDTO(cpf="58901211033", password="Test#1234")
#     response = client.post("/login", data=user_payload)

#     assert response.status_code == HTTPStatus.OK
#     assert response.json is not None
#     assert response.json.get("type") == "bearer"
#     assert response.json.get("accessToken") is not None
