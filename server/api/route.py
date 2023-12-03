from enums import HttpMethod
from typing import Callable

class Route:
    all = []

    def __init__(self, func:Callable, method: HttpMethod = HttpMethod.GET, path: str = "/") -> None:

        self.method = method
        self.path = path
        self._func = func

        Route.all.append(self)

    def __call__(self, *args) -> None:
        self._func(*args)
        
@Route
def muck(mc):
    print(mc)


print(muck("mc"))

print(print(Route.all))