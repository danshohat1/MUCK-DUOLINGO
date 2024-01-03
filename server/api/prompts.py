import datetime

"""
prompts to the user
"""

class PromptDate:
    def __init__(self) -> None:
        self.current_time = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def __str__(self) -> str:
        return f"[{self.current_time}]"

print(PromptDate())