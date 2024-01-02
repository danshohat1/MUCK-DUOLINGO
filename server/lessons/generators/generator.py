from abc import ABC, abstractmethod
from typing import List, Dict, Any
from .questions import *
import random


class Generator(ABC):
    # genrates questions

    def __init__(self, molds: List[Dict[str, Any]]) -> None:
        self._molds = molds

    @abstractmethod 
    def generate_question(self) -> Question:
        pass

    
    def __call__(self) -> List[Question]:
        random.shuffle(self._molds)
        return [self.generate_question(mold) for mold in self._molds]
