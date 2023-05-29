import { notEmpty } from 'src/utils/netEmpty';
import { buildCodePre } from 'src/utils/buildCodePre';
import { marked, Renderer } from 'marked';

export class MdParser {
  public readonly menu: { id: string; level: number; text: string }[];
  public readonly html;
  constructor(md: string) {
    const renderer = new Renderer();
    const pos = Array(6).fill(null);
    this.menu = [];
    renderer.code = buildCodePre;
    renderer.heading = (text, level) => {
      pos[level]++;
      pos.fill(null, level + 1);
      const id = 'sec-' + pos.filter(notEmpty).join('-');
      this.menu.push({ id, level, text });
      return `<h${level} id="${id}">${text}</h${level}>`;
    };
    this.html = marked(md, { renderer });
  }
}
