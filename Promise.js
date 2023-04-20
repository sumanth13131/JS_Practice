// Sample API Call
function getData(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(url + " :: Data"), 2000);
  });
}

// channing
getData("tempURL")
  .then((data) => console.log(data))
  .catch((err) => console.log(err));

// async Wait
async function fun() {
  let apiData = await getData("tempURL");
  console.log(apiData);
}
fun();

// Resolve all
let apis = Promise.all([getData("temp1"), getData("temp2")]);
apis.then((apiData) => {
  apiData.forEach((data) => {
    console.log(data);
  });
});

// Promisfy
function arraySum(array, cb) {
  var sum = array.reduce((p, c) => p + c);
  cb(sum);
}

function promisfy(array) {
  return new Promise((resolve, reject) => {
    arraySum(array, (sum) => resolve(sum));
  });
}

array = [1, 2, 3];

promisfy(array).then((data) => console.log(data));
