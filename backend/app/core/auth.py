from fastapi.security import OAuth2PasswordBearer

from app.core.config import settings


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f'{settings.API_V1_PREFIX}/auth/login/', # TODO: Shouldn't be hardcoded
    scopes={
        'staff': 'Manage stock and create transactions',
        'treasurer': 'Staff permissions plus manage treasury, i.e. CRUD over transactions',
        'president': 'Treasurer permissions plus manage users, i.e. CRUD over users',
    },
)