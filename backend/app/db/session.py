from sqlalchemy.orm import sessionmaker
from backend.app.db.database import engine

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)