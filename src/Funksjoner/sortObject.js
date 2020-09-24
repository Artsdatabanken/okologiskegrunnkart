function sortKartlag(object) {
  // Convert object to array and sort based on title
  const array = Object.entries(object);
  const sortedArray = array.sort((a, b) => {
    const textA =
      a.length === 2 && a[1].tittel ? a[1].tittel.toLowerCase() : "";
    const textB =
      b.length === 2 && b[1].tittel ? b[1].tittel.toLowerCase() : "";
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  // Sort also underlag if exists (recursive function)
  const fullySortedArray = sortedArray.map(item => {
    if (item.length === 2 && item[1].underlag) {
      const itemObject = item[1];
      const sortedUnderlag = sortKartlag(itemObject.underlag);
      const newItemObject = { ...itemObject, underlag: sortedUnderlag };
      return [item[0], newItemObject];
    } else {
      return item;
    }
  });

  // Convert array to object
  const sortedObject = fullySortedArray.reduce((result, item) => {
    const key = String(item[0]); //first property: a, b, c
    result[" " + key] = item[1];
    return result;
  }, {});

  return sortedObject;
}

function sortUnderlag(object) {
  // Convert object to array and sort based on title
  const array = Object.entries(object);
  const sortedArray = array.sort((a, b) => {
    const textA = a.length === 2 && a[0] ? a[0].toLowerCase() : "";
    const textB = b.length === 2 && b[0] ? b[0].toLowerCase() : "";
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  // Convert array to object
  const sortedObject = sortedArray.reduce((result, item) => {
    const key = String(item[0]); //first property: a, b, c
    result[key] = item[1];
    return result;
  }, {});

  return sortedObject;
}

export { sortKartlag, sortUnderlag };
