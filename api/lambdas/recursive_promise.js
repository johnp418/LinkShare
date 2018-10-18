const R = require("ramda");
const a = Array.from({ length: 20 }, (v, k) => k + 1);

console.log("A ", a);
const sln = 5;

const recurse = q => {
  console.log("Current Queries ", q);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  }).then(() => {
    console.log("Batch done ");
    const nq = q.slice(sln);
    if (nq.length === 0) {
      return Promise.resolve("FIN");
    }
    return recurse(q.slice(sln));
  });
};

recurse(a).then(res => {
  console.log("Finish ? ", res);
});
