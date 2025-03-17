const jsonExample = `{"name":"Anton","age":36,"skills":["Javascript","HTML","CSS"],"salary":80000}`;

const obj = {
    name: 'Anton',
    age: 36,
    skills: [
        'Javascript',
        'HTML',
        'CSS'
    ],
    salary: 80000
}

const string = JSON.stringify(obj);

console.log(jsonExample);
console.log(string);
console.log(string === jsonExample) // true