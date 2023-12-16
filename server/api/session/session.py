import threading
import uuid
from .timer import Timer

class LogInSession:
    all = []

    def __init__(self, domain: str, port: int, expire_time: int = 10) -> None:
        self._domain = domain
        self._port = port 

        self._id = uuid.uuid1()
        self._data = {}

        # in minutes
        self.expire_time = expire_time

    

        LogInSession.all.append(self)
        

        # delete the session right after the time is expired..
        threading.Thread(target=self.__del__()).start()

    def __setitem__(self, key: str, value: str) -> None:
        self._data[key] = value

    def __getitem__(self, key: str) -> str:
        return self._data[key]

    def __del__(self) -> None:
        Timer(self.expire_time)
        LogInSession.all = list(filter(lambda session: session.id != self, LogInSession.all))[0]
    


