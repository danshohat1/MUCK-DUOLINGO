
class FillInQuestion:
    def __init__(self, sentence: str, answer: str):
        self.sentence = sentence
        self.answer = answer

    def __repr__(self) -> str:
        return f"FillInQuestion({self.sentence}, {self.answer})"
    
    def __iter__(self):
        yield "sentence", self.sentence
        yield "answer", self.answer