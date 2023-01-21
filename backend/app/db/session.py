from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


# Create an engine for the database
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    connect_args={
#        "check_same_thread": False # required for sqlite to work with threads
    }
)

# Create a session maker to create sessions to interact with the database
SessionLocal = sessionmaker(
    # Do not commit changes automatically
    autocommit=False,
    # Do not flush changes to the database automatically
    autoflush=False,
    # Bind the session maker to the engine
    bind=engine,
)
