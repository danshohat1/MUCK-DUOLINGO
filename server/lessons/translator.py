from translate import Translator
from typing import Dict, Union
import re


class Trans:
    """
    Translator class for translating
    strings or dictionaries to another language.

    Parameters:
    - dst (str): Destination language code.

    Attributes:
    - translator (Translator): Translator instance.
    - pattern (str): Regular expression
    pattern for identifying placeholders in strings.
    """

    def __init__(self, dst: str) -> None:
        """
        Initialize a new Translator instance.

        Parameters:
        - dst (str): Destination language code.
        """
        self.dst = dst
        self.translator = Translator(to_lang=self.dst)
        self.pattern = r'\{(\w+)\}'

    def __call__(self, to_translate: Union[str, Dict]) -> Union[str, Dict]:
        """
        Translate a string or a dictionary to another language.

        Parameters:
        - to_translate (Union[str, Dict]): String or dictionary to translate.

        Returns:
        - Union[str, Dict]: Translated string or dictionary.
        """
        try:
            if isinstance(to_translate, str):
                print(to_translate)
                # Translate placeholders in the string
                for res in re.findall(self.pattern, to_translate):
                    if res == "LANG":
                        to_translate = to_translate.replace(f"{{{res}}}",
                                                            self.translator.
                                                            translate(
                                                                self.
                                                                translator.
                                                                to_lang))
                    to_translate = to_translate.replace(f"{{{res}}}",
                                                        self.translator.
                                                        translate(
                                                            res.replace("_",
                                                                        " ")))
                return to_translate
            elif isinstance(to_translate, dict):
                # Recursively translate each key and value in the dictionary
                return dict(
                    [(self.__call__(key), self.__call__(val)) for key, val in
                     to_translate.items()])

            raise TypeError(
                f"Expected type str or dict, got {type(to_translate)}")
        except Exception as e:
            # Handle translation errors
            # (e.g., connection issues with the translate API)
            raise Exception(
                f"Error while translating, might be a "
                f"problem with the translate API: {e}")
