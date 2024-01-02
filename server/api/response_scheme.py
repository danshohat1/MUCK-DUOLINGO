from .enums import Statuses
from typing import Any, List, Dict, Optional, Self,TypeVar

Authorization = TypeVar("Authorization")

from dataclasses import dataclass, field
@dataclass()
class ResponseScheme:

    _data: Any = None
    _status: Statuses = Statuses.OK
    _cookies: List[Dict[str, Any]] = field(default_factory=list)
    
    #region getters and setters
    @property
    def data(self) -> Any:
        return self._data
    @data.setter
    def data(self, val: Any) -> None:
        self._data = val

    @property
    def status(self) -> Statuses:
        return self._status
    @status.setter
    def status(self, val: Statuses) -> None:
        self._status = val

    @property
    def cookies(self) -> List[Dict[str, Any]]:
        return self._cookies
    @cookies.setter
    def cookies(self, val: List[Dict[str, Any]]) -> None:
        self._cookies = val

    #endregion
    
    def set_cookie(self, cookie: Dict[str, Any]) -> None:
        self._cookies.append(cookie)
    


    def __iter__(self):
        yield "status", self._status
        yield "data", self._data
        yield "cookies", self._cookies



    