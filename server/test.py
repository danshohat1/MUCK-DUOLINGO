from api import *

app = App(port = 8000)

def main():
    app.run()

@app.route(method = HttpMethod.GET, path = "/")
def home(*args):
    print(args)
    response_scheme = ResponseScheme()
    response_scheme.data = "<h1> Hello World </h1>"
    return response_scheme


@app.route(method=HttpMethod.GET, path = "/login")
def login(*args):
    response_scheme = ResponseScheme()
    response_scheme.data = "<h1> Login Successful </h1>"
    return response_scheme


if __name__ == "__main__":
    main()