from api import *
from api.app import App
from database import *
from authorizations import LoginAuthorization

login_auth = Authorization(true_case = LoginAuthorization.true_case)
app = App()

@app.route(path="/login", method = HttpMethod.POST)
def login(*args):
    response = ResponseScheme()

    result = Database.login(args[0], args[1])
    response.data = result
    response.set_cookie({"token": login_auth.token(username=args[0])})
    
    return response

