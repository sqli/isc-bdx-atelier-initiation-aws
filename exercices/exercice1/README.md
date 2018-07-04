# Exercice 1

## Etapes

Voici les premières étapes pour commencer un projet serverless : 

* Copie des credentials AWS
* Installation de serverless via npm
* Création d'un nouveau projet serverless
* Création d'une lambda 'hello-world'
* Exécution et déploiement du code

## Enoncé 

> Si vous avez sauté une étape ou si, pour une raison X ou Y votre appli ne marche plus vous pouvez copier-coller les fichiers depuis le dossier src de l'exercice que vous souhaitez reprendre. Il contiendra une base de travail propre pour bien commencer l'exercice.

### Etape 1 : Les credentials AWS

Copiez le fichier credentials (fourni dans le dossier "configuration" du repo) dans ~/.aws/

### Etape 2 : Installez serverless
 
Pour installer serverless, lancez la commande `npm install -g serverless` dans une invite de commande de votre ordinateur. 
> NPM (node package manager) va s'occuper de récupérer les executables de serverless et toutes les dépendances pour vous.

### Etape 3 : Générer un projet serverless

Dans votre invite de commande, rendez vous dans le dossier exercices/src, c'est la que vous allez toujours travailler. De là, lancez la commande suivante : 
```
serverless create --template aws-nodejs
```
Serverless va vous créer l'architecture de base pour un projet node js standard

> Serverless propose également d'autre typologies de projet et notamment avec les languages : Typescript, Java, C#

> Pour toutes les lignes de commande, vous pouvez remplacer `serverless` par `sls`

Maintenant que votre projet est créé, vous pouvez regarder le fichier serverless.yml qui est généré. C'est là que toute la configuration de votre environnement se trouve.
Commencez par changer la ligne `service:` en mettant le nom de notre micro-service : `hello-sqli`.

Ainsi toutes nos ressources seront préfixées avec le nom de notre micro-service.

### Etape 4 : Personnaliser le code source de la lambda et configurer l'appel via HTTP

Une lambda à automatiquement été créée par serverless, et un code par défaut à été inséré.
Modifions un peu ce code pour retourner simplement la chaine de caractères `"Hello SQLI Addict !"`.

Pour cela modifiez le fichier hanlder.js et remplacez la propriété **body** de la requête : 

```javascript
const response = {
    statusCode: 200,
    body: 'Hello SQLI Addict !'
};
```

Maintenant que nous avons configuré notre code pour retourner le texte que nous souhaitions, penchons nous sur la configuration du fichier serverless.yml pour que cette lambda soit disponible lors d'un appel HTTP GET.

Dans le fichier serverless.yml aprés la déclaration de votre fonction lambda, rajoutez la configuration pour obtenir le résultat suivant :
```yaml
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: GET
``` 
Nous définissons ainsi qu'un appel HTTP sur la route '/hello' avec la méthode GET lancera notre méthode définie dans le fichier `handler.js` et exportée sous le nom de fonction `hello`

### Etape 5 : Testons notre code

Deux moyens permettent maintenant de tester notre lambda : 
* L'invocation locale avec la commande `sls invoke local`
* L'invocation distante avec la commande `serverless invoke`

#### Commençons par invoquer en local notre fonction : 

```
serverless invoke local --function hello
```
l'option `--function hello` permet de préciser quelle lambda nous invoquons, `hello` faisant référence au nom donné à la lambda dans le fichier serverless.yml.

Vous devez voir apparaitre le payload de réponse complet : 

```
{
    "statusCode": 200,
    "body": "Hello SQLI Addict !"
}
```

#### Invocation distante :

Pour pouvoir faire une invocation distante il faut tout d'abord déployer notre code sur Amazon.

### Etape 6 : déployons notre code

Nous allons déployer notre lambda en utilisant un stage personnel (avec notre en préfix notre nom), pour éviter d'écraser le travail des autres:

```
serverless deploy --stage slabre
```
Cette commande déploie tout le projet serverless sur AWS. 
> Vous pouvez également déployer une seule fonction en utilisant l'option `--function` ou `-f`

> La notion de stage, permet de préfixer les lambda qui seront déployées et d'identifer dans la lambda le stage courant via `process.env['STAGE']`.
> Ca servira notamment pour ceux qui voudront différencier différents environnements d'execution (developpement, recette, intégration, production)

### Etage 7 : Testez votre code directement déployé

Pour tester la première méthode consiste à utiliser la ligne de commande. 

Nous avons tout à l'heure lancé la commande `serverless invoke local` pour tester notre code en local. Il suffit maintenant d'apeller la même commande sans l'attribut `local` pour executer notre code distant

``` 
serverless invoke --function hello --stage slabre
```
> Pensez à bien préciser votre stage dans toutes vos commandes pour ne pas utiliser le code de quelqu'un d'autre.

#### Tester avec Postman

Un autre moyen de tester est d'utiliser un outil de test d'api type Postman.
Lors de votre déploiement (`serverless deploy`), serverless vous retourne l'URL à laquelle votre code est accessible : 

```
Serverless...
...
endpoints:
  GET - https://8nsa6a3f8g.execute-api.us-east-1.amazonaws.com/slabre/hello
...
```
On peut donc utiliser cette url dans outil comme postman ou directement dans un navigateur.

## Liens utiles

* NodeJS : https://nodejs.org/en/ , https://nodejs.org/docs/latest-v9.x/api/
* Serverless : https://serverless.com
* Documentation serverless create : https://serverless.com/framework/docs/providers/aws/cli-reference/create/
* Console AwS : https://console.aws.amazon.com/
* Postman : https://www.getpostman.com/
