from database import *
from video_chat import *
from easy_http import *
from lessons import *
from authorizations import LoginAuthorization



login_auth = Authorization(true_case = LoginAuthorization.true_case)
app = App(port=8003)

def main():
    # initiate the app.
    app.run()
    

@app.route(path = "/signup", method = HttpMethod.POST)
def signup_post(*args):
    """Handle the signup POST request to create a new user."""
    response = ResponseScheme()

    response.data  = Database.signup(args[0], args[1])

    return response

@app.route(path = "/update_user", method= HttpMethod.PUT)
def update_user_put(*args):
    """Handle the update user PUT request to modify user information."""
    response = ResponseScheme()
    if len(args) == 3:
        Database.update_user(args[0], args[1], args[2])
    else:
        Database.update_user(args[0], args[1], True)

    response.data ="User updated successfully"
    return response

@app.route(path="/password", method = HttpMethod.GET)
def password_get(*args):
    """Handle the password GET request to check user password"""
    response = ResponseScheme()
    
    response.data = Database.get_password(args[0])

    return response


@app.route(path= "/update_user", method = HttpMethod.DELETE)
def update_user_delete(*args):
    """Handle the update user DELETE request to delete a user."""
    response = ResponseScheme()

    Database.delete_user(args[0])
    response.data = "User deleted successfully"
    return response

@app.route(path="/authorized-login", method = HttpMethod.POST, authorization = login_auth)
def authorized_login(*args):
    pass

@app.route(path="/login", method = HttpMethod.POST)
def login(*args):
    response = ResponseScheme()

    result = Database.login(args[0], args[1])
    response.data = result
    response.set_cookie({"token": login_auth.token(username=args[0])})

    return response


@app.route(path = "/home_screen", method = HttpMethod.GET)
def home_screen_get(*args):
    """Handle the home screen GET request to retrieve user language progress."""

    response = ResponseScheme()

    response.data = Database.home_screen_info(args[0])
    return response


@app.route(path = "all_stages_by_language", method= HttpMethod.GET)
def all_stages_by_language_get(*args):
    """Handle the all stages by language GET request to retrieve all stages for a user in a specific language."""
    
    response = ResponseScheme()
    response.data = Database.all_stages(args[0], args[1])

    return response

@app.route(path = "/join_chat", method= HttpMethod.GET)
def join_chat_get(*args):
    """Handle the join chat GET request to create or join a chat session."""
    # Index 0 is the chat language
    response = ResponseScheme()
    c = ChatHandler()
    if c.get_chat_server_running():
        response.data =  {"io_port": c.get_chat_server_port(), "peer_port": c.get_peerjs_port()}
        return response
    # Create a new chat session
    c.create_chat(args[0])
    response.data = {"io_port": c.get_chat_server_port(), "peer_port": c.get_peerjs_port()}
    return response


@app.route(path = "/new_words", method = HttpMethod.GET)
def new_word(*args):
    # 0: lang , 1: level
    response = ResponseScheme()
    response.data =  Lesson(lang = args[0], level = args[1]).new_words

    return response


@app.route(path="/warm-up", method = HttpMethod.GET)
def warm_up(*args):
        # 0: lang , 1: level
    
    response = ResponseScheme()
    response.data =  Lesson(lang = args[0], level = args[1]).warm_up()
    return response

@app.route(path="/advanced", method = HttpMethod.GET)
def advanced(*args):
        # 0: lang , 1: level

    response = ResponseScheme()
    response.data = Lesson(lang = args[0], level = args[1]).advanced()

    return response


@app.route(path = "/add_stage", method = HttpMethod.POST)
def add_stage(*args) -> ResponseScheme:
    # 0: username, 1: lang, 2: level, 3: points 
    Database.add_stage_data(args[0], args[1], args[2], args[3])

    response = ResponseScheme()

    response.data = "Stage added successfully"

    return response

@app.route(path = "/home-info", method = HttpMethod.POST)
def home_screen_info(username):
    response_scheme = ResponseScheme()

    last_stages = {}

    for lang, info in Database.home_screen_info(username).items():
        last_stages[Languages[lang].value] = info

    response_scheme.data = {"languages": dict([(lang_obj.value, lang_code) for lang_code, lang_obj in Languages.__members__.items()]), "stages_info": last_stages}
    return response_scheme

@app.route(path = "/get-stages", method = HttpMethod.POST)
def get_stages(*args):
    response_scheme = ResponseScheme()
    response_scheme.data = Database.all_stages(args[0], args[1])
    return response_scheme

@app.route(path = "/leaderboard", method = HttpMethod.GET)
def leaderboard():

    response_scheme = ResponseScheme()
    languageFormat = {
        "EN": "GB",
        "HE": "IL",
        "sp": "ES"
    }


    leaders = Database.get_leaders("*")

    for i, leader in enumerate(leaders):
        leaders[i]["language"] = Languages[leader["languageCode"]].value

        leaders[i]["languageCode"] = languageFormat.get(leader["languageCode"], leader["languageCode"])
    
    response_scheme.data = leaders
    return response_scheme

if __name__ == "__main__":
    main()
