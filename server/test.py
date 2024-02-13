from database import *
from lessons.languages import Languages

languageFormat = {
    "EN": "GB",
    "HE": "IL",
    "sp": "ES"
}


leaders = Database.get_leaders("*")

for i, leader in enumerate(leaders):
    leaders[i]["language"] = Languages[leader["languageCode"]].value

    leaders[i]["languageCode"] = languageFormat.get(leader["languageCode"], leader["languageCode"])


print(leaders)

Database.add_stage_data("user4", "HE", 2, 100)