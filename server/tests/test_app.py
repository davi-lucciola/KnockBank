from apiflask import APIFlask


def test_client_app_config(app: APIFlask):
    assert app.config.get("TESTING") == True
    assert app.config.get("SQLALCHEMY_DATABASE_URI") == "sqlite:///:memory:"
