from makeWeb import makeWeb
import os

# Make files containing user info
execfile("makeMap.py")

basepath = os.path.dirname(os.path.realpath(__file__))
path = basepath+"/data/"
output = ""
database_mod_time = int(os.path.getmtime("data.txt"))
following = sorted(os.listdir(path))
for person in following:
    user_mod_time = int(os.path.getmtime(path+person))
    # Check if path is valid and if the folder has been changed
    if os.path.isdir(path+person) and user_mod_time > database_mod_time:
        
        makeWeb(path+person)
        print person
