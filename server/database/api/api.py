from .users import Users
from .stages import Stages

""" 
    create a class the represents the multiple 'sections' api's to the database.

    Users: handles the user info in the database.
    Stages: handles the stage info in the database.
"""

Database = type("Database", (Users, Stages), {})
