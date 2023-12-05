   
import re
from .languages import Languages
from .translator import Trans
import json 

LESSONS = json.load(open("api/lessons/lessons.json"))
class Lesson:
    def __init__(self, level:int, lang:str):
        self.level = level
        self.lang  = Languages[lang]
        self.level_data = LESSONS[str(level)]

        self.translate = Trans(self.lang.name.lower())

        self.new_words = [ self.translate(word) for word in self.level_data["newWords"]] 

        


