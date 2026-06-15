from fastapi import APIRouter
from app.schemas.search import SearchRequest
from app.services.search_service import SearchService

router = APIRouter(
    prefix="/search",
    tags=["Search"]
)


@router.post("/")
async def search(
    request: SearchRequest
):

    return SearchService.semantic_search(
        request.query
    )