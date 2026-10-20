// Self-test for maze.js. Open test.html in a browser and read the console,
// or run `node web/maze.test.js` if Node is available. No framework needed.

const fns = typeof require !== "undefined" ? require("./maze.js") : window.MazeLib;
const {
  nearestNeighborsFromVector,
  sumVectors,
  addToInventory,
  removeFromInventory,
  selectedIndicesForCommand,
  vectorForCommand,
  describePosition,
  goalReached,
  randomDestination,
} = fns;
let passed = 0;
let failed = 0;

function assertEqual(actual, expected, label) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    passed++;
    console.log(`PASS: ${label}`);
  } else {
    failed++;
    console.log(`FAIL: ${label} -- got ${a}, expected ${e}`);
  }
}

function vec(values) {
  return new Float32Array(values);
}

function flat(rows) {
  const dims = rows[0].length;
  const out = new Float32Array(rows.length * dims);
  rows.forEach((row, i) => out.set(row, i * dims));
  return { data: out, dims };
}

// test_returns_five_nearest_nodes_by_euclidean_distance
{
  const { data, dims } = flat([[0], [1], [2], [3], [4], [5], [10]]);
  assertEqual(
    nearestNeighborsFromVector(data, dims, 7, vec([0]), [], 5),
    [0, 1, 2, 3, 4],
    "nearest 5 by distance"
  );
}

// test_used_emoji_are_excluded_while_five_other_neighbors_remain
{
  const { data, dims } = flat(Array.from({ length: 8 }, (_, i) => [i]));
  assertEqual(
    nearestNeighborsFromVector(data, dims, 8, vec([3]), [2, 3], 5),
    [4, 1, 5, 0, 6],
    "excluded emoji removed from neighbor list"
  );
}

// test_combines_current_vector_with_inventory_vectors
{
  const { data, dims } = flat([[1, 2], [3, 4], [5, 6]]);
  assertEqual(Array.from(sumVectors(data, dims, [0, 1, 2])), [9, 12], "sum of three vectors");
}

// inventory add/remove
{
  const inventory = [];
  assertEqual(addToInventory(inventory, 7), true, "add first item");
  assertEqual(addToInventory(inventory, 9), true, "add second item");
  assertEqual(inventory, [7, 9], "inventory order preserved");
  assertEqual(addToInventory(inventory, 7), false, "no duplicate add");
  assertEqual(removeFromInventory(inventory, "w"), true, "remove by key w");
  assertEqual(inventory, [7], "inventory after removal");
}

// selectedIndicesForCommand: digits + inventory letters
{
  const choices = [10, 20, 30, 40, 50];
  const inventory = [60, 70];
  assertEqual(
    selectedIndicesForCommand(choices, inventory, "25qw"),
    [20, 50, 60, 70],
    "digits and letters both selected"
  );
  assertEqual(selectedIndicesForCommand(choices, inventory, ""), [], "empty command selects nothing");
}

// vectorForCommand: sum of exact selected items
{
  const { data, dims } = flat([[1], [3], [4], [7]]);
  const choices = [1, 2];
  const inventory = [3];
  assertEqual(Array.from(vectorForCommand(data, dims, choices, inventory, "12q")), [14], "command vector sum");
  assertEqual(Array.from(vectorForCommand(data, dims, [0, 1], [2], "q")), [4], "single inventory item vector");
}

// describePosition
{
  const items = [{ emoji: "A", name: "a" }, { emoji: "B", name: "b" }];
  assertEqual(describePosition(items, [0, 1]), "A + B  a + b", "position description combines items");
}

// goalReached
{
  const { data, dims } = flat([[0], [5], [10]]);
  assertEqual(goalReached(data, dims, 3, vec([5.1]), 1), true, "goal reached when nearest");
  assertEqual(goalReached(data, dims, 3, vec([5.1]), 2), false, "goal not reached when not nearest");
}

// randomDestination never returns current index
{
  let ok = true;
  for (let i = 0; i < 200; i++) {
    if (randomDestination(5, 2) === 2) ok = false;
  }
  assertEqual(ok, true, "random destination never equals current (200 draws)");
}

console.log(`\n${passed} passed, ${failed} failed`);
if (typeof module !== "undefined") module.exports = { passed, failed };