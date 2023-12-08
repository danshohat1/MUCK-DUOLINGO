from .multiple_choice import MultipleChoice
from typing import List, Dict
import json


class AdvancedMultipleChoice(MultipleChoice):

    def __init__(self, sentence: str, answer: str, words: List[Dict[str, str]], number_of_options: int = 4) -> None:
        super().__init__(answer, number_of_options, words)
        self.sentence = sentence
    
    def __iter__(self) -> Dict:
        yield "sentence",  self.sentence
        yield "options", self.generate_options()
        yield "answer", self.answer

    