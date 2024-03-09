from typing import Optional, Union
import random

# Maximum number of members allowed in a group
MAX_MEMBERS_IN_GROUP = 4


class Group:
    # Class variable to store all instances of the Group class
    all = []

    def __init__(self, lang: str) -> None:
        """
        Initialize a new Group instance.

        Parameters:
        - lang (str): Language associated with the group.
        """
        self._lang = lang
        self.members = []  # List to store group members

        # Add the new group instance to the class variable 'all'
        Group.all.append(self)

    def __iadd__(self, sid: str) -> bool:
        """
        Add a member to the group if the group is not at its maximum capacity.

        Parameters:
        - sid (str): ID of the member to be added.

        Returns:
        - bool: True if the member was added, False otherwise.
        """
        if len(self) < MAX_MEMBERS_IN_GROUP:
            self.members.append(sid)
            return True
        return False

    def __isub__(self, sid: str) -> Optional['Group']:
        """
        Remove a member from the group.

        Parameters:
        - sid (str): ID of the member to be removed.

        Returns:
        - Optional['Group']: The modified group instance if the member
         was removed, None otherwise.

        """
        try:
            self.members.remove(sid)
            return self
        except ValueError:
            print(f"There is no {sid} in the group.")
            return None

    def __repr__(self) -> str:
        """
        Return a string representation of the Group instance.
        """
        return f"Group({self._lang})"

    def __len__(self) -> int:
        """
        Return the number of members in the group.
        """
        return len(self.members)

    def __contains__(self, sid: str) -> bool:
        """
        Check if a member with a given ID is present in the group.

        Parameters:
        - sid (str): ID of the member to check.

        Returns:
        - bool: True if the member is in the group, False otherwise.
        """
        return sid in self.members

    @staticmethod
    def find_group(lang: str) -> Union[Optional['Group'], None]:
        """
        Find a group with the specified language and available space.

        Parameters:
        - lang (str): Language to search for in groups.

        Returns:
        - Union[Optional['Group'], None]: A group instance if found,
         None otherwise.
        """
        # List comprehension to filter groups based on language and space
        groups = [group for group in Group.all if
                  group._lang == lang and len(group) < MAX_MEMBERS_IN_GROUP]

        # Check if there are any matching groups
        if not groups:
            return None

        # Return a random group from the filtered list
        return random.choice(groups)
