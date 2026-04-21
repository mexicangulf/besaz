export function insertSortedObject<T>(sortedArray: T[], f: (obj: T) => number, newObject: T) {

  // If the array is empty, simply add the new object
  if (sortedArray.length == 0) {
    sortedArray.push(newObject);
    return sortedArray;
  }

  // Use binary search to find the insertion index
  let low = 0;
  let high = sortedArray.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (f(sortedArray[mid]) < f(newObject)) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  // Insert the new object at the found index
  sortedArray.splice(low, 0, newObject);
  return sortedArray;

}