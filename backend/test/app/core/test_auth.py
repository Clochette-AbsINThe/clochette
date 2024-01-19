from fastapi.security import SecurityScopes

from app.core.auth import check_scopes


def test_check_scopes():
    # Test that a token with "staff" scope can access an endpoint that requires "staff" scope
    security_scopes = SecurityScopes(scopes=["staff"])
    assert check_scopes(security_scopes, ["staff"]) is True

    # Test that a token with "staff" scope cannot access an endpoint that requires "treasurer" and "treasurer" scopes
    security_scopes = SecurityScopes(scopes=["treasurer"])
    assert check_scopes(security_scopes, ["staff"]) is False

    # Test that a token with "staff" scope cannot access an endpoint that requires "president" scope
    security_scopes = SecurityScopes(scopes=["president"])
    assert check_scopes(security_scopes, ["staff"]) is False

    # Test that a token with "treasurer" scope can access an endpoint that requires "staff" scope
    security_scopes = SecurityScopes(scopes=["staff"])
    assert check_scopes(security_scopes, ["treasurer"]) is True

    # Test that a token with "president" scope can access an endpoint that requires "treasurer" scope
    security_scopes = SecurityScopes(scopes=["treasurer"])
    assert check_scopes(security_scopes, ["president"]) is True
