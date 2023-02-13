const binarySearch = (
  value: number,
  array: number[],
  index: number = 0,
  length: number = array.length
): [number, number] => {
  if (length === 0) throw new Error('length must not zero');
  if (length === 1) return [index, value - array[index]];
  const hl = (length / 2) | 0;
  const mv = array[index + hl];
  if (value === mv) return [index + hl, 0];
  if (value < mv) return binarySearch(value, array, index, length - hl);
  if (value > mv) return binarySearch(value, array, index + hl, length - hl);
  throw new Error('never');
};

export class TextFragmentFinder {
  public readonly textFragment;
  public readonly positionList;
  public readonly nodeList;

  constructor(root: Node) {
    const sb: string[] = [];
    this.positionList = [] as number[];
    this.nodeList = [] as Node[];
    // Locate all Text nodes within root.
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n, p = 0; (n = tw.nextNode()); ) {
      const { nodeValue } = n;
      if (!nodeValue) continue;
      this.positionList.push(p);
      this.nodeList.push(n);
      p += nodeValue.length;
      sb.push(nodeValue);
    }
    this.textFragment = sb.join('');
  }

  private createRangeByPosition(start: number, end: number) {
    const { positionList, nodeList } = this;
    // Locate the index and offset from the positionList.
    // For example, attempting to search 35 from [ 10, 20, 30, 40, 50 ] will result { index: 2, offset: 5 }.
    const [sIndex, sOffset] = binarySearch(start, positionList);
    const [eIndex, eOffset] = binarySearch(end, positionList);
    const range = document.createRange();
    range.setStart(nodeList[sIndex], sOffset);
    range.setEnd(nodeList[eIndex], eOffset);
    return range;
  }

  private findByString(str: string) {
    const { textFragment } = this;
    const index = textFragment.indexOf(str);
    if (index < 0) return null;
    return [index, index + str.length] as const;
  }

  private findByRegExp(pattern: RegExp) {
    const { textFragment } = this;
    // NOTE: The lastIndex of the pattern object will be changed (RegExp object is stateful).
    const matched = pattern.exec(textFragment);
    if (!matched) return null;
    return [matched.index, matched.index + matched[0].length] as const;
  }

  public find(what: string | RegExp) {
    let position;
    // Locate text position by string or RegExp.
    if (typeof what === 'string') position = this.findByString(what);
    else if (what instanceof RegExp) position = this.findByRegExp(what);
    // If nothing is found, return null.
    if (!position) return null;
    // Create a DOM Range object by string position.
    return this.createRangeByPosition(...position);
  }
}
