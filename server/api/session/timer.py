import time


# just a timer class..
class Timer:
    def __init__(self, minutes: int):
        time.sleep(minutes*60)
        
