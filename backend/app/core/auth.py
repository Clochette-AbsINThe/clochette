from fastapi.security import OAuth2PasswordBearer, SecurityScopes

from app.core.config import settings
from app.core.types import SecurityScopes as AccountSecurityScopes


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f'{settings.API_V1_PREFIX}/auth/login/', # TODO: Shouldn't be hardcoded
    scopes={
        'staff': 'Manage stock and create transactions',
        'treasurer': 'Manage treasury, i.e. CRUD over transactions',
        'president': 'Manage users, i.e. CRUD over users',
    },
)


def check_scopes(security_scopes: SecurityScopes, token_scopes: list[str]) -> bool:
    """
    Check if the token scopes are sufficient to access the endpoint.

    :param security_scopes: The security scopes
    :param token_scopes: The token scopes

    :return: Whether the token scopes are sufficient to access the endpoint
    """
    # Define the scopes hierarchy, as we consider that the president scope is the most powerful, and the staff scope the least powerful
    scopes_hierarchy = { # TODO: Shouldn't be hardcoded
        'staff': ['staff'],
        'treasurer': ['staff', 'treasurer'],
        'president': ['staff', 'treasurer', 'president'],
    }
    # Get the scopes required to access the endpoint
    required_scopes = security_scopes.scopes
    # Check if the token scopes are sufficient to access the endpoint
    return all(scope in scopes_hierarchy[token_scopes[0]] for scope in required_scopes)