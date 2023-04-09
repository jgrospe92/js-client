// Async and Promises
// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });


// arrow function

// export const doSomething  = () => {
//     return <div>hello</div>
// }
// const names = ['jeffrey','mark','shane'];

// console.log(names.map(name => names.length))
// anonymous function
const res1 = function (a) { return a + 100 };
// arrow function
const res = a => a + 100; // only works for simple single parameters
// If it has multiple parameters, no parameters, 
// or default, destructured, or rest parameters, the parentheses around the parameter list are required.
const res2 = (a, b) => a + b + 100;

// console.log(res1(2));
// console.log(res(10));
//console.log(res2(100, 100));

// The braces can only be omitted if the function directly returns an expression. If the body has additional lines of processing,
// the braces are required — and so is the return keyword. Arrow functions cannot guess what or when you want to return.
// Traditional anonymous function
(function (a, b) {
    const chuck = 42;
    return a + b + chuck;
});
// Arrow function
const res3 = (a, b) => {
    console.log("chuck chuck")
    const chuck = 42;
    return a + b + chuck;
};
//console.log(res3(5,5));

const person = {
    name: "Pedro",
    age: 20,
    isMarried: false,
};
// Spread
const { name, age, isMarried } = person;
console.log(person);

const person2 = { ...person, name: "Miguel" };
console.log(person2);



function myBio(firstName, lastName, company) {
    return `${firstName} ${lastName} runs ${company}`;
}

// Use spread to expand an array’s items into individual arguments:
// breaks down the array value to individual parameters
const res5 = myBio(...["Oluwatobi", "Sofela", "CodeSweetly"]);
console.log(res5);

// rest demo
// Define a function with three parameters:\// Use rest to enclose the rest of specific user-supplied values into an array:
function myRest(firstName, lastName, ...otherInfo) { 
    return otherInfo;
  }
  
  // Invoke myBio function while passing five arguments to its parameters:
  const restDemo = myRest("Oluwatobi", "Sofela", "CodeSweetly", "Web Developer", "Male");
  console.log(restDemo);