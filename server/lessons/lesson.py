from .languages import Languages
from .translator import Trans
import json
from .generators import *
from dataclasses import dataclass, field
from typing import Dict, List


# Load lessons data from the JSON file
LESSONS = json.load(open("lessons/lessons.json"))


@dataclass(kw_only=True, slots=True)
class Lesson:
    """
    Dataclass representing a language lesson.

    Parameters:
    - lang (str): Language of the lesson.
    - level (int): Level of the lesson.

    Attributes:
    - level_data (Dict): Data for the lesson's level.
    - translate (Trans): Translator instance for the lesson's language.
    - new_words (List[Dict[str, str]]): List of new words in the lesson.
    - __questions (List[Dict]): List of questions in the lesson.
    - warm_up (WarmUp): Warm-up generator instance.
    - advanced (Advanced): Advanced lesson generator instance.
    """

    lang: str
    level: int

    level_data: Dict = field(init=False)
    translate: Trans = field(init=False)
    new_words: List[Dict[str, str]] = field(init=False)

    __questions: List[Dict] = field(init=False)

    warm_up: WarmUp = field(init=False)
    advanced: Advanced = field(init=False)

    def __post_init__(self) -> None:
        """
        Post-initialization method to set up lesson attributes.
        """
        # Convert the language string to the corresponding Languages enum
        self.lang = Languages[self.lang]
        # Set up attributes using lesson data
        self.level_data = LESSONS[str(self.level)]
        self.translate = Trans(self.lang.name.lower())

        # Generate new words for the lesson
        self.new_words = [self.translate(word) for word in
                          self.level_data["newWords"]]
        # Generate questions for the lesson
        self.__questions = [self.translate(question) for question in
                            self.level_data["questions"]]
        # Set up warm-up and advanced lesson generators

        words = []
        for i in range(1, int(self.level) + 1):
            words += [self.translate(word)
                      for word in LESSONS[str(i)]["newWords"]]
        self.warm_up = WarmUp(self.new_words)
        self.advanced = Advanced(self.__questions, words)

