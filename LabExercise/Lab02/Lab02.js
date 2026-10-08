// Exercise 1
const greeter = (myArray, counter) => {
    const greetText = "Hello";
    for(const name of myArray){
        console.log(`${greetText} ${name}`);
    }
};
console.log("--- Exercise 1 ---");
greeter(["Randy Savage", "Ric Flair", "Hulk Hogan"], 3);

// Exercise 2
const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('').toLowerCase();
console.log("--- Exercise 2 ---");
console.log(capitalize("fooBar"));
console.log(capitalize("nodeJs"));

// Exercise 3
const colors = ['red', 'green', 'blue'];
const capitalizedColors = colors.map(color => capitalize(color));
console.log("--- Exercise 3 ---");
console.log(capitalizedColors);

// Exercise 4
const values = [1,60,34,30,20,5];
const filterLessThan20 = values.filter(value => value < 20);
console.log("--- Exercise 4 ---");
console.log(filterLessThan20);

// Exercise 5
const array = [1,2,3,4];
const calculateSum = array.reduce((acc, num) => acc + num, 0);
const calculateProduct = array.reduce((acc, num) => acc * num, 1);
console.log("--- Exercise 5 ---");
console.log(calculateSum);
console.log(calculateProduct);

// Exercise 6
class Car{
    constructor(model,year){
        this.model = model;
        this.year = year;
    }
    details(){
        return `Model: ${this.model} Engine ${this.year}`;
    }
}
class Sedan extends Car{
    constructor(model, year, balance){
        super(model, year);
        this.balance = balance;
    }
    info(){
        return `${this.model} has a balance of $${this.balance.toFixed(2)}`;
    }
}
console.log("--- Exercise 6 ---");
const car2 = new Car('Pontiac Firebird', 1976);
console.log(car2.details());
const sedan = new Sedan('Volvo SD', 2018, 30000);
console.log(sedan.info());