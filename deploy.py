"""
Script used to deploy Moonium API server both in production and staging
Created by Enea Guidi
"""

import os, sys
from datetime import date

# Argument checking
if len(sys.argv) < 2:
    print("Provide which environment you want to deploy (staging, production)")
    os._exit(-1)
elif sys.argv[1] not in ["staging", "production"]:
    print(f"Unrecognized option {sys.argv[1]}")
    os._exit(-1)


deploy_env = {
    "production": {
        "port": 7000,
        "env": "production",
        "name": "Production",
        "ip": "51.158.42.69",
        "path": "Production/Selene",
    },
    
    "staging": {
        "port": 5000,
        "env": "staging",
        "name": "Staging",
        "ip": "51.158.42.69",
        "path": "Staging/Selene"
    },
}[sys.argv[1]]

remote_cmd = "; ".join(
    [
        f"cd /opt/{deploy_env['path']}",
        "rm -rf .",
        "unzip -oq ../../out.zip -d .",
        "yarn install",
        "yarn build",
        f"fuser -k {deploy_env['port']}/tcp",
        f"NODE_ENV={deploy_env['env']} nohup yarn start &> /dev/null &"
        "rm -rf ../../out.zip",
    ]
)


deploy_msg = f"""
🚀 NEW DEPLOY

🕒 Date: {date.today().strftime("%d/%m/%Y")}
🤖 Project: Moonium (Webservice)
🛢 Server: {deploy_env["name"]}
🎯 Target: https://{deploy_env["path"]}
🛠 Features: ToDo Write here
"""


if __name__ == "__main__":
    print("Starting deployment process")

    # Removes the old build directory
    os.system("rm -rf out.zip")
    # Creates a new zip archive
    os.system("zip -r out.zip . -x 'dist/*' 'node_modules/*'")

    # Uploads the dump to the staging/production server
    os.system(f"scp out.zip regsm@{deploy_env['ip']}:/opt/")
    # Unpacks the dump to the folder path, kill the previous server and starts a new one
    os.system(f"ssh regsm@{deploy_env['ip']} \"{remote_cmd}\" ")

    # Removes the old build directory
    os.system("rm -rf out out.zip")

    print("Deploy completed successfully!", "\n", deploy_msg)
