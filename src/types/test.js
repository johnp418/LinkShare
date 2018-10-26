const a = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("One done");
      resolve();
    }, 5000);
  });
};

const b = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      console.log("b done");
      resolve();
    }, 4000);
  });
};

async function test() {
  console.log("Start ");
  // promises.map(p => p());
  // Promise.all(promises).then(resolved => {});
  const aRes = a();
  const bRes = b();
  // await aRes;
  // await bRes;
  
  const pr = [];
  for (let i = 0; i < promises.length; i++) {
    pr.push(await )
  }
}

async function test1() {
  const aRes = await a();
  const bRes = await b();
}

// Promise.all([aRes, bRes]).then(() => {
//   console.log("Heelo");
// });

// function test() {
//   const a = new Promise(resolve => {
//     resolve(1);
//   }).then(data => {
//     console.log("Data ", data);
//     return data;
//   });
//   console.log("A ", a);
// }

async function hello() {
  const a = await new Promise((res, rej) => {
    setTimeout(() => {
      res("!");
    }, 1000);
  });

  console.log("What is a ", a + 1);
  return a;
}

test().then(v => {
  console.log("test done");
});
// const bb = hello();
// console.log("GG ", bb);
// b();
// b();
