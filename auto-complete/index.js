function createAutoComplete(data) {
  class Trie {
    constructor(strings) {
      this.Node = class {
        constructor(value) {
          this.value = value
          this.children = new Map()
        }
      }
      this.root = new this.Node()
      this._insertStringArray(strings)
    }

    _trace(str, node = this.root) {
      if (!node) return
      return this._trace(str.slice(1), str[0] && node.children.get(str[0]) || null) ||
        { node, remainingString: str }
    }

    _find(str, node = this.root, finalnodes = []) {
      if (str==='') {
        finalnodes.push(node)
        return
      }
      if (!node) return
      node.children.get(str[0].toUpperCase()) &&
        this._find(str.slice(1), node.children.get(str[0].toUpperCase()), finalnodes)
      node.children.get(str[0].toLowerCase()) &&
        this._find(str.slice(1), node.children.get(str[0].toLowerCase()), finalnodes)
      return finalnodes;
    }

    _insertString(str) {
      let { node, remainingString } = this._trace(str);
      for (let char of remainingString) {
        const nextNode = new this.Node();
        node.children.set(char, nextNode);
        node = nextNode;
      }
      if (node.children.get('word')) node.children.get('word').value.count++
      else node.children.set('word', new this.Node({ word: str, count: 1}))
    }

    _insertStringArray(stringArray) {
      stringArray.forEach(this._insertString.bind(this))
    }

    autocomplete(str) {
      if (typeof str !== 'string' || !str) return []
      const nodes = this._find(str);

      const matches = [];

      for (let i = 0; i < nodes.length; i++) {
        const stack = [nodes[i]];
        while (stack.length) {
          const currentNode = stack.pop();

          if (currentNode.value) matches.push(...new Array(currentNode.value.count).fill(currentNode.value.word))

          const childNodes = currentNode.children.values()
          stack.push(...childNodes)
        }
      }
      matches.reverse();
      return matches;
    }
  }
  const tree = new Trie(data)

  return tree.autocomplete.bind(tree)
}

module.exports = {createAutoComplete};
