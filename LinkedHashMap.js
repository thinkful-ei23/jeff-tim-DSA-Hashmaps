const LinkedList = require('./LinkedList');

class HashMap {
  constructor(initialCapacity = 9) {
    this.length = 0;
    this._slots = [];
    this._capacity = initialCapacity;
    this._deleted = 0;
  }

  get(key) {
    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      throw new Error('Key error');
    }
    return this._slots[index].value;
  }

  set(key, value) {
    const loadRatio = (this.length + this._deleted + 1) / this._capacity;
    if (loadRatio > HashMap.MAX_LOAD_RATIO) {
      this._resize(this._capacity * HashMap.SIZE_RATIO);
    }

    const index = this._findSlot(key);
    if (this._slots[index] === undefined) {
      this._slots[index] = new LinkedList();
      this._slots[index].insertFirst({
        key,
        value,
        deleted: false
      });
      this.length++;
    } else {
      this._slots[index].insertLast({
        key,
        value,
        deleted: false
      });
      this.length++;
    }
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.remove(key);
    if (slot.head === null) {
      this.length--;
      this._deleted++;
    }
    // slot.deleted = true;
    // this.length--;
    // this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;
    return start;
    // for (let i = start; i < start + this._capacity; i++) {
    //     const index = i % this._capacity;
    //     const slot = this._slots[index];
    //     if (slot === undefined || (slot.key == key && !slot.deleted)) {
    //         return index;
    //     }
    // }
  }

  _resize(size) {
    const oldSlots = this._slots;
    this._capacity = size;
    // Reset the length - it will get rebuilt as you add the items back
    this.length = 0;
    this._deleted = 0;
    this._slots = [];

    for (const slot of oldSlots) {
      if (slot !== undefined && !slot.deleted) {
        let current = slot.head;
        while (current !== null) {
          this.set(current.value.key, current.value.value);
          current = current.next;
        }
      }
    }
  }

  static _hashString(string) {
    let hash = 5381;
    for (let i = 0; i < string.length; i++) {
      hash = (hash << 5) + hash + string.charCodeAt(i);
      hash = hash & hash;
    }
    return hash >>> 0;
  }
}

HashMap.MAX_LOAD_RATIO = 0.9;
HashMap.SIZE_RATIO = 3;

module.exports = HashMap;
