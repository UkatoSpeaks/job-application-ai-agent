from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

def get_engine():
    database_url = settings.DATABASE_URL
    if "postgresql" in database_url:
        try:
            # Fast check (1s timeout) to verify if Postgres is available
            engine = create_engine(database_url, connect_args={"connect_timeout": 1}, pool_pre_ping=True)
            with engine.connect() as conn:
                pass
            return engine
        except Exception as e:
            print(f"Warning: PostgreSQL connection failed ({e}). Falling back to local SQLite database.")
            sqlite_url = "sqlite:///./app.db"
            return create_engine(sqlite_url, connect_args={"check_same_thread": False})
    else:
        return create_engine(database_url, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
