import uuid
import os
import shutil
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict
from sqlalchemy import create_engine, Column, String, Boolean, DateTime, ForeignKey, Text, Integer, desc
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# --- CONFIGURATION ---
DATABASE_URL = "sqlite:///./forum.db"
UPLOAD_DIR = "uploads"

# --- DATABASE SETUP ---
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Message(Base):
    __tablename__ = "wiki_cusat_messages"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex)
    created_at = Column(DateTime, default=datetime.utcnow)
    room_id = Column(String, index=True)
    parent_id = Column(String, ForeignKey("wiki_cusat_messages.id"), nullable=True)
    sender_name = Column(String)
    sender_id = Column(String, nullable=True)
    content = Column(Text)
    media_url = Column(String, nullable=True)
    media_type = Column(String, nullable=True)
    is_anonymous = Column(Boolean, default=False)
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)

class Vote(Base):
    __tablename__ = "wiki_cusat_votes"
    id = Column(String, primary_key=True, default=lambda: uuid.uuid4().hex)
    message_id = Column(String, ForeignKey("wiki_cusat_messages.id"))
    user_name = Column(String)
    vote_type = Column(String) # 'like' or 'dislike'

Base.metadata.create_all(bind=engine)

# --- SCHEMAS ---
class MessageBase(BaseModel):
    room_id: str
    content: str
    sender_name: str
    sender_id: Optional[str] = None
    is_anonymous: bool = False
    parent_id: Optional[str] = None
    media_url: Optional[str] = None
    media_type: Optional[str] = None

class MessageDisplay(MessageBase):
    id: str
    created_at: datetime
    likes: int
    dislikes: int
    model_config = ConfigDict(from_attributes=True)

class VoteRequest(BaseModel):
    user_name: str
    vote_type: str # 'like', 'dislike', 'none'

# --- HELPERS ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except:
                self.disconnect(connection)

manager = ConnectionManager()

# --- APP SETUP ---
app = FastAPI(title="Wiki CUSAT Forum API")

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- ROUTES ---
@app.get("/")
def health_check():
    return {"status": "operational", "version": "2.0"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        ext = os.path.splitext(file.filename)[1]
        name = f"{uuid.uuid4()}{ext}"
        path = os.path.join(UPLOAD_DIR, name)
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return {"url": f"/uploads/{name}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/messages/{room_id}", response_model=List[MessageDisplay])
def list_messages(room_id: str, db: Session = Depends(get_db)):
    return db.query(Message).filter(Message.room_id == room_id).order_by(desc(Message.created_at)).all()

@app.post("/messages", response_model=MessageDisplay)
async def post_message(data: MessageBase, db: Session = Depends(get_db)):
    msg = Message(**data.dict())
    db.add(msg)
    db.commit()
    db.refresh(msg)
    await manager.broadcast(f"new:{msg.id}")
    return msg

@app.post("/messages/{mid}/vote", response_model=MessageDisplay)
async def vote_action(mid: str, vote: VoteRequest, db: Session = Depends(get_db)):
    msg = db.query(Message).filter(Message.id == mid).first()
    if not msg: raise HTTPException(status_code=404)
    
    existing = db.query(Vote).filter(Vote.message_id == mid, Vote.user_name == vote.user_name).first()
    vtype = vote.vote_type if vote.vote_type in ['like', 'dislike'] else None
    
    if existing:
        # Removal logic
        if existing.vote_type == 'like': msg.likes -= 1
        else: msg.dislikes -= 1
        
        if existing.vote_type == vtype:
            db.delete(existing)
        else:
            existing.vote_type = vtype
            if vtype == 'like': msg.likes += 1
            elif vtype == 'dislike': msg.dislikes += 1
            else: db.delete(existing)
    elif vtype:
        db.add(Vote(message_id=mid, user_name=vote.user_name, vote_type=vtype))
        if vtype == 'like': msg.likes += 1
        else: msg.dislikes += 1
            
    db.commit()
    db.refresh(msg)
    await manager.broadcast(f"update:{msg.id}")
    return msg

@app.websocket("/ws/{room_id}")
async def socket_relay(websocket: WebSocket, room_id: str):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
