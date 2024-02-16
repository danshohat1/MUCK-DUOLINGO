from typing import List, Dict, Any
from ..utils.multiple_choice import *
from .questions import *
from .generator import Generator

class Advanced(Generator):
    def __init__(self, questions: List[Dict[Any, Any]], words: List[Dict[str ,str]]) -> None:
        super().__init__(questions)
        print("here-1")
        self._words = words

            
    def generate_question(self, mold: Dict[str, Any]) -> Question:
        print(mold)
        question = getattr(Questions, mold["type"].upper()).value
        question_type = {"type": mold["type"]}
        if question is AdvancedMultipleChoice or question is FillSentenceQuestion:
            # return the multiple choice obj
            return {**question_type, **dict(question(**dict([(key, val) for key, val in mold.items() if key!= "type"]), words=self._words))}
        return {**question_type, **dict(question(**dict([(key, val) for key, val in mold.items() if key!= "type"])))}


    