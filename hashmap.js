class HashMap {
  constructor(initialCapacity = 8) {
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
    this._slots[index] = {
      key,
      value,
      deleted: false
    };
    this.length++;
  }

  remove(key) {
    const index = this._findSlot(key);
    const slot = this._slots[index];
    if (slot === undefined) {
      throw new Error('Key error');
    }
    slot.deleted = true;
    this.length--;
    this._deleted++;
  }

  _findSlot(key) {
    const hash = HashMap._hashString(key);
    const start = hash % this._capacity;

    for (let i = start; i < start + this._capacity; i++) {
      const index = i % this._capacity;
      const slot = this._slots[index];
      if (slot === undefined || (slot.key == key && !slot.deleted)) {
        return index;
      }
    }
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
        this.set(slot.key, slot.value);
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

// {Hobbit:"Bilbo"}, {Hobbit:"Frodo"}, {Wizard:"Gandolf"}, {Human:"Aragon"}, {Elf: "Legolas"}, {Maiar:"The Necromancer"}, {Maiar: "Sauron"}, {RingBearer: "Gollum"}, {LadyOfLight: "Galadriel"}, {HalfElven: "Arwen"}, {Ent: "Treebeard"}

// function main() {
//   const lor = new HashMap();

//   lor.set('Hobbit', 'Bilbo');
//   lor.set('Hobbit', 'Frodo');
//   lor.set('Wizard', 'Gandolf');
//   lor.set('Maiar', 'The Necromancer');
//   lor.set('Maiar', 'Sauron');
//   lor.set('RingBearer', 'Gollum');
//   lor.set('LadyOfLight', 'Galadriel');
//   lor.set('HalfElven', 'Arwen');
//   lor.set('Ent', 'Treebeard');

//   console.log(lor.get('Maiar'));
// }

// main();

//given "acecarr" - return true (because acecarr can be rearranged to racecar which is a palindrome)
//given north - returns false, because no rearrangement is a palindrome

function palindrome(string) {
  //   str = str.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
  //   //string
  //   const hashmap = new HashMap();
  //   // loop though string array
  //   for (let i = 0; i < str.length; i++) {
  //     if (hashmap.get(str[i] === null)) {
  //       hashmap.set(str[i], 1);
  //     } else {
  //       let count = hashmap.get(str[i]);
  //       count++;
  //       console('count', count);
  //       hashmap.set(str[i], count);
  //     }
  //   }
  //   console.log(hashmap)

  //to check if a string is a palindrome
  //count number of characters in string
  //for all letters there needs to an even amount of letters
  // eg for racecar - 2 as, 2rs, 2c,s one 3
  let newhash = new HashMap();
  let odd = 0;
  for (let i = 0; i < string.length; i++) {
    try {
      let charCount = newhash.get(string[i]);
      charCount++;
      if (charCount % 2 === 0) {
        odd--;
      } else {
        odd++;
      }
      newhash.set(string[i], charCount);
    } catch {
      newhash.set(string[i], 1);
      odd++;
    }
  }
  if (
    (string.length % 2 === 0 && odd === 0) ||
    (string.length % 2 === 1 && odd === 1)
  ) {
    return true;
  } else {
    return false;
  }
}
console.log(palindrome('dad'));
