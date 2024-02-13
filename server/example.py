from easy_http import *
from easy_http.render import Render

app = App(port = 8000)

def main():
    app.run()


@app.route(method = HttpMethod.GET, path = "/")
def home():
    return Render("index.html", username = "Muck mck")


@app.route(method=HttpMethod.GET, path = "/login")
def login():
    response_scheme = ResponseScheme()
    response_scheme.data = "<h1> Login Successful </h1>"
    return response_scheme

@app.route(method=HttpMethod.GET, path = "/secret")
def secret():
    response_scheme = ResponseScheme()
    response_scheme.data = {"secret_key": "secret_value", "muck": "muck."}
    return response_scheme


if __name__ == "__main__":
    main()