from fastapi.security import OAuth2PasswordBearer, SecurityScopes

from app.core.config import settings
from app.core.types import SecurityScopesHierarchy
from app.core.utils.misc import create_hierarchy_dict

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_PREFIX}/auth/login/",  # TODO: Shouldn't be hardcoded
    scopes={
        "staff": "Manage stock and create transactions",
        "treasurer": "Manage treasury, i.e. CRUD over transactions",
        "president": "Manage users, i.e. CRUD over users",
    },
)


scopes_hierarchy: dict[str, list[str]] = create_hierarchy_dict(SecurityScopesHierarchy)


def check_scopes(security_scopes: SecurityScopes, token_scopes: list[str]) -> bool:
    """
    Check if the token scopes are sufficient to access the endpoint.

    :param security_scopes: The security scopes
    :param token_scopes: The token scopes

    :return: Whether the token scopes are sufficient to access the endpoint
    """
    # Get the scopes required to access the endpoint
    required_scopes = security_scopes.scopes
    # Get the higher scope in `token_scopes`
    token_scope = sorted(
        token_scopes, key=lambda scope: SecurityScopesHierarchy[scope].value
    )[-1]
    # Check if the token scopes are sufficient to access the endpoint
    return all(scope in scopes_hierarchy[token_scope] for scope in required_scopes)
