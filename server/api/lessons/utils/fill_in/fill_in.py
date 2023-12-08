import json
class FillInQuestion:
    def __init__(self, sentence: str, answer: str):
        self.sentence = sentence
        self.answer = answer

    
    def __iter__(self):
        yield "sentence", self.sentence
        yield "answer", self.answer