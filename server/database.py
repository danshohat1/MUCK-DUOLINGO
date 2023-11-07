import sqlite3

def main():
    data = Datbase()

    print(data.get_user_id_by_username("user 1"))

class Datbase:

    def __init__(self):
        self.con = sqlite3.connect("users.sql")
        self.cur = self.con.cursor()


    def handle_home_screen(self, username):
        user_id = self.get_user_id_by_username(username)

        self.cur.execute(f"SELECT DISTINCT language_code FROM LanguageProgress WHERE user_id = {user_id};")
        languages = self.cur.fetchall()

        language_and_stage = {}

        for language_tuple in languages:
            language = language_tuple[0]  # Extract the language from the tuple
            last_stage = self.cur.execute(
                f"SELECT stage, stage_points FROM LanguageProgress WHERE user_id = {user_id} AND language_code = '{language}' ORDER BY stage DESC LIMIT 1;").fetchone()
            language_and_stage[language] = last_stage

        return language_and_stage

    def get_all_usernames(self):
        return self.cur.execute("SELECT username FROM users").fetchall()


    def get_password_by_username(self, username):
        return self.cur.execute(f"SELECT password FROM users WHERE username = '{username}';").fetchone()


    def create_user(self, username, password):
        self.cur.execute(f"INSERT INTO users (username, password) VALUES ('{username}', '{password}');")
        self.con.commit()

    def delete_user_by_username(self, username):
        self.cur.execute(f"DELETE FROM users WHERE username = '{username}';")
        self.con.commit()

    def update_user(self, old_username, new_username, new_password):
        id = self.cur.execute(f"SELECT id FROM users WHERE username = '{old_username}';").fetchone()[0]

        self.cur.execute(f"UPDATE users SET username = '{new_username}', password = '{new_password}' WHERE id = {id};")

        self.con.commit()


    def get_user_id_by_username(self, username):
        return self.cur.execute(f"SELECT id FROM users WHERE username = '{username}'").fetchone()[0]

    def get_user_by_id(self, id):
        return self.cur.execute(f"SELECT username, password FROM users WHERE id = {id}")

    def get_all_stages(self, username , language_code):
        # get all the stages for the user id in this language
        user_id = self.get_user_id_by_username(username)

        stages =  self.cur.execute(f"SELECT stage, stage_points FROM LanguageProgress WHERE user_id = {user_id} AND language_code = '{language_code}';").fetchall()

        stages_dic = {}

        for stage in stages:
            stages_dic[stage[0]] = stage[1]

        return stages_dic

    def get_all_languages(self , id):
        # get all the languages that the user id is learning
        return self.cur.execute(f"SELECT DISTINCT language_code FROM LanguageProgress WHERE user_id = {id};")

    def close(self):
        self.con.close()

if __name__ == "__main__":
    main()





