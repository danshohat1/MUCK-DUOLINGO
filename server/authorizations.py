from database import Database
from easy_http import *
from typing import Dict

class LoginAuthorization:
    @staticmethod
    def true_case(data: Dict): 
       response = ResponseScheme()
    
       username = data.get("username")
       if not username:
           return
              
       if Database.check_username_exists(username):
           response.data = {"data": "Logged in successfully", "username": username}
           return response
    
    @staticmethod
    def false_case():
        response = ResponseScheme()

        response.data = "key not valid"

        return response