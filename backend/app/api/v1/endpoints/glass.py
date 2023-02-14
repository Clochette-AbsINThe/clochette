from fastapi import APIRouter, Depends, Security

from app.core.utils.misc import to_query_parameters
from app.crud.crud_glass import glass as glasses
from app.dependencies import get_current_active_account, get_db
from app.schemas import glass as glass_schema


router = APIRouter(tags=["glass"])


@router.get("/", response_model=list[glass_schema.Glass], dependencies=[Security(get_current_active_account)])
async def read_glasses(db=Depends(get_db), query=Depends(to_query_parameters(glass_schema.GlassBase))) -> list:
    return await glasses.query(db, limit=None, **query.dict(exclude_none=True, exclude_unset=True))