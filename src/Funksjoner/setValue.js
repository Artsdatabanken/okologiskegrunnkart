function setValue(node, key, value) {
  const parts = key.split(".");
  for (let i = 0; i < parts.length - 1; i++) {
    node = node[parts[i]];
  }
  const vkey = parts[parts.length - 1];
  node[vkey] = value;
  return node;
}

export { setValue };
