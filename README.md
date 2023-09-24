## Description

Daylee backend starter repository a little instagram clone with all uses like post / like / follow and even messaging.

# Installation

```bash
$ git clone
$ npm install
```

# Env Variables

Voici la liste des variables d'environnements et leur implémentation :

1 - Créer un fichier 'config.yalm' à la racine du projet avec les valeurs ci-dessous : <br />
    ```

    MONGODB: 
      URL: créer un compte MongoDB en ligne ou en local avec MongoDBCompass

    JWT:
      SECRET: clé secrete
      EXPIRATION_TIME: de préference 1d ou + pour ne pas avoir à se reconnecter trop souvent lors des test3d 

    CLOUDINARY: // Voir les infos ci-dessous
      NAME:  
      KEY: 
      SECRET: 
    ```


### Jwt, ajouter une clé secrete et un temps d'expiration
JWT_SECRET  <br />
JWT_EXPIRATION_TIME -->  <br />

### Cloudinary
Env de Cloudinary, il faudra d'abord se créer un compte sur le site https://cloudinary.com/

On peut les retrouver sur le dashboard :
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
