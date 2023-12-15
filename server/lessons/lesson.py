
from .languages import Languages
from .translator import Trans
import json 
from .generators import *
from dataclasses import dataclass, field
from typing import Dict, List


LESSONS = json.load(open("lessons/lessons.json"))


@dataclass( kw_only= True, slots= True)
class Lesson:
    lang : str
    level : int

    level_data : Dict = field(init = False)
    translate : Trans = field(init = False)
    new_words: List[Dict[str,str]] = field(init = False)

    __questions : List[Dict] = field(init = False)

    warm_up : WarmUp = field(init = False)
    advanced : Advanced = field(init = False)

    def __post_init__(self) -> None:
        self.lang = Languages[self.lang]

        self.level_data = LESSONS[str(self.level)]
        self.translate  = Trans(self.lang.name.lower())

        # generate the new words of the lesson
        self.new_words = [ self.translate(word) for word in self.level_data["newWords"]] 
        # generate the questions
        self.__questions = [ self.translate(question) for question in self.level_data["questions"]]

        # porvide the warm up and the lesson itself (advanced).
        self.warm_up = WarmUp(self.new_words)
        self.advanced = Advanced(self.__questions, self.new_words)






        


