from typing import Dict, List
import random 

class FillSentenceQuestion:
    # translate a sentence with blocks (just like Duolingo)

    def __init__(self, sentence: str, answer: str, words : List[Dict[str,str]], number_of_options = 8):

        self.words = words
        self.sentence = sentence
        self.number_of_options = number_of_options
        self.answer = answer

    def get_block(self, term: str) -> Dict[str,str]:

        return list(filter(lambda word: list(word.keys())[0] == term, self.words))[0]
    
    
    def generate_blocks(self) -> List[Dict[str,str]]:
        answer_words = self.answer.split()
        print("muck1")
        answer_words = list(map(lambda term: self.get_block(term.replace("_", " ")), answer_words))
        print("muck2")
        print(answer_words)
        if len(answer_words) > self.number_of_options:
            raise Exception

        wrong_words = [word for i, word  in enumerate(self.words) if word not in answer_words and i < self.number_of_options]
        random.shuffle(wrong_words)
        answer_words = answer_words + wrong_words
        random.shuffle(answer_words)

        print(answer_words)
        return answer_words
    
    
    def __iter__(self):
        yield "sentence", self.sentence
        yield "blocks", self.generate_blocks()
        yield "answer", self.answer.replace("_", " ")

