import hashlib
import re


class Hash:
    @classmethod
    def hashed_password(cls, password: str) -> str:
        return hashlib.sha256(password.encode("UTF-8")).hexdigest()

    @classmethod
    def is_hashed(cls, password: str) -> bool:
        return bool(re.compile(r'^[a-fA-F0-9]{64}$').match(password))
