function sortObject(object) {
  const array = Object.entries(object);
  console.log(object);
  console.log(array);

  const sortedArray = array.sort((a, b) => {
    const textA =
      a.length === 2 && a[1].tittel ? a[1].tittel.toLowerCase() : "";
    const textB =
      b.length === 2 && b[1].tittel ? b[1].tittel.toLowerCase() : "";
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });
  console.log(sortedArray);

  const sortedObject = sortedArray.reduce((result, item) => {
    const key = String(item[0]); //first property: a, b, c
    result["key_" + key] = item[1];
    return result;
  }, {});
  console.log("Is this one?");
  console.log(sortedObject);

  return sortedObject;
}

export { sortObject };
