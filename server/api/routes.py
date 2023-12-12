from database import *
from video_chat import *
from .enums import Statuses, HttpMethod
from .route import Route
from .lessons import *
from typing import List, Union

class Routes:


    @staticmethod
    @Route(path = "/signup", method = HttpMethod.POST)
    def signup_post(*args):
        """Handle the signup POST request to create a new user."""
        
        return Database.signup(args[0], args[1]), Statuses.OK.value

    @staticmethod
    @Route(path = "/update_user", method= HttpMethod.PUT)
    def update_user_put(*args):
        """Handle the update user PUT request to modify user information."""

        if len(args) == 3:
            Database.update_user(args[0], args[1], args[2])
        else:
            Database.update_user(args[0], args[1], True)

        return "User updated successfully", Statuses.OK.value

    @staticmethod
    @Route(path="/password", method = HttpMethod.GET)
    def password_get(*args):
        """Handle the password GET request to check user password"""
        return Database.get_password(args[0]), Statuses.OK.value
    
    @staticmethod
    @Route(path= "/update_user", method = HttpMethod.DELETE)
    def update_user_delete(*args):
        """Handle the update user DELETE request to delete a user."""
        Database.delete_user(args[0])
        return "User deleted successfully", Statuses.OK.value

    @staticmethod
    @Route(path="/login", method = HttpMethod.POST)
    def login_post(*args):
        """Handle the login POST request to authenticate a user."""
        
        return Database.login(args[0], args[1]), Statuses.OK.value
    


    @staticmethod
    @Route(path = "/home_screen", method = HttpMethod.GET)
    def home_screen_get(*args):
        """Handle the home screen GET request to retrieve user language progress."""
        return Database.home_screen_info(args[0]), Statuses.OK.value
    
    @staticmethod
    @Route(path = "all_stages_by_language", method= HttpMethod.GET)
    def all_stages_by_language_get(*args):
        """Handle the all stages by language GET request to retrieve all stages for a user in a specific language."""
        
        return Database.all_stages(args[0], args[1]), Statuses.OK.value

    @staticmethod
    @Route(path = "/join_chat", method= HttpMethod.GET)
    def join_chat_get(*args):
        """Handle the join chat GET request to create or join a chat session."""
        # Index 0 is the chat language
        c = ChatHandler()

        if c.get_chat_server_running():
            return {"io_port": c.get_chat_server_port(), "peer_port": c.get_peerjs_port()}, Statuses.OK.value  # Return the port of the chat

        # Create a new chat session
        c.create_chat(args[0])
        return {"io_port": c.get_chat_server_port(), "peer_port": c.get_peerjs_port()}, Statuses.OK.value
    
    @staticmethod
    @Route(path = "/new_words", method = HttpMethod.GET)
    def new_word(*args):
        # 0: lang , 1: level

        return Lesson(str(args[1]), args[0]).new_words, Statuses.OK.value
    

    @staticmethod
    @Route(path="/warm-up", method = HttpMethod.GET)
    def warm_up(*args):
         # 0: lang , 1: level
        return Lesson(args[1], args[0]).warm_up(), Statuses.OK.value

    @staticmethod
    @Route(path="/advanced", method = HttpMethod.GET)
    def warm_up(*args):
         # 0: lang , 1: level
        return Lesson(args[1], args[0]).advanced(), Statuses.OK.value


    @staticmethod
    @Route(path = "/add_stage", method = HttpMethod.POST)
    def add_stage(*args) -> List[Union[str,HttpMethod]]:
        # 0: username, 1: lang, 2: level, 3: points 
        Database.add_stage_data(args[0], args[1], args[2], args[3])
        return "Stage added successfully", Statuses.OK.value


