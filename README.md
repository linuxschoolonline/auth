# SkyValley
SkyValley is a fictional company. We use it to demonstrate several DevOps techniques like CI/CD, Docker, Kubernetes, Terraform, Packer as well as cloud provide technologies.
## Auth service
The Auth service is tasked with signing up users and logging them in. When a user signs up, they can login with there credentials through the `/login` endpoint and receive a bearer token. This token can be later used to login to other services in the application.
Available endpoints:
*  `/signup`: expects a POST request with the following JSON object:
```json
{
  "username": "your_user",
  "password": "your_password",
  "name": "your_real_name"
}
```
* `/login`: using the username and password, you get a JWT token.
* `/logout`: log out from the application
* `/delete`: deletes the user