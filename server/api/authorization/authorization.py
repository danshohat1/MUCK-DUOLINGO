import jwt
from typing import Callable, Union, Dict
from datetime import datetime, timedelta
from dataclasses import dataclass, field

SECRET_KEY = "hey_you_found_me"

class Authorizition:

    def __init__(self, func: Callable):
        self.func = func

    def __call__(self, *args) -> Union[bool, Dict]: 
        try:
            
            decoded_token = jwt.decode(str(args[0]), SECRET_KEY, algorithms=["HS256"])
            print(decoded_token)
            expiration_time = datetime.utcfromtimestamp(decoded_token["exp"])

            if datetime.utcnow() > expiration_time:
                return self.func(*args)


            return self.func("authenticated")
        
        except:
            return self.func(*args)


@dataclass
class JWTKey:
    username: str 

    def __str__(self) -> str:
        payload = {
            "username": self.username,
            "exp": datetime.utcnow() + timedelta(minutes=30)

        }

        return jwt.encode(payload, SECRET_KEY, algorithm="HS256")

        

