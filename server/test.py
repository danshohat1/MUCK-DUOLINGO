from api import *

key = JWTKey("1", "user1")


@Authorizition
def check(*args):
    if args[0] == "authenticated":
        print("hey it worked")
        return

    print('hey, it didnt work')

check(key)