from ..main import Datbase
from typing import Dict

class Stages:
    # static class that handles the lessons info in the database.

    datatabase = Datbase()

    @staticmethod
    def add_stage_data(username: str, lang: str, level: int, stage_points: int) -> None: 
        if not Stages.has_stage_data(username, lang, level):
            Stages.datatabase.add_stage_data(username, lang, level, stage_points)
            return None
        print("here, updating user")
        Stages.update_stage_data(username, lang, level, stage_points)
    
    @staticmethod
    def get_stage_data(username: str, lang: str, level: int) -> Dict:
        try: 
            return Stages.datatabase.get_stage_data(username, lang, level)
        except  Exception as e:
            print(e)
            # the user didnt do that level
            return {}
    
    @staticmethod
    def update_stage_data(username: str, lang: str, level: int, stage_points: int) -> None:
        print(username,lang, level, stage_points)
        Stages.datatabase.update_stage_data(username, lang, level, stage_points)

    @staticmethod
    def has_stage_data(username: str, lang: str, level: int) -> bool:
        return Stages.datatabase.has_stage_data(username, lang, level)
    

        
    
