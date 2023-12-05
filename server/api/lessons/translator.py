from translate import Translator
from typing import Dict, Union
import re

class Trans:
    def __init__(self, dst) -> None:
        self.translator = Translator(to_lang= dst)
        self.pattern = r'\{(\w+)\}'
    
    def __call__(self, to_translate: Union[str, Dict]) -> Union[str,Dict]:
        # translate a dictionary or a string to another language
        if isinstance(to_translate, str):
            for res in re.findall(self.pattern, to_translate):
                if res == "LANG":
                    to_translate = to_translate.replace(f"{{{res}}}", self.translator.translate(self.translator.to_lang))
                to_translate =  to_translate.replace(f"{{{res}}}", self.translator.translate(res.replace("_", " ")))
            return to_translate
        elif isinstance(to_translate, dict):
            return dict([(self.__call__(key), self.__call__(val)) for key, val in to_translate.items()])
        
        raise TypeError(f"Expected type str or dict, got {type(to_translate)}")
