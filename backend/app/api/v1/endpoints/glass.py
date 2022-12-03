from fastapi import APIRouter, Depends

from app.core.utils.misc import to_query_parameters
from app.crud.crud_glass import glass as glasses
from app.dependencies import get_current_account, get_db
from app.schemas import glass as glass_schema


router = APIRouter(tags=["glass"])


@router.get("/", response_model=list[glass_schema.Glass], dependencies=[Depends(get_current_account)])
async def read_glasses(db=Depends(get_db), query=Depends(to_query_parameters(glass_schema.GlassBase))) -> list:
    return glasses.query(db, limit=None, **query.dict(exclude_none=True, exclude_unset=True))