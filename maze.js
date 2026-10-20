// Core vector-space logic for Emoji Maze, ported 1:1 from game.py.
// Pure functions operate on a flat Float32Array of shape [count, dims].

const NEIGHBOR_COUNT = 5;
const INVENTORY_KEYS = "qwertyuiopasdfghjklzxcvbnm";

function getVector(vectors, dims, index) {
  return vectors.subarray(index * dims, index * dims + dims);
}

function addInto(target, src) {
  for (let i = 0; i < target.length; i++) target[i] += src[i];
}

function distance(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum);
}

function nearestNeighborsFromVector(vectors, dims, count, positionVector, excluded, k = NEIGHBOR_COUNT) {
  const excludedSet = new Set(excluded || []);
  const distances = new Array(count);
  for (let i = 0; i < count; i++) {
    distances[i] = excludedSet.has(i) ? Infinity : distance(getVector(vectors, dims, i), positionVector);
  }
  const indices = Array.from({ length: count }, (_, i) => i);
  indices.sort((a, b) => distances[a] - distances[b]);
  return indices.slice(0, k);
}

function sumVectors(vectors, dims, indices) {
  const result = new Float32Array(dims);
  for (const index of indices) addInto(result, getVector(vectors, dims, index));
  return result;
}

function addToInventory(inventory, emojiIndex) {
  if (inventory.includes(emojiIndex) || inventory.length >= INVENTORY_KEYS.length) return false;
  inventory.push(emojiIndex);
  return true;
}

function removeFromInventory(inventory, key) {
  const position = INVENTORY_KEYS.indexOf(key);
  if (position === -1 || position >= inventory.length) return false;
  inventory.splice(position, 1);
  return true;
}

function selectedIndicesForCommand(choices, inventory, command) {
  const selected = [];
  for (const symbol of command) {
    if ("12345".includes(symbol)) {
      selected.push(choices[Number(symbol) - 1]);
    } else {
      const position = INVENTORY_KEYS.indexOf(symbol);
      if (position !== -1 && position < inventory.length) {
        selected.push(inventory[position]);
      } else {
        return [];
      }
    }
  }
  return selected;
}

function vectorForCommand(vectors, dims, choices, inventory, command) {
  const selected = selectedIndicesForCommand(choices, inventory, command);
  if (selected.length === 0) return null;
  return sumVectors(vectors, dims, selected);
}

function describePosition(items, position) {
  const emojis = position.map((i) => items[i].emoji).join(" + ");
  const names = position.map((i) => items[i].name).join(" + ");
  return `${emojis}  ${names}`;
}

function goalReached(vectors, dims, count, positionVector, goalIndex) {
  return nearestNeighborsFromVector(vectors, dims, count, positionVector, [], 1)[0] === goalIndex;
}

function randomDestination(count, currentIndex) {
  let index;
  do {
    index = Math.floor(Math.random() * count);
  } while (index === currentIndex);
  return index;
}

if (typeof module !== "undefined") {
  module.exports = {
    NEIGHBOR_COUNT,
    INVENTORY_KEYS,
    getVector,
    distance,
    nearestNeighborsFromVector,
    sumVectors,
    addToInventory,
    removeFromInventory,
    selectedIndicesForCommand,
    vectorForCommand,
    describePosition,
    goalReached,
    randomDestination,
  };
}
if (typeof window !== "undefined") {
  window.MazeLib = {
    NEIGHBOR_COUNT,
    INVENTORY_KEYS,
    getVector,
    distance,
    nearestNeighborsFromVector,
    sumVectors,
    addToInventory,
    removeFromInventory,
    selectedIndicesForCommand,
    vectorForCommand,
    describePosition,
    goalReached,
    randomDestination,
  };
}

function base64ToFloat32Array(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Float32Array(bytes.buffer);
}

if (typeof window !== "undefined") {
  window.MazeLib.base64ToFloat32Array = base64ToFloat32Array;
}
if (typeof module !== "undefined") {
  module.exports.base64ToFloat32Array = base64ToFloat32Array;
}
