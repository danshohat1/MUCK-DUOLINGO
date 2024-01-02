from .enums import HttpMethod
from typing import Callable, Optional
from .authorization import Authorization

class Route:
    # Class to define routes and associate them with corresponding functions

    # Dictionary to store all routes and their associated functions
    all = {}

    def __init__(self, method: HttpMethod = HttpMethod.GET, path: str = "/", authorization: Optional[Authorization] = None) -> None:
        """
        Initialize a new Route instance.

        Parameters:
        - method (HttpMethod): The HTTP method associated with the route (default is GET).
        - path (str): The path associated with the route (default is "/").
        """
        self.method = method
        self.path = path
        self.authorization = authorization

        if self.authorization and self.method != HttpMethod.POST:
            raise Exception("Authorization must be in POST method")
        

        # Register the route and associate it with the __call__ method
        Route.all[self] = self.__call__

    def __call__(self, func: Callable) -> None:
        """
        Associate a function with the route.

        Parameters:
        - func (Callable): The function to be associated with the route.
        """
        Route.all[self] = func
