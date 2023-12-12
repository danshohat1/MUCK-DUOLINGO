from ..main import Datbase
import hashlib
import re
from typing import Union, Dict

class Users:

    database = Datbase()

    @staticmethod
    def check_username_exists(username: str) -> str:
        return any(username == _username[0] for _username in Users.database.get_all_usernames())

    @staticmethod
    def check_password(username: str, password: str) -> bool:
        return hashlib.sha256(password.encode("UTF-8")).hexdigest() == Users.database.get_password_by_username(username)[0]
    

    @staticmethod
    def get_password(username: str) -> str:
        return Users.database.get_password_by_username(username)[0]

    @staticmethod
    def login(username: str, password: str) -> str:
        if not Users.check_username_exists(username):
            return f"Username '{username}' is not recognized in the system."
        
        return "Logged in successfully" if Users.check_password(username, password) else "Your password is invalid. Please try again."

    @staticmethod
    def signup(username: str, password: str) -> str:
        if Users.check_username_exists(username):
            return "User already exists" 
        
        Users.database.create_user(username, hashlib.sha256(password.encode("UTF-8")).hexdigest())

        return "User created successfully"
    
    @staticmethod
    def home_screen_info(username:str) -> Dict:
        return Users.database.handle_home_screen(username)
    
    @staticmethod
    def all_stages(username: str, lang: str) -> Dict:
        return Users.database.get_all_stages(username, lang)
    
    @staticmethod
    def delete_user(username: str) -> None:
        Users.database.delete_user_by_username(username)
    
    @staticmethod
    def update_user(old_username: str, new_username: str, new_password: Union[str, bool]) -> None:
        is_sha256 = lambda password: bool(re.compile(r'^[a-fA-F0-9]{64}$').match(password))

        
        if isinstance(new_password, bool):
            new_password = Users.get_password(old_username)
        elif not is_sha256(new_password):
            new_password = hashlib.sha256(new_password.encode("UTF-8")).hexdigest()

    
        Users.database.update_user(old_username, new_username, new_password)





