## Description

Daylee backend starter repository a little instagram clone with all uses like post / like / follow and even messaging.

# Installation

```bash
$ git clone
$ npm install
```

# Env Variables

Here are the env variables and there implementations :

1 - Create a file 'config.yalm' at the root of the project with these values : <br />
    ```

    MONGODB: 
      URL: //create a mongo db account

    JWT:
      SECRET: //secretKey
      EXPIRATION_TIME: //randomTime

    CLOUDINARY: //See Below
      NAME:  
      KEY: 
      SECRET: 
    ```


### Jwt, add a key and an expiration time
JWT_SECRET  <br />
JWT_EXPIRATION_TIME -->  <br />

### Cloudinary
Create an account on https://cloudinary.com/

You can then find your credential on the home page when logged :
![Cloundinary](https://cloudinary-res.cloudinary.com/image/upload/bo_1px_solid_gray/f_auto/q_auto/docs/prod_env_credentials.png)

# Running the app

```bash

# watch mode
$ npm run start:dev

```

# Api Doc

After launching the app, go to http://localhost:3000/api/doc, here you will find the swagger with all the api routes.

## License

Nest is [MIT licensed](LICENSE).
