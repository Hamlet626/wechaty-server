# wechaty-server

A sever using express doing wechaty operation,e.g. find rooms, say in rooms, login/logout, get qrcode...

Steps to run locally

1

add a ".env" file
    
    e.g.
    PORT=8001
    BOT_TOKEN=PADLOCAL_KEY_XXXXX
    BOT_NAME=wechaty-puppet-padlocal
    WECHATY_LOG=verbose
    AUTH_KEY=CUSTOME_API_SECRET_HEADER

2

start server:
    
    npm install
    node src/app.js

3 

send requests to localhost:8081/xxx with header {wckey:CUSTOME_API_SECRET_HEADER}

API endpoints see src/bot/api.js, 

e.g. http://localhost:8001/getQRCode, http://localhost:8001/wct/sayToRoom
