from typing import List, Self, Union
import random
MAX_MEMBERS_IN_GROUP = 4

class Group:

    all = []

    def __init__(self, lang: str) -> None:
        self._lang = lang
        self.members = []

        Group.all.append(self)

    def __iadd__(self, sid: str) -> bool:
        if len(self) < MAX_MEMBERS_IN_GROUP:
            self.members.append(sid)
            return True
        return False
        

    def __isub__(self, sid: str) -> None:
        try: 
            self.members.remove(sid)
        except ValueError:
            print(f"There is no {sid} in the group.")

    def __repr__(self) -> str:
        return f"Group({self._lang})"
    
    def __len__(self) -> int:
        return len(self.members)
    
    def __contains__(self, sid) -> bool:
        return sid in self.members
    
    @staticmethod
    def find_group(lang: str) -> Union[Self,None]:
        # finds a group with the same language as lang, otherwise returns None.
        groups = [group for group in Group.all if group._lang == lang and len(group) < 4]

        if groups == []:
            return None
        
        return random.choice(groups)

