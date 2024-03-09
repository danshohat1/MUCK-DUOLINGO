from abc import ABC, abstractmethod
from typing import List, Dict
import random


class MultipleChoice(ABC):

    def __init__(self, answer: str, number_of_options: int,
                 words: List[Dict[str, str]]) -> None:
        self.answer = answer
        self.number_of_options = number_of_options
        self.words = words

    def generate_options(self) -> List[str]:
        translations = list(
            map(lambda word: list(word.values())[0], self.words))

        translations.remove(self.answer)

        options = random.sample(translations,
                                self.number_of_options - 1) + [self.answer]
        random.shuffle(options)
        return options

    @abstractmethod
    def __iter__(self) -> str:
        pass
