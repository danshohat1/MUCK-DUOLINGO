import sqlite3
from typing import List


class Database:
    def __init__(self):
        """Initialize the Database instance """
        self.con = sqlite3.connect("./database/users.sql",
                                   check_same_thread=False)
        self.cur = self.con.cursor()

    def handle_home_screen(self, username):
        """Retrieve language progress information for a user"""
        user_id = self.get_user_id_by_username(username)
        # Fetch distinct language codes associated with the user
        self.cur.execute(
            f"SELECT DISTINCT language_code FROM "
            f"LanguageProgress WHERE user_id={user_id};")
        languages = self.cur.fetchall()

        language_and_stage = {}

        for language_tuple in languages:
            language = language_tuple[0]  # Extract the language from the tuple
            # Fetch the last stage and stage points for each language
            last_stage = self.cur.execute(
                f"SELECT stage, stage_points FROM LanguageProgress "
                f"WHERE user_id={user_id} AND language_code = '{language}' "
                f"ORDER BY stage DESC LIMIT 1;").fetchone()
            language_and_stage[language] = last_stage
        return language_and_stage

    def get_all_usernames(self):
        """Get a list of all usernames from the 'users' table."""
        return self.cur.execute("SELECT username FROM users").fetchall()

    def get_password_by_username(self, username):
        """Get the password associated with a given username."""
        return self.cur.execute(
            f"SELECT password FROM users "
            f"WHERE username = '{username}';").fetchone()

    def create_user(self, username, password):
        """Create a new user in the 'users' table."""
        self.cur.execute(
            f"INSERT INTO users (username, password) "
            f"VALUES ('{username}', '{password}');")
        self.con.commit()

    def delete_user_by_username(self, username):
        """Delete a user from the 'users' table based on the username."""
        self.cur.execute(f"DELETE FROM users WHERE username = '{username}';")
        self.con.commit()

    def update_user(self, old_username, new_username, new_password):
        """Update the username and password of a user in the 'users' table."""
        id = self.cur.execute(
            f"SELECT id FROM users"
            f" WHERE username = '{old_username}';").fetchone()[
            0]
        self.cur.execute(
            f"UPDATE users SET username = '{new_username}', "
            f"password = '{new_password}' WHERE id = {id};")
        self.con.commit()

    def get_user_id_by_username(self, username):
        """Get the user ID associated with a given username."""
        return self.cur.execute(
            f"SELECT id FROM users "
            f"WHERE username = '{username}'").fetchone()[0]

    def get_user_by_id(self, id):
        """Get the username and password associated with a given user ID."""
        return self.cur.execute(
            f"SELECT username FROM users WHERE id = {id}").fetchone()

    def get_all_stages(self, username, language_code):
        """Get all stages and stage points for a
        user in a specific language."""
        user_id = self.get_user_id_by_username(username)

        # Fetch all stages and stage points for the user ID and language code
        stages = self.cur.execute(
            f"SELECT stage, stage_points FROM LanguageProgress "
            f"WHERE user_id={user_id} AND "
            f"language_code = '{language_code}';").fetchall()

        stages_dic = {}

        for stage in stages:
            stages_dic[stage[0]] = {"grade": stage[1]}

        return stages_dic

    def get_stage_data(self, username, language_code, stage):

        user_id = self.get_user_id_by_username(username)

        results = self.cur.execute(
            f"SELECT * FROM LanguageProgress WHERE user_id = {user_id} "
            f"AND language_code = '{language_code}' "
            f"AND stage = {stage};").fetchone()

        column_names = [desc[0] for desc in self.cur.description]

        parsed_results = dict(zip(column_names, results))

        return parsed_results

    def update_stage_data(self, username, language_code, stage, stage_points):

        user_id = self.get_user_id_by_username(username)

        self.cur.execute(
            f"UPDATE LanguageProgress SET stage_points = {stage_points} "
            f"WHERE user_id = {user_id} AND language_code = '{language_code}' "
            f"AND stage = {stage};")
        self.con.commit()

    def has_stage_data(self, username, language_code, stage):

        user_id = self.get_user_id_by_username(username)

        return True if self.cur.execute(
            f"SELECT * FROM LanguageProgress WHERE user_id = {user_id} "
            f"AND language_code = '{language_code}' "
            f"AND stage = {stage};").fetchone() else False

    def add_stage_data(self, username, language_code, stage, stage_points):
        """Add a new stage and stage points for a user in a
        specific language."""
        user_id = self.get_user_id_by_username(username)
        self.cur.execute(
            f"INSERT INTO LanguageProgress "
            f"(user_id, language_code, stage, stage_points) "
            f"VALUES ({user_id}, '{language_code}', {stage}, {stage_points});")
        self.con.commit()

    def get_all_languages(self, username: str) -> List[str]:
        """Get all distinct languages that a user is learning."""
        user_id = self.get_user_id_by_username(username)
        return self.cur.execute(
            f"SELECT DISTINCT language_code FROM LanguageProgress "
            f"WHERE user_id={user_id};").fetchall()

    def get_leaders(self, lang_code: str = "*") -> List[str]:
        """Get all usernames with the highest
        stage for a given language code."""
        if lang_code == "*":
            query = """
                    SELECT user_id, MAX(stage) as highest_stage, language_code
                FROM LanguageProgress
                GROUP BY user_id, language_code
                ORDER BY highest_stage DESC, language_code, user_id
                    """
        else:
            query = f"""
                    SELECT user_id, MAX(stage) as highest_stage, language_code
                FROM LanguageProgress
                WHERE language_code = '{lang_code}'
                GROUP BY user_id, language_code
                ORDER BY highest_stage DESC, language_code, user_id
                    """

        res = self.cur.execute(query).fetchall()
        print(res)
        res = [(self.username(val[0])[0], val[1], val[2]) for val in res if
               self.username(val[0])]
        print(res)
        return res

    def username(self, id: str) -> str:
        return self.get_user_by_id(id)

    def close(self):
        """Close the database connection."""
        self.con.close()
