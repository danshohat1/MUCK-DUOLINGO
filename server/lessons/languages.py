from enum import Enum
import pycountry
from iso639 import languages
from typing import Union

def alpha3_to_alpha2(alpha3_code) -> Union[str, None]:
    """
    Convert ISO 639-2 alpha-3 language code to alpha-2 code.

    Parameters:
    - alpha3_code (str): ISO 639-2 alpha-3 language code.

    Returns:
    - Union[str, None]: ISO 639-1 alpha-2 language code if conversion is successful, None otherwise.
    """
    try:
        language = languages.get(part3=alpha3_code)
        if language:
            return language.part1
    except:
        return None

def inject_items(locals: locals) -> None:
    """
    Inject language items into the locals dictionary.

    Parameters:
    - locals (dict): Dictionary of local variables in the current scope.
    """
    for lang in [lang for lang in pycountry.languages]:
        res = alpha3_to_alpha2(lang.alpha_3)
        if not res:
            continue
        locals[res.upper()] = lang.name

class Languages(Enum):
    """
    Enumeration of languages with ISO 639-1 alpha-2 codes.
    """
    inject_items(locals())
