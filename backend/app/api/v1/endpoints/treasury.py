import logging

from fastapi import APIRouter, Depends, HTTPException, Security, status

from app.core.translation import Translator
from app.crud.crud_treasury import treasury as treasuries
from app.dependencies import get_current_active_account, get_db
from app.schemas import treasury as treasury_schema

router = APIRouter(tags=["treasury"], prefix="/treasury")
translator = Translator(element="treasury")

logger = logging.getLogger("app.api.v1.treasury")


@router.get(
    "/",
    response_model=list[treasury_schema.Treasury],
    dependencies=[Security(get_current_active_account, scopes=["treasurer"])],
)
async def read_treasuries(db=Depends(get_db)):
    """
    Returns a list of all treasuries.

    Requires a user with the 'treasurer' scope to be authenticated.
    """
    return await treasuries.query(db, limit=None)


@router.get(
    "/last",
    response_model=treasury_schema.Treasury,
    dependencies=[Security(get_current_active_account, scopes=["treasurer"])],
)
async def read_last_treasury(db=Depends(get_db)):
    """
    Returns the last treasury.

    Requires a user with the 'treasurer' scope to be authenticated.
    """
    return await treasuries.get_last_treasury(db)


@router.put(
    "/{treasury_id}",
    response_model=treasury_schema.Treasury,
    dependencies=[Security(get_current_active_account, scopes=["treasurer"])],
)
async def update_treasury(
    treasury_id: int, treasury: treasury_schema.TreasuryUpdate, db=Depends(get_db)
):
    """
    Updates a treasury with the given ID.

    Requires a user with the 'treasurer' scope to be authenticated.
    """
    old_treasury = await treasuries.read(db, treasury_id)
    if old_treasury is None:
        logger.debug(f"Treasury {treasury_id} not found")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=translator.ELEMENT_NOT_FOUND
        )
    return await treasuries.update(db, db_obj=old_treasury, obj_in=treasury)
