# Exercice 2

## But

Nous allons maintenant agrémenter notre projet avec 1 nouvelle lambda pour récupérer des objets JSON.

## Enoncé 

> Si vous avez sauté une étape ou si, pour une raison X ou Y votre appli ne marche plus vous pouvez copier-coller les fichiers depuis le dossier src de l'exercice 2. Il contiendra une base de travail propre pour bien commencer l'exercice.

### Etape 1 : Renommer notre fichier de lambda hello-world

Afin de garder une certaine cohérence, nous allons essayer de nommer les fichier correctement.

Renommez donc le fichier `handler.js` en `hello.js`

Vous vous rendrez certainement compte, si vous essayez de déployer ou d'invoquer localement votre fonction hello que cela ne fonctionne plus et vous retourne une erreur du type : 
```
 Error: Cannot find module '.../isc-bdx-atelier-initiation-aws/exercices/exercice3/src/handler'
```

Nous venons de changer le nom du fichier, il faut donc indiquer à serverless le nom de notre nouveau fichier.
Dans le fichier serverless.yml, changez l'appel au handler : 
```yaml
...
  hello:
    handler: handler.hello
    events:
    ...
```
Par  (la valeur de handler change): 
```yaml
...
  hello:
    handler: hello.hello
    events:
    ...
```
En effet la variable handler fait référence  au nom du fichier js dans laquelle se trouve votre fonction, suivi d'un point et du nom de la méthode exportée (avec ```module.exports```) dans le fichier js.

### Etape 2 : Créer un service de récupération des films

Afin de bien séparer notre code métier de notre lambda, nous allons créer un service dédié pour récupérer nos données.

Pour l'exercice, nous allons créer un service permettant de rércupérer des films.

Créez le fichier ```movie.service.js``` et exportez un méthode getMovies dans le module qui retournera la liste de films suivante : 

```javascript
[
    {
        id: 1,
        title: 'Into the wild',
        director: 'Sean Penn',
        date: 2007
    },
    {
        id: 2,
        title: 'Le père noël est une ordure',
        director: 'Jean-Marie Poiré',
        date: 1982
    }
]
```
 

### Etape 3 : Créer une nouvelle lambda

Maintenant que nous avons un service pour récupérer nos données, créons une seconde lambda.

En vous inspirant du code déjà fait, créez une lambda ```get-movies.js``` et pensez à configurer correctement votre fichier ***serverless.yml*** pour que l'on puisse récupérer la liste de film via un appel HTTP GET sur l'url ```/movie```

> Attention Il faudra toujours que le body retourné par votre lambda (via la méthode callback) soit au format `string`. Il faudra donc bien penser à faire un formattage JSON de vos objets avec `JSON.stringify(movies)`

### Etape 4 : Deployez et testez votre code

En reprenant les commande de l'exercice 1 deployez et testez votre lambda avec POSTMAN

Si vous voulez afficher les logs d'execution de votre lambda vous pouvez utiliser la commande suivante : 

```
serverless logs --function get-movie --stage slabre
```