from enum import Enum, auto
import pycountry
from iso639 import languages

from iso639 import languages

def alpha3_to_alpha2(alpha3_code):
    try:
        language = languages.get(part3=alpha3_code)
        if language:
            return language.part1
    except:
        return None


def inject_items(locals : locals):
    for lang in [lang for lang in pycountry.languages]:
        res = alpha3_to_alpha2(lang.alpha_3)
        if not res:
            continue
        locals[res.upper()] = lang.name

class Languages(Enum):

    inject_items(locals())
