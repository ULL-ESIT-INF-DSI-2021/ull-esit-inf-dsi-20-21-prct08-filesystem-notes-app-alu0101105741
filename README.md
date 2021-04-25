# Práctica 8 - Aplicación de procesamiento de notas de texto [![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101105741/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2021/ull-esit-inf-dsi-20-21-prct08-filesystem-notes-app-alu0101105741?branch=main)

__IMPORTANTE__: Para el correcto funcionamiento de la aplicación es necesario crear el directorio ./users en la raíz de trabajo, ya que hemos añadido dicha carpeta en el gitignore para que no se vean las notas creadas en la máquina local.

# 1. Introducción
En esta práctica llevaremos a cabo una aplicación de procesamiento de notas de texto, para ello utilizaremos varias herramientas como la [API síncrona de Node](https://nodejs.org/dist/latest-v15.x/docs/api/fs.html#fs_synchronous_api) que no ayudará a manejar con el sistema de ficheros para almacenar, editar, mostrar, leer o eliminar notas. Además sólo podremos interactuar con la aplicación desde la línea de comandos usando el paquete [yargs](https://www.npmjs.com/package/yargs) y se tendrá que mostrar las notas con su color correspondiente por la consola utilizando el paquete [chalk](https://www.npmjs.com/package/chalk), además tendremos que enviar mensajes informativos en verde y mensajes de error en rojo utilizando también dicho paquete.


# 2. Objetivos
Como hemos mencionado antes esta práctica tiene como objetivo realizar una aplicación de procesamiento de notas de texto que nos ayudará a familiarizarnos con la API síncrona de Node.js y los diferentes paquetes utilizados (yargs, chalk). Además tendremos que utilizar la herramienta de [GitHub Actions](https://docs.github.com/en/actions) para realizar flujos de trabajo que lleven a cabo las pruebas en diferentes entornos con diferentes versiones de Node.js, enviar los datos de cubrimiento a [Coveralls](https://coveralls.io/) y realizar un análisis de la calidad y seguridad de nuestro código fuente a través de [Sonar Cloud](https://sonarcloud.io/).

# 3. Realización de la práctica
La realización de esta práctica podemos separarla en 2 puntos claramente diferenciados:
1. Realización de la aplicación
2. Realización de los flujos de trabajo para GitHub Actions

## 3.1. Realización de la aplicación
Para realizar la aplicación lo primero que tenemos que saber son los requisitos que debe cumplir dicha aplicación, para ello leeremos la [descripción de la tarea](https://ull-esit-inf-dsi-2021.github.io/prct08-filesystem-notes-app/) en la cual nos cuenta con más detalle dichos requisitos, pero resumidamente estos son:
1. La aplicación nos permitirá que varios usuarios interactúen con ella, aunque no simultáneamente.
2. Una nota estará formada por un título, un cuerpo y un color (rojo, verde, azul o amarillo).
3. Cada usuario contará con su lista de notas en la cual podrá llevar a cabo estas operaciones:
3.1. Añadir una nota a la lista, mostrando un mensaje informativo si se realiza correctamente o un mensaje de error si existe una nota con el mismo título.
3.2. Modificar una nota, modificaremos el cuerpo de una nota mostrando un mensaje informativo si se realiza correctamente o un mensaje de error si no existe una nota con el título especificado
3.3. Eliminar una nota, mostrando un mensaje informativo si se realiza correctamente o un mensaje de error si no existe la nota especificada.
3.4. Listar los títulos de las notas, deberán mostrarse con el color correspondiente.
3.5. Leer una nota de la lista, deberá mostrarse el título y el cuerpo en su color correspondiente o un mensade de error si no existe la nota especificada.
3.6. Editar el cuerpo de una nota, mostrando un mensaje informativo si se realiza correctamente o un mensaje de error si no existe la nota especificada.
4. Un usuario solo puede interactuar con la aplicación de procesamiento de notas de texto a través de la línea de comandos. Los diferentes comandos, opciones de los mismos, así como manejadores asociados a cada uno de ellos deben gestionarse mediante el uso del paquete yargs.
Para ello guardaremos las notas de cada usuario en formato JSON en un directorio con su nombre dentro de un directorio general llamado "users", haremos los cambios persistentes haciendo uso de la API síncrona y mostraremos los diferentes colores con el paquete chalk.

### 3.1.1. Clase Note
Para realizar la aplicación hemos creado una clase Note en la que tendremos los datos de las notas y un método que pasa dichos datos a una string con formato JSON.

```typescript
/**
 * Class Note that helps us to manage the creation of the json file and the management of the data
 */
export class Note {
  protected user: string;
  protected title: string;
  protected body: string;
  protected color: string;

  /**
   * Constructor of Note class
   * @param {string} user Note user
   * @param {string} title Note title
   * @param {string} body Note body
   * @param {string} color Note color
   */
  constructor(user: string, title: string, body: string, color: string) {
    this.user = user;
    this.title = title;
    this.body = body;
    this.color = color;
  }

  /**
   * Write method that allow us to write a json of our class
   * @return {string} String in json format that allow us to convert it into a real json
   */
  write(): string {
    let json: string = '{\n';
    json = json + '"user": "' + this.user + '",\n';
    json = json + '"title": "' + this.title + '",\n';
    json = json + '"body": "' + this.body + '",\n';
    json = json + '"color": "' + this.color + '"\n';
    json = json + '}\n';
    return json;
  }
}

```

Como podemos ver en esta clase sólo cuenta con el constructor que inicializa los datos de la nota y una función write que nos facilita la creación de los JSON para almacenar las notas.

### 3.1.2. Note-app
Con nuestra clase Note hecha procederemos a realizar nuestra aplicación que nos ha quedado así:

```typescript
import * as fs from 'fs';
import * as chalk from 'chalk';
import * as yargs from 'yargs';
import {Note} from './note';

/**
 * Add command that allow us to add a note from a user
 * into his directory of notes
 */
yargs.command({
  command: 'add',
  describe: 'Add a new note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    user: {
      describe: 'Note user',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note body',
      demandOption: true,
      type: 'string',
    },
    color: {
      describe: 'Note color',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv: { title: string; user: string; body: string; color: string; }) {
    if (typeof argv.title === 'string') {
      if (typeof argv.user === 'string') {
        if (typeof argv.body === 'string') {
          if (typeof argv.color === 'string') {
            const filename = argv.title.toLowerCase().replace(/[^A-Za-z0-9]+(.)/g, (LowLine, chr) => chr.toUpperCase());
            const path: string = './users/' + argv.user;
            const notePath: string = path + '/' + filename + '.json';
            if (fs.existsSync(path)) {
              if (fs.existsSync(notePath)) {
                console.log(chalk.red('Note title taken!'));
              } else {
                fs.appendFileSync(notePath, new Note(argv.user, argv.title, argv.body, argv.color).write());
                console.log(chalk.green('New note added!'));
              }
            } else {
              fs.mkdirSync(path);
              fs.appendFileSync(notePath, new Note(argv.user, argv.title, argv.body, argv.color).write());
              console.log(chalk.green('New note added!'));
            }
          }
        }
      }
    }
  },
});

/**
 * List command that allow us to list
 * all the notes from a specified user
 */
yargs.command({
  command: 'list',
  describe: 'List all the notes from a specific user',
  builder: {
    user: {
      describe: 'Note user',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv: { user: string; }) {
    if (typeof argv.user === 'string') {
      const path: string = './users/' + argv.user;

      if (fs.existsSync(path)) {
        console.log('Your notes');
        const pointer = fs.readdirSync(path);
        pointer.forEach((filename) => {
          const notePath: string = path + '/' + filename;
          const data = JSON.parse(fs.readFileSync(notePath, 'utf8'));
          const noteColour = data.color;
          switch (noteColour) {
            case 'red': {
              console.log(chalk.red.inverse(data.title));
              break;
            }
            case 'green': {
              console.log(chalk.green.inverse(data.title));
              break;
            }
            case 'blue': {
              console.log(chalk.blue.inverse(data.title));
              break;
            }
            case 'yellow': {
              console.log(chalk.yellow.inverse(data.title));
              break;
            }
          }
        });
      } else {
        console.log(chalk.red('The user dont have any notes in this system'));
      }
    }
  },
});

/**
 * Read command that allow us to read
 * a specified note from a user
 */
yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    user: {
      describe: 'Note user',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      if (typeof argv.title === 'string') {
        const path: string = './users/' + argv.user;
        const title = argv.title.toLowerCase().replace(/[^A-Za-z0-9]+(.)/g, (LowLine, chr) => chr.toUpperCase());
        const notePath: string = path + '/' + title + '.json';

        if (fs.existsSync(notePath)) {
          const data = JSON.parse(fs.readFileSync(notePath, 'utf8'));
          const noteColour = data.color;
          switch (noteColour) {
            case 'red': {
              console.log(chalk.red.inverse(data.title));
              console.log(chalk.red.inverse(data.body));
              break;
            }
            case 'green': {
              console.log(chalk.green.inverse(data.title));
              console.log(chalk.green.inverse(data.body));
              break;
            }
            case 'blue': {
              console.log(chalk.blue.inverse(data.title));
              console.log(chalk.blue.inverse(data.body));
              break;
            }
            case 'yellow': {
              console.log(chalk.yellow.inverse(data.title));
              console.log(chalk.yellow.inverse(data.body));
              break;
            }
          }
        } else {
          console.log(chalk.red('Note not found'));
        }
      }
    }
  },
});

/**
 * Remove command that allow us
 * to remove a specified note from a user
 */
yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    user: {
      describe: 'Note user',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      if (typeof argv.title === 'string') {
        const path: string = './users/' + argv.user;
        const title = argv.title.toLowerCase().replace(/[^A-Za-z0-9]+(.)/g, (LowLine, chr) => chr.toUpperCase());
        const notePath: string = path + '/' + title + '.json';

        if (fs.existsSync(notePath)) {
          fs.rmdirSync(notePath, {
            recursive: true,
          });
          console.log(chalk.green('Note removed!'));
        } else {
          console.log(chalk.red('No note found'));
        }
      }
    }
  },
});

/**
 * Edit command that allow us to
 * edit the body of a existing note
 */
yargs.command({
  command: 'edit',
  describe: 'Edit a note',
  builder: {
    user: {
      describe: 'Note user',
      demandOption: true,
      type: 'string',
    },
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
    body: {
      describe: 'Note title',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.user === 'string') {
      if (typeof argv.title === 'string') {
        if (typeof argv.body === 'string') {
          const path: string = './users/' + argv.user;
          const title = argv.title.toLowerCase().replace(/[^A-Za-z0-9]+(.)/g, (LowLine, chr) => chr.toUpperCase());
          const notePath: string = path + '/' + title + '.json';

          if (fs.existsSync(notePath)) {
            const data = JSON.parse(fs.readFileSync(notePath, 'utf8'));
            fs.writeFileSync(notePath, new Note(argv.user, argv.title, argv.body, data.color).write());
            console.log(chalk.green('Note edited!'));
          } else {
            console.log(chalk.red('Note not found'));
          }
        }
      }
    }
  },
});

/**
 * Parse function that allow the
 * program works correctly from
 * the command line
 */
yargs.parse();

```

En este caso podemos ver como hemos creado cada comando necesario para la aplicación con la función yargs.command(), en la que especificamos el nombre del comando, los diferentes parámetros con los que cuenta dicho comando y por último el funcionamiento de dicho comando.

### 3.2. Flujos de trabajo
Por último realizaremos los flujos de trabajo correspondientes para que con cada push se realicen las pruebas del código, se envien los datos de cubrimiento a Coveralls y se realice un análisis de calidad y seguridad de nuestro código fuente a través de Sonar Cloud, para ello crearemos 3 ficheros dentro del directorio .github/workflows llamados ```build.yml, coverage.yml y tests.yml```, en estos ficheros encontraremos los iguiente:

1. build.yml
```yml
name: Build
on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  sonarcloud:
    name: SonarCloud
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0  # Shallow clones should be disabled for a better relevancy of analysis
      - name: SonarCloud Scan
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}  # Needed to get PR information, if any
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

```

2. coverage.yml
```yml
name: Coverage
on: [push]
jobs:
  Explore-GitHub-Actions:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js
        uses: actions/setup-node@v1
        with:
          node-version: '15.9.0'
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
      - run: npm run coverage

```

3. test.yml
```yml
name: Tests
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [10.x, 12.x, 14.x, 15.x]

    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v1
      with:
        node-version: ${{ matrix.node-version }}
    - run: npm ci
    - run: npm run build --if-present
    - run: npm test

```

Como podemos ver, en el primer fichero contiene el archivo que nos facilita Sonar Cloud, para que esto funcione, también tendremos que crear el fichero ```sonar-project.properties``` el cuál también nos lo facilita Sonar Cloud y lo guardaremos en la raíz del proyecto, con esto tendremos nuestro repo listo para que Sonar Cloud pueda analizar nuestro código. En el siguiente fichero podemos ver como le decimos que use un entorno en ubuntu y haciendo uso de Node.js, le especificamos la versión de node que queremos que se use y le decimos que se instalen las dependencias necesarias para despues realizar nuestro script de npm test y coverage para subir los datos de cubrimiento a Coveralls (hemos tenido que hacer el repo público para que no exista ningún problema con esto y poder añadir el repo en coveralls). Por último en el último fichero vemos como a parte de decirle que queremos que nuestro espacio de trabajo sea en ubuntu definimos una matriz con las versiones de node que queremos que ejecuten los diferentes test, con esto hecho haremos lo mismo que en el fichero anterior pero diciendo que queremos que use las versiones de Node.js especificadas en dicha matriz para luego ejecutar nuestros test.

# 4. Conclusiones
Esta ha sido una práctica muy entretenida y que me ha ayudado a familiarizarme bastante con la API síncrona de Node.js y tambíen a otros paquetes como son chalk o yargs. Además me ha servido para aprender a utilizar la función de GitHub Actions y comprender como automatizar las tareas para que en cada push se ejecuten los pasos que queramos, también me ha ayudado para familiarizarme un poco más con las plataformas Coveralls y Sonar Cloud y así poder entender un poco mejor su funcionamiento. Por último, he de destacar que no he generado test para el programa principal ya que como se ejecuta por la línea de comandos no tenía muy claro como generarlos para comprobar que funcione todo correctamente, aun así, he probado todos los comandos a manos especificando diversas cosas manualmente para ver que el programa funcionaba correctamente, avisando de errores cuando se pedían notas inexistentes u otras variables.

__IMPORTANTE__: Para el correcto funcionamiento de la aplicación es necesario crear el directorio ./users en la raíz de trabajo, ya que hemos añadido dicha carpeta en el gitignore para que no se vean las notas creadas en la máquina local.
