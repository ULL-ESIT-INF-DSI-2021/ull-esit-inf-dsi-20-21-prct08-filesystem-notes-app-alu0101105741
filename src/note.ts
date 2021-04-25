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
