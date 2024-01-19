from lessons.languages import Languages

print(dict([(lang_obj.value.lower(), lang_code.lower()) for lang_code, lang_obj in Languages.__members__.items()]))