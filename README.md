# Start app:

1. cd frontend/
2. npm install
3. npm run dev
4. cd backend/
5. npm install
6. run docker daemon on your PC
7. localstack start
8. npm run deploy
9. http://localhost:4566/restapis/xxxxxxxxx/local/_user_request_ copy xxxxxxxxx (you will see this in the console after completing command 8) and find all api calls, then replace previous value to xxxxxxxxx (cmd + shift + r)

You will need to create the first user with admin rights: 
to do this, in Postman you can make a request to this POST endpoint: http://localhost:4566/restapis/YOUR_UNIQUE_KEY/local/_user_request_/createUser, 
since it is expected that only an admin can create a user, you need disable validation so that there are no errors.
(backend/lambdas/createUser.js here comment out the last two middleware on lines 72-73) and then send the request.
The user should be created and you will see “OK” in the response.

Example of body you can use in Postman:
```json
{
  "username": "admin",
  "password": "admin",
  "role": "admin"
}
```

You are all set!

Perhaps you will also need to set these envs in your backend terminal:

```code
export LOCALSTACK_HOSTNAME=localhost 
export DISABLE_CORS_CHECKS=1
export DISABLE_CUSTOM_CORS_APIGATEWAY=1
```
