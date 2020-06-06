/**
 *
 * @param {*} itemA
 * @param {*} itemB
 * @returns {number} 1 if itemA.index is greater than itemB.index,
 * otherwise returns -1
 */
export function indexSorting(itemA, itemB) {
  if (Number(itemA.index) > Number(itemB.index)) {
    return 1;
  }
  return -1;
}

/**
 *
 * @param {*} itemA
 * @param {*} itemB
 * @returns {number} 1 if itemA.id is greater than itemB.id,
 * otherwise returns -1
 */
export function idSorting(itemA, itemB) {
  if (Number(itemA.id) > Number(itemB.id)) {
    return 1;
  }
  return -1;
}

/**
 *
 * @param {*} indexSortedList
 * @param {*} collection
 */
export function updateCollectionIdexesFromList(indexSortedList, collection) {
  for (const [index, itemId] of indexSortedList.entries()) {
    collection[itemId] = {
      ...collection[itemId],
      ...{ index: index.toString() },
    };
  }
}

/**
 *
 * @param {*} columnId
 * @param {*} tasks
 */
export function getColumnTasks(columnId, tasks) {
  return Object.values(tasks).filter(
    (task) => task.columnId.toString() === columnId.toString()
  );
}

/**
 *
 * @param {*} columnId
 * @param {*} tasks
 */
export function getColumnTaskIds(columnId, tasks) {
  return getColumnTasks(columnId, tasks)
    .sort(indexSorting)
    .map((task) => task.id);
}

/**
 *
 * @param {*} columns
 */
export function getColumnIds(columns) {
  return Object.values(columns)
    .sort(indexSorting)
    .map((column) => column.id);
}

/**
 *
 * @param {*} tasks
 */
export function getTaskIds(tasks) {
  return Object.values(tasks)
    .sort(idSorting)
    .map((task) => task.id);
}

/**
 *
 * @param {*} rootObject
 * @param {*} collectionName
 * @param {*} sorting
 */
export function getCollectionIds(state, collectionName, sorting) {
  return Object.values(state[collectionName])
    .sort(sorting === "index" ? indexSorting : idSorting)
    .map((collectionItem) => collectionItem.id);
}

export default {
  indexSorting,
  idSorting,
  updateCollectionIdexesFromList,
  getColumnTasks,
  getColumnTaskIds,
  getColumnIds,
  getTaskIds,
};
