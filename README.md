## Description

Daylee backend starter repository.

## Installation

```bash
$ git clone
$ npm install
```

## Env Variables

Voici la liste des variables d'environnements et leur implémentation :

1 - Créer un dossier 'env' qui va contenir deux fichier :
    - .env qui contiendra les valeurs ci-dessous
    - cloudinary.config.ts avec ce code : 
    ```JavaScript
      export default registerAs('cloudinary', () => ({
        cloudName: process.env.CLOUD_NAME,
        apiKey: process.env.API_KEY,
        apiSecret: process.env.API_SECRET,
        }));
    ```


# Jwt, ajouter une clé secrete et un temps d'expiration
JWT_SECRET --> n'importe quel string fait l'affaire lors du test
JWT_EXPIRATION_TIME --> de préference 1d ou + pour ne pas avoir à se reconnecter trop souvent lors des test

# Cloudinary
Il faudra d'abord se créer un compte sur le site https://cloudinary.com/
Puis récuperer les variables ci-dessous : 
CLOUDINARY_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

On peut les retrouver sur le dashboard : 
![Cloundinary](https://cloudinary-res.cloudinary.com/image/upload/bo_1px_solid_gray/f_auto/q_auto/docs/prod_env_credentials.png)

# MongoDB
Et enfin la variable pour la BDD MongoDb:
MONGODB_URL = 'urlMongoDb' --> créer un compte MongoDB en ligne ou en local avec MongoDBCompass


## Running the app

```bash

# watch mode
$ npm run start:dev

```

## Api Doc

After launching the app, go to http://localhost:3000/api/doc, here you will find the swagger with all the api routes.

## License

Nest is [MIT licensed](LICENSE).
