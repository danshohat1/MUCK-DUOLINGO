from api import *
from database import *
from authorizations import LoginAuthorization
from api.cors import Cors

login_auth = Authorization(true_case = LoginAuthorization.true_case)

cors = Cors(trusted_urls = "http://localhost:3000")

app = App(port = 8003,cors=cors)


@app.route(path="/login", method = HttpMethod.POST)
def login(*args):
    response = ResponseScheme()

    result = Database.login(args[0], args[1])
    response.data = result
    response.set_cookie({"token": login_auth.token(username=args[0])})
    
    return response


if __name__ == "__main__":
    app.run()
