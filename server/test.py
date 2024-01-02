from api import *




def true_case(data):

    response = ResponseScheme()

    response.data = "hello " + data["username"]

    return response

def false_case():
    print("false has been raised")

auth = Authorization(true_case=true_case, false_case=false_case)
def main():
    print(auth.token(username="user1", age = 17))
    Server()
    App()
    
   
    

class App:
    @staticmethod
    @Route(path="/", method = HttpMethod.POST, authorization= auth)
    def example(*args):
        print(args)
        response = ResponseScheme()

        response.data = "Hello World!"

        return response
    


if __name__ == "__main__":
    main()

