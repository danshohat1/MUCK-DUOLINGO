from database import *
from video_chat import *
from .enums import Statuses
route_map = {}

class RouteHandler:

    def route(path):
        """Decorator to register a function as a route handler for a specific path."""
        def _route(f):
            route_map[path] = f
            return

        return _route

    @staticmethod
    @route("/signup_post")
    def signup_post(*args):
        """Handle the signup POST request to create a new user."""
        
        return Api.signup(args[0], args[1]), Statuses.OK.value

    @staticmethod
    @route("/update_user_put")
    def update_user_put(*args):
        """Handle the update user PUT request to modify user information."""
        if len(args) == 3:
            Api.update_user(args[0], args[1], args[2])
        else:
            Api.update_user(args[0], args[1], True)

        return "User updated successfully", Statuses.OK.value

    @staticmethod
    @route("/password_get")
    def password_get(*args):
        """Handle the password GET request to check user password"""
        return Api.get_password(args[0]), Statuses.OK.value
    
    @staticmethod
    @route("/update_user_delete")
    def update_user_delete(*args):
        """Handle the update user DELETE request to delete a user."""
        Api.delete_user(args[0])
        return "User deleted successfully", Statuses.OK.value

    @staticmethod
    @route("/login_post")
    def login_post(*args):
        """Handle the login POST request to authenticate a user."""
        
        return Api.login(args[0], args[1]), Statuses.OK.value
    


    @staticmethod
    @route(f"/home_screen_get")
    def home_screen_get(*args):
        """Handle the home screen GET request to retrieve user language progress."""
        return Api.home_screen_info(args[0]), Statuses.OK.value
    
    @staticmethod
    @route(f"/all_stages_by_language_get")
    def all_stages_by_language_get(*args):
        """Handle the all stages by language GET request to retrieve all stages for a user in a specific language."""
        
        return Api.all_stages(args[0], args[1]), Statuses.OK.value

    @staticmethod
    @route(f"/join_chat_get")
    def join_chat_get(*args):
        """Handle the join chat GET request to create or join a chat session."""
        # Index 0 is the chat language
        c = Chat_Handler()

        if c.get_chat_server_running():
            return {"io_port": c.get_chat_server_port(), "peer_port": c.get_peerjs_port()}, Statuses.OK.value  # Return the port of the chat

        # Create a new chat session
        c.create_chat(args[0])
        return {"io_port": c.get_chat_server_port(), "peer_port": c.get_peerjs_port()}, Statuses.OK.value
