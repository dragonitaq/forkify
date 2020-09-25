import uniqid from "uniqid";

export default class {
  constructor() {
    this.items = [];
  }
  addItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient,
    };
    this.items.push(item);
    return item;
  }
  deleteItem(id) {
    const index = this.items.findIndex((item) => item.id === id); //Even we know what id to look for, we can't use indexOf because what we are looking for is at deeper level, thus we need callback function to do it.
    // [2,4,8] splice(1,2) -> return [4,8], original array is [2]
    // [2,4,8] slice(1,2) -> return 4, original array is [2,4,8]
    this.items.splice(index, 1);
  }
  updateCount(id, newCount) {
    this.items.find((item) => item.id === id).count = newCount;
  }
}
