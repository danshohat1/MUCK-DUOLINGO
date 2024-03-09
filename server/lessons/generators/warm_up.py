from typing import List, Dict
from .questions import *
from .generator import Generator


class WarmUp(Generator):
    def __init__(self, words: List[Dict[str, str]]) -> None:
        super().__init__(words)

    def generate_question(self, word: Dict[str, str]) -> Dict[
                          str, WarmUpMultipleChoice]:
        term, definition = list(word.items())[0]
        return {term: dict(WarmUpMultipleChoice(definition, self._molds))}
