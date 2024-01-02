   
import re
from .languages import Languages
from translate import Translator
import json 

LESSONS = json.load(open("api/lessons/lessons.json"))
print(LESSONS)
class Lesson:
    def __init__(self, level:int, lang:str):
        self.level = level
        self.lang  = Languages[lang]
        self.level_data = LESSONS[str(level)]
        print(self.level_data["newWords"])

        for i, word in enumerate(self.level_data["newWords"]):
            for key, val in word.items():
                word[key] = Lesson.check(val, self.lang)
            
            self.level_data["newWords"][i] = word
        """
                for index, question in enumerate(self.level_data["questions"]):
            self.level_data["questions"][index]['question'] = Lesson.check(question["question"], self.lang)
            self.level_data["questions"][index]['answer'] = Lesson.check(question["answer"], self.lang)
        """

        print(self.level_data["newWords"])

    @staticmethod
    def check(st: str, lang):
        translator = Translator(to_lang = lang.name.lower())
        pattern = r'\{(\w+)\}'
        words = []
        sign = 1 if lang.name.lower() not in ["ar", "he"] else -1
        for word in re.findall(pattern, st):
            if word == "LANG":
                words.append((word, lang.value))
            else:
                print(f"current word: {word}")
                words.append((word, translator.translate(word.replace("_", " "))))

        return st.format(**dict(words))
    

