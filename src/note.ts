/**
 * asd
 */
export class Note {
  protected user: string;
  protected title: string;
  protected body: string;
  protected color: string;

  /**
   * asd
   * @param {string} user asd
   * @param {string} title asd
   * @param {string} body asd
   * @param {string} color asd
   */
  constructor(user: string, title: string, body: string, color: string) {
    this.user = user;
    this.title = title;
    this.body = body;
    this.color = color;
  }

  /**
   * asd
   * @return {string} asd
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
