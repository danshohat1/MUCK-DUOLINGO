from .multiple_choice import MultipleChoice
import random
import json
from typing import List, Dict, Union


class WarmUpMultipleChoice(MultipleChoice):
    def __init__(self, answer: str, words: List[Dict[str,  str]],
                 number_of_options: int = 3) -> None:
        super().__init__(answer, number_of_options, words)

    def __iter__(self) -> Dict[str, Union[List[str], str]]:
        yield "options", self.generate_options()
        yield "answer", self.answer
