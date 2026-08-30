from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database.db import Base, engine
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Session
import datetime

router = APIRouter(
    prefix="/orders",
)

class StatusUpdate(BaseModel):
    status: str


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, autoincrement=True)
    items = Column(JSONB, nullable=False)
    status = Column(String, nullable=False, default="pending")
    client = Column(JSONB, nullable=False)
    total_price = Column(Integer, nullable=False)
    payment_method = Column(String, nullable=False)
    created_at = Column(DateTime, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "items": self.items,
            "status": self.status,
            "client": self.client,
            "total_price": self.total_price,
            "payment_method": self.payment_method,
            "created_at": self.created_at.isoformat()
        }

@router.post("/")
def create_order(order_data:dict):
    with Session(engine) as session:
        order = Order(
            items=order_data["items"],
            status=order_data.get("status", "pending"),
            client=order_data["client"],
            total_price=order_data["total_price"],
            payment_method=order_data["payment_method"],
            created_at=datetime.datetime.now()
        )
        session.add(order)
        session.commit()
        return {"message": "Order created successfully", "order_id": order.id}

@router.get("/")
def get_orders():
    with Session(engine) as session:
        orders = session.query(Order).all()
        return [order.to_dict() for order in orders]

@router.patch("/{order_id}/status")
def update_order_status(order_id: int, payload: StatusUpdate):
    with Session(engine) as session:
        order = session.query(Order).filter(Order.id == order_id).first()

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        order.status = payload.status
        session.commit()
        session.refresh(order)

        return order.to_dict()
