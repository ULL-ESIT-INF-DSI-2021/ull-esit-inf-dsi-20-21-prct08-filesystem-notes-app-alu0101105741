import * as fs from 'fs';
import * as chalk from 'chalk';
import * as yargs from 'yargs';
import {Note} from './note';

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
  handler(argv) {
    if (typeof argv.title === 'string') {
      if (typeof argv.user === 'string') {
        if (typeof argv.body === 'string') {
          if (typeof argv.color === 'string') {
            // const title = argv.title.toLowerCase().replace(/[^A-Za-z0-9]+(.)/g, (LowLine, chr) => chr.toUpperCase());
            const path: string = './dist/' + argv.user;
            const notePath: string = path + '/' + argv.title + '.json';
            if (fs.existsSync(path)) {
              if (fs.existsSync(notePath)) {
                console.log(chalk.red('There is a note with the same title'));
              } else {
                fs.appendFileSync(notePath, new Note(argv.user, argv.title, argv.body, argv.color).write());
                console.log(chalk.green('The note was created succesfully'));
              }
            } else {
              fs.mkdirSync(path);
              fs.appendFileSync(notePath, new Note(argv.user, argv.title, argv.body, argv.color).write());
              console.log(chalk.green('The note was created succesfully'));
            }
          }
        }
      }
    }
  },
});

yargs.command({
  command: 'list',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Note user',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string') {
    }
  },
});

yargs.command({
  command: 'read',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Note user',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string') {
    }
  },
});

yargs.command({
  command: 'remove',
  describe: 'Add a new note',
  builder: {
    user: {
      describe: 'Note user',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if (typeof argv.title === 'string') {
    }
  },
});

yargs.parse();
