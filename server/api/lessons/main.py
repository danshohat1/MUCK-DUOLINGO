   
import re
from .languages import Languages
from .translator import Trans
import json 
from .generators import *
LESSONS = json.load(open("api/lessons/lessons.json"))
class Lesson:
    def __init__(self, level:int, lang:str):
        self.level = level
        self.lang  = Languages[lang]
        self.level_data = LESSONS[str(level)]

        self.translate = Trans(self.lang.name.lower())

        self.new_words = [ self.translate(word) for word in self.level_data["newWords"]] 
        self.questions = [ self.translate(question) for question in self.level_data["questions"]]

        self.warm_up = WarmUp(self.new_words)
        self.advaned = Advanced(self.questions, self.new_words)



        


