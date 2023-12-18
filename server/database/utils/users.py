from ..main import Database  # Assuming there's a typo in 'Datbase' and should be 'Database'
import hashlib
import re
from typing import Union, Dict

class Users:

    # Instantiate the Database class
    database = Database()

    @staticmethod
    def check_username_exists(username: str) -> bool:
        """
        Check if a username exists in the system.

        Parameters:
        - username (str): The username to check.

        Returns:
        - bool: True if the username exists, False otherwise.
        """
        return any(username == _username[0] for _username in Users.database.get_all_usernames())

    @staticmethod
    def check_password(username: str, password: str) -> bool:
        """
        Check if a given password matches the stored password for a username.

        Parameters:
        - username (str): The username.
        - password (str): The password to check.

        Returns:
        - bool: True if the password is correct, False otherwise.
        """
        stored_password = Users.database.get_password_by_username(username)[0]
        return hashlib.sha256(password.encode("UTF-8")).hexdigest() == stored_password

    @staticmethod
    def get_password(username: str) -> str:
        """
        Get the hashed password for a given username.

        Parameters:
        - username (str): The username.

        Returns:
        - str: The hashed password.
        """
        return Users.database.get_password_by_username(username)[0]

    @staticmethod
    def login(username: str, password: str) -> str:
        """
        Authenticate a user login.

        Parameters:
        - username (str): The username.
        - password (str): The password.

        Returns:
        - str: Success or failure message.
        """
        if not Users.check_username_exists(username):
            return f"Username '{username}' is not recognized in the system."
        
        return "Logged in successfully" if Users.check_password(username, password) else "Your password is invalid. Please try again."

    @staticmethod
    def signup(username: str, password: str) -> str:
        """
        Create a new user in the system.

        Parameters:
        - username (str): The new username.
        - password (str): The password for the new user.

        Returns:
        - str: Success or failure message.
        """
        if Users.check_username_exists(username):
            return "User already exists" 
        
        Users.database.create_user(username, hashlib.sha256(password.encode("UTF-8")).hexdigest())

        return "User created successfully"
    
    @staticmethod
    def home_screen_info(username: str) -> Dict:
        """
        Retrieve home screen information for a user.

        Parameters:
        - username (str): The username.

        Returns:
        - Dict: Home screen information.
        """
        return Users.database.handle_home_screen(username)
    
    @staticmethod
    def all_stages(username: str, lang: str) -> Dict:
        """
        Retrieve all stages for a user in a specific language.

        Parameters:
        - username (str): The username.
        - lang (str): The language.

        Returns:
        - Dict: Information about all stages.
        """
        return Users.database.get_all_stages(username, lang)
    
    @staticmethod
    def delete_user(username: str) -> None:
        """
        Delete a user from the system.

        Parameters:
        - username (str): The username to be deleted.
        """
        Users.database.delete_user_by_username(username)
    
    @staticmethod
    def update_user(old_username: str, new_username: str, new_password: Union[str, bool]) -> None:
        """
        Update user information.

        Parameters:
        - old_username (str): The current username.
        - new_username (str): The new username.
        - new_password (Union[str, bool]): The new password or a flag indicating to keep the existing password.
        """
        # Helper function to check if a password is in SHA-256 format
        is_sha256 = lambda password: bool(re.compile(r'^[a-fA-F0-9]{64}$').match(password))
        
        # If no new password is provided or the provided password is not in SHA-256 format,
        # use the existing password hash for the user.
        if isinstance(new_password, bool):
            new_password = Users.get_password(old_username)
        elif not is_sha256(new_password):
            new_password = hashlib.sha256(new_password.encode("UTF-8")).hexdigest()

        # Update user information in the database
        Users.database.update_user(old_username, new_username, new_password)
