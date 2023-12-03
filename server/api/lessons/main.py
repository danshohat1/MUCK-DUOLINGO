   
import re
from languages import Languages
from googletrans import Translator
import json 

LESSONS = json.load(open("lessons.json"))
translator = Translator()
class Lesson:
    def __init__(self, level:int, lang:str):
        self.level = level
        self.lang  = Languages[lang]
        self.level_data = LESSONS[str(level)]

        for index, question in enumerate(self.level_data["questions"]):
            self.level_data["questions"][index]['question'] = Lesson.check(question["question"], self.lang)
            self.level_data["questions"][index]['answer'] = Lesson.check(question["answer"], self.lang)

        print(self.level_data)
    @staticmethod
    def check(st: str, lang):
        pattern = r'\{(\w+)\}'
        words = []
        sign = 1 if lang.name.lower() not in ["ar", "he"] else -1
        for word in re.findall(pattern, st):
            if word == "LANG":
                words.append((word, lang.value))
            else:
                words.append((word, translator.translate(word.replace("_", " "), src = "en", dest = lang.name.lower()).text[::sign]))

        return st.format(**dict(words))
    



l = Lesson(1, "HE")
