function initialKartlagSort(object) {
  // ----------------- NOTE ------------------- //
  // This method CAN BE RUN ONLY ONCE first time kartlag file is uploaded.
  // Since <kartlag key> is an integer, sorting does not work.
  // This method converts the key from integer to
  // string by adding space <<" " + key>>.
  // Therefore, if this method is run more than once, the key
  // will be changed and most of the functionality will be broken.

  // Convert object to array and sort based on title
  const array = Object.entries(object);
  let sortedArray;
  sortedArray = array.sort((a, b) => {
    const textA =
      a.length === 2 && a[1].tittel ? a[1].tittel.toLowerCase() : "";
    const textB =
      b.length === 2 && b[1].tittel ? b[1].tittel.toLowerCase() : "";
    return textA < textB ? -1 : textA > textB ? 1 : 0;
  });

  // Convert array to object
  const sortedObject = sortedArray.reduce((result, item) => {
    if (parseInt(item[0]) >= 0) {
      // If property is an integer (as string),
      // you need to add " " to maintain order
      const key = String(item[0]);
      result[" " + key] = item[1];
      return result;
    } else {
      // If is a string, order is maintained
      const key = String(item[0]);
      result[key] = item[1];
      return result;
    }
  }, {});

  return sortedObject;
}

function sortKartlag(object, mode = "alphabetical") {
  // Convert object to array and sort based on title
  const array = Object.entries(object);
  let sortedArray;
  if (mode === "position") {
    sortedArray = array.sort((a, b) => {
      return a[1].position - b[1].position;
    });
  } else {
    sortedArray = array.sort((a, b) => {
      const textA =
        a.length === 2 && a[1].tittel ? a[1].tittel.toLowerCase() : "";
      const textB =
        b.length === 2 && b[1].tittel ? b[1].tittel.toLowerCase() : "";
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  }

  // Sort also underlag if exists (recursive function)
  const fullySortedArray = sortedArray.map(item => {
    if (item.length === 2 && item[1].underlag) {
      const itemObject = item[1];
      let position = true;
      let sortedUnderlag;
      for (const sublayerKey in itemObject.underlag) {
        const sublayer = itemObject.underlag[sublayerKey];
        if (!sublayer.position || sublayer.position < 0) {
          position = false;
          break;
        }
      }
      // Use positionn or alphabetical sorting
      if (position) {
        sortedUnderlag = sortKartlag(itemObject.underlag, "position");
      } else {
        sortedUnderlag = sortKartlag(itemObject.underlag);
      }
      const newItemObject = { ...itemObject, underlag: sortedUnderlag };
      return [item[0], newItemObject];
    } else {
      return item;
    }
  });

  // Convert array to object
  const sortedObject = fullySortedArray.reduce((result, item) => {
    const key = String(item[0]);
    result[key] = item[1];
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

function kartlagByEnvironment(kartlag, env) {
  let allLayers = {};
  for (const lagKey in kartlag) {
    let lag = kartlag[lagKey];
    for (const sublagKey in lag.underlag) {
      const sublag = lag.underlag[sublagKey];
      if ((env === "test" || env === "local") && !sublag.publisertest) {
        delete lag.underlag[sublagKey];
      }
      if (env === "prod" && !sublag.publiserprod) {
        delete lag.underlag[sublagKey];
      }
    }
    const keys = Object.keys(lag.underlag);
    if (keys && keys.length > 0) {
      allLayers[lagKey] = lag;
    }
  }
  return allLayers;
}

export { initialKartlagSort, sortKartlag, sortUnderlag, kartlagByEnvironment };
