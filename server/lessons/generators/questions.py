from enum import Enum
from typing import NewType
from ..utils.multiple_choice import *
from ..utils.fill_in import *
from ..utils.fill_sentence import *


class Questions(Enum):
    WARMUP = WarmUpMultipleChoice
    MULTIPLECHOICE = AdvancedMultipleChoice
    FILLIN = FillInQuestion
    FILLSENTENCE = FillSentenceQuestion


Question = NewType('Question', Questions)
