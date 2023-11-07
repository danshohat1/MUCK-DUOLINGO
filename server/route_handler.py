from database import Datbase
from chat_handler import *
route_map = {}
OK  = "200 OK"
UNAUTHORIZED = "401 Unauthorized"
class Route_handler:
    @staticmethod
    def route(path):
        def _route(f):
            route_map[path] = f
            return

        return _route

    @staticmethod
    @route("/signup_post")
    def login_post(*args):
        update_users = Datbase()

        check = any(args[0] == username[0] for username in update_users.get_all_usernames())

        if check:
            return "user already exists", OK

        update_users.create_user(args[0], args[1])
        update_users.close()
        return "user created", OK

    @staticmethod
    @route("/update_user_put")
    def update_user_put(*args):
        update_users = Datbase()
        update_users.update_user(args[0], args[1], args[2])
        update_users.close()
        print(args)
        print("here")
        return "user updated successfully", OK

    @staticmethod
    @route("/password_get")
    def password_get(*args):
        password_db = Datbase()
        password = password_db.get_password_by_username(args[0])
        password_db.close()

        return password, OK

    @staticmethod
    @route("/update_user_delete")
    def update_user_delete(*args):
        update_users = Datbase()
        update_users.delete_user_by_username(args[0])
        update_users.close()

        return "user deleted successfully",OK

    @staticmethod
    @route("/login_post")
    def login_post(*args):
        database = Datbase()

        check = any(args[0] == username[0] for username in database.get_all_usernames())

        if not check:
            return f"username '{args[0]}' is not recognized in the system.", OK

        if args[1] == database.get_password_by_username(args[0])[0]:
            return "logged in successfully",OK

        return "your password is invalid. please try again.", OK

    @staticmethod
    @route(f"/home_screen_get")
    def home_screen_get(*args):
        # example: http://localhost:8001/home_screen?username=user 1

        database = Datbase()

        home = database.handle_home_screen(args[0])

        database.close()
        return home,OK

    @staticmethod
    @route(f"/all_stages_by_language_get")
    def all_stages_by_language_get(*args):
        # example: http://localhost:8001/all_stages_by_language?username=user 1&language_code=en
        database = Datbase()

        stages = database.get_all_stages(args[0], args[1])

        database.close()

        return stages,OK
    

    @staticmethod
    @route(f"/join_chat_get")
    def join_chat_get(*args):
        # index 0 is chat language
        c = Chat_Handler()

        if c.get_chat_server_running():
            return {"io_port": c.get_chat_server_port(), "peer_port": c.get_peerjs_port()}, OK # return the port of the chat

        c.create_chat(args[0])
        return {"io_port": c.get_chat_server_port(), "peer_port": c.get_peerjs_port()}, OK

        
        
        




