from pydantic import BaseModel
from typing import Optional
import datetime


class FoodDetails(BaseModel):
    namae: str
    nenrei: int
