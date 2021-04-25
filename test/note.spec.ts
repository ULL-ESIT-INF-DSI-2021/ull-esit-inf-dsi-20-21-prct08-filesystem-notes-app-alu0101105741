import 'mocha';
import {expect} from 'chai';

import {Note} from '../src/note';

describe('Test block on notes', () => {
  const note1: Note = new Note('Eric', 'Blue note', 'This is a blue note', 'blue');

  it('Note constructor', () => {
    expect(new Note('Eric', 'Blue Note', 'This is a blue note', 'blue'));
  });

  it('Note write', () => {
    expect(note1.write()).to.be.equal('\{\n"user": "Eric",\n"title": "Blue note",\n"body": "This is a blue note",\n"color": "blue"\n}\n');
  });
});
