import sys
sys.path.insert(0, '/home/azureuser/api-emaid')

activate_this = '/home/azureuser/api/env/bin/activate'
with open(activate_this) as file_:
    exec(file_.read(), dict(__file__=activate_this))

from app import app as application