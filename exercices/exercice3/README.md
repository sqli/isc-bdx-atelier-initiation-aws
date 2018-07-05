# Exercice 3

## But

Nous passons aux choses sérieuses, nous allons définir une ressource DynamoDB pour stocker vos données en NO-SQL.

Et puis pour pouvoir créer des données, nous allons rajouter une lambda sur la méthode HTTP POST.

## Enoncé 

> Si vous avez sauté une étape ou si, pour une raison X ou Y votre appli ne marche plus vous pouvez copier-coller les fichiers depuis le dossier `solution` de l'exercice 2. Il contiendra une base de travail propre pour bien commencer l'exercice.

### Etape 1 : Un peu de nettoyage

Comme nous commençons à avoir un peu de code commencons par creer un dossier `movies` qui contiendra deux dossiers : `services` et `lambdas`. Puis placez le fichier `movie-service.js` dans le dossier `movies/services` et `get-movie.js`dans le dossier `movies/lambdas`

> Attention à bien mettre à jour les propriétés handler de votre fichier serverless.yaml avec le nouveau chemin vers les fichiers.

> Attention également à mettre à jour votre `require()` dans `get-movie.js`

### Etape 2 : Rajouter une table DynamoDB dans les ressources

Nous voulons maintenant stocker nos données dans une table NoSQL. Amazon à une solution pour ca.

Utilisons DynamoDB : 

#### Définition de la ressource
Dans notre fichier serverless.yml nous allons rajouter une section `resources:` dans laquelle nous allons pouvoir définir notre table dynamo DB tel que suit : 

```yaml
resources:
  Resources:
    MoviesTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:provider.environment.DYNAMODB_TABLE}
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```

Pour créer cette table DynamoDB nous avons besoin de définir à minima :
 * un nom 
 * le nom et le format de la propriétée qui servira d'identifiant (de clé primaire)
 * la politique de scallabilité de notre table (nombre d'accés en lecture/écriture max en concurrence)

Nous utilisons ici dans la propriétée TableName une variable, inscrite sous la forme ${variable}. 
Celle ci fait référence à `self:` qui indique une variable définie dans le même fichier. Puis à `provider.environment` qui est un lieu de stockage de variable propre à l'environnement. Et enfin à `DYNAMODB_TABLE` qui est un nom de variable arbitrairement choisi.
Pour que cela fonctionne il faut donc que nous rajoutions cette variable.

> Si nous utilisons une variable plutôt qu'une valeur brut c'est parce qu'il est nécessaire de rajouter la notion de `stage` dans le nom de la table DynamoDB pour que celle ci ne soit pas partagé par tous les environnements de travail (et pour l'exercice par tous les participants).

> Les `ReadCapacityUnits` et `WriteCapacityUnits` sont ici à 1, ils peuvent être augmentés si des pics d'activités sont prévus sur cette table, mais la facture augmentera alors rapidement

#### Variable d'environnement
En haut du fichier nous allons pouvoir rajouter notre variable dans la section `provider:  environment:` : 

```yaml
provider:
  environment:
    DYNAMODB_TABLE: ${opt:stage, self:provider.stage}-movies
```

Nous utilisons donc ici la variable `${opt:stage, self:provider.stage}` qui permettra de récupérer le stage passé en paramètre, ou celui défini par défaut dans le fichier serverless.yml
> Nous aurions aussi pu utiliser la variable `${self:service}` pour récupérer le nom du service courant (défini en haut de notre fichier serverless.yml)

#### Déploiement 
Deployons donc notre ressource et observons sa création dans la console !

> Tip : `serverless deploy --stage slabre`

### Etape 3 : Accés à la table depuis notre code

Essayons maintenant d'accéder à la table Dynamo depuis notre code.

#### Installation du aws-sdk en dépendance npm

Avant tout il nous faut les librairies d'accés à DynamoDB, pour ca nous allons utiliser ***npm*** et sa gestion de dépendances : 
Initialisons le projet npm
```
npm init
```
> Dans les options de l'invite de commande, saisissez le nom de notre service : hello-sqli puis passez toutes les autres questions avec la touche entrée.

Cela vous crée un fichier package.json qui servira à définir le fonctionnement de votre package npm et toutes ses dépendances.

Maintenant ajoutez le package aws-sdk en dépendance de développement 
```
npm install --save-dev aws-sdk
```
> Attention si vous n'installez pas avec l'option `--dev`, serverless va packager tout le sdk avec vos lambda et la taille du fichier zip uploadé vas alors exploser ! Pensez donc bien à mettre `aws-sdk` en `devDependencies` pour être sêr qu'il ne sera pas embarqué par serverless. Car il et déjà dispnoible automatiquement sur l'infrastructure aws.

#### Import des librairies AWS dynamoDB

Dans votre code vous pouvez maintenant importer les librairies de DynamoDB : 

```javascript
const awsSdk = require('aws-sdk');
const dynamoDBClient=   new awsSdk.DynamoDB.DocumentClient();
```

#### Requêtage de la table

Documentation Aws SDK pour la classe Document Client:
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html

Comme vous pourrez le voir dans la documentation ci-dessus, l'API DynamoDB.DocumentClient a notamment comme fonctions disponibles : 
* scan
* put
* get

Utilisez la méthode scan pour enregistrer et récupérer les données dans la table

> Astuce : pour récupérer une variable définie dans le fichier serverless.yml vous pouvez utiliser dans le fichier js, la syntaxe : `process.env.MA_VARIABLE`, servez vous en pour récupérer le nom de la table depuis la variable définie à l'exercice 2

Comme vous le verrez, la méthode scan est asynchrone. Pour s'affranchir de cette problématique utilisez la syntaxe suivante : 
```javascript
const movies = await dynamoDBClient.scan(...).promise();
```

Vous utilisez ainsi les async/await de javascript qui permettent de rendre le code plus lisible et de s'affranchir de l'asynchronisme.

#### Tests

Déployez votre code et lancez la lambda get-movie (avec invoke ou via postman)

Devinez quoi : ca ne marche pas !!

### Etape 4 : Gestion des roles d'execution de la lambda

Pour que cela fonctionne il nous reste une petite chose à ajouter à notre serverless.yml, ce sont les iamRoleStatements.

Il s'agit de l'ensemble des droits que l'on provisionne dans nos lambda. A l'éxecution les lambdas endossent un rôle d'execution, il faut donc ajouter des autorisations à ce rôle pour que les lambdas puissent accéder aux ressources que nous avons créé.

Pour cela, ajoutez ceci à votre fichier serverless.yml, sous le niveau provider: 

```yaml
provider:
...
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Scan
        - dynamodb:PutItem
        - dynamodb:GetItem
      Resource: "arn:aws:dynamodb:${opt:region, self:provider.region}:*:table/${self:provider.environment.DYNAMODB_TABLE}"
```

Vous autorisez ainsi vos lambdas à lister les élements de la table (avec l'action dynamodb:scan), à récupérer un élement (avec dynamodb:GetItem) et à insérer un élement (avec dynamodb:PutItem).

Maintenant que vous avez autorisé votre lambda à accéder à votre table, déployez et testez à nouveau, votre appel à scan devrait maintenant marcher.

### Etape 5 : Pour aller plus loin

Créez maintenant une lambda `post-movie.js` qui s'occupera de créer un film dans la table DynamoDB lors d'un appel HTTP POST sur l'url movie.

>Vous devrez déclarer votre nouvelle lambda dans le fichier serverless.yml

> Vous pouvez récupérer l'objet passé dans le corps de la requête post en utilisant la variable `event.body`, depuis l'objet event qui est passé en paramètre de votre lambda.
> Pensez à transformer cette valeur en objet JS avec JSON.parse(event.body).

/!\ Attention, il faudra bien mettre le code de put dans la base de données dans le fichier `movie-service.js`

> Si vous ne savez pas par quoi commencer ou si vous avez besoin d'aide, demandez à votre formateur !

#### Génération d'identifiant hash
Vous aurez certainement besoin de générer des identifiants pour vos nouvelles données. Pour cela vous pouvez utiliser la librairie uuid : 
```
npm install --save uuid
```
Et dans votre code javascript : 
```javascript
const uuid = require('uuid/v4');
const id = uuid(); // Votre identifiant
```

### Etape 6: Tests finaux

Essayez d'envoyer des reqûetes GET et POST avec postman pour créer et récupérer des films dans la base de données.

## Liens Utiles

* Documentation API DynamoDB : https://docs.aws.amazon.com/fr_fr/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html
* Liste des actions possibles sur AWS DynamoDB :  https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Operations_Amazon_DynamoDB.html
* Documentation serverless pour gestion des roles IAM : https://serverless.com/framework/docs/providers/aws/guide/iam/