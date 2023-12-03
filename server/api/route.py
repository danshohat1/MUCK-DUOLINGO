from .enums import HttpMethod
from typing import Callable

class Route:
    all = {

    }

    def __init__(self, method: HttpMethod = HttpMethod.GET, path: str = "/") -> None:

        self.method = method
        self.path = path

        Route.all[self] = self.__call__

    def __call__(self, func: Callable) -> None:
        Route.all[self] = func





