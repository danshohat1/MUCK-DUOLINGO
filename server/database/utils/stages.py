from ..main import Database
from typing import Dict


class Stages:
    # Static class that handles the lessons info in the database.

    # Instantiate the Database class
    database = Database()

    @staticmethod
    def add_stage_data(username: str, lang: str, level: int,
                       stage_points: int) -> None:
        """
        Add or update stage data for a user in the database.

        Parameters:
        - username (str): The username of the user.
        - lang (str): The language associated with the stage.
        - level (int): The level of the stage.
        - stage_points (int): The points achieved in the stage.
        """
        if not Stages.has_stage_data(username, lang, level):
            Stages.database.add_stage_data(username, lang, level, stage_points)
        else:
            print("User already has stage data, updating.")
            Stages.update_stage_data(username, lang, level, stage_points)

    @staticmethod
    def get_stage_data(username: str, lang: str, level: int) -> Dict:
        """
        Retrieve stage data for a user from the database.

        Parameters:
        - username (str): The username of the user.
        - lang (str): The language associated with the stage.
        - level (int): The level of the stage.

        Returns:
        - Dict: Dictionary containing stage data.
        """
        try:
            return Stages.database.get_stage_data(username, lang, level)
        except Exception as e:
            print(f"Error retrieving stage data: {e}")
            return {}

    @staticmethod
    def update_stage_data(username: str, lang: str, level: int,
                          stage_points: int) -> None:
        """
        Update stage data for a user in the database.

        Parameters:
        - username (str): The username of the user.
        - lang (str): The language associated with the stage.
        - level (int): The level of the stage.
        - stage_points (int): The points achieved in the stage.
        """
        print(
            f"Updating stage data for user {username} in {lang} - Level " +
            f"{level}  " +
            f"with  {stage_points} points.")
        Stages.database.update_stage_data(username, lang, level, stage_points)

    @staticmethod
    def has_stage_data(username: str, lang: str, level: int) -> bool:
        """
        Check if a user has stage data in the database.

        Parameters:
        - username (str): The username of the user.
        - lang (str): The language associated with the stage.
        - level (int): The level of the stage.

        Returns:
        - bool: True if stage data exists, False otherwise.
        """
        return Stages.database.has_stage_data(username, lang, level)
