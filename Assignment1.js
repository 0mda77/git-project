// MOhamed emad Eldin Asaad Mohamed
/**
-----(1)
let x = "123";
let Sum=Number(x) +7;
console.log(Sum);

-----(2)

let value = 0;

function checkValue(value){
    if(!value){
        return ('invalid');
    }
    else{
        return value;
    }
}
console.log(checkValue(value))

-------(3)

for(let i=1 ; i<10 ; i++ ){
    if(i%2==0){
        continue;
    }
    console.log(i);
}

-----------(4)

let arr=[1,2,3,4,5,6,7,8,9];
    
let even = arr.filter(num=>num%2==0);
console.log(even)

-----------(5)

let arr1=[1,2,3];
let arr2=[4,5,6,7,8,9];
let arr3= [...arr1 , ...arr2]
console.log(arr3)

-----------(6)

function getDay(dayNum) {
    switch (dayNum) {
        case 1: return "Sunday";
        case 2: return "Monday";
        case 3: return "Tuesday";
        case 4: return "Wednesday";
        case 5: return "Thursday";
        case 6: return "Friday";
        case 7: return "Saturday";
        default: return "Invalid day number"
    }
}
for (let i = 1; i < 8; i++) {
    console.log(getDay(i));
}
    
---------------------(7)

let arr=["a", "ab", "abc"];
let result = arr.map((element,index)=> element.length)
console.log(result)

---------------------------------(8)


function checking(num){
    if(num%3==0 && num%5==0)
        return "Divisible by both";
    else
        return "Not Divisible"
}

console.log(checking(15))

-------------------------------------(9)


let square = (num)=>{
    return num*num;
}
console.log(square(3))

-------------------------------------(10)

const person = {name: 'John', age: 25}

function test(input){
    const {name , age}=input;
    return `${name} is ${age} years old`

}

console.log(test(person))

-------------------------------------(11)

function sum(n1 , n2){
    return n1+n2;
}
console.log(1+2);

-------------------------------------(12)

-------------------------------------(13)

let arr = [1, 3, 7, 2, 4];
function max(arr) {
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}
console.log(max(arr)); 
-------------------------------------(14)

const person = {name: 'John', age: 25}

function test(input){
    
    return Object.keys(input);

}
console.log(test(person));

-------------------------------------(15)

function split(input){
   return input.split(" ")

}

console.log(split("The quick brown fox"))

----------------------------------------------------------------------------------------------
1. forEach vs for...of
forEach: Array method only. Cannot use break or continue to stop or skip iterations.

for...of: General loop syntax. Works with any iterable (Arrays, Strings), supports break / continue, and handles async/await cleanly.

2. Hoisting & TDZ
Hoisting: JS moves variable and function declarations to the top of their scope before running code (var gets initialized as undefined).

Temporal Dead Zone (TDZ): The phase between entering a scope and declaring a let / const variable. Accessing it here throws a ReferenceError.

3. == vs ===
== (Loose): Compares values only after applying implicit type conversion ('5' == 5 is true).

=== (Strict): Compares both value and data type without conversion ('5' === 5 is false).

4. try-catch in Async Code
How it works: Code inside try runs; if an error occurs, execution jumps to catch to handle it smoothly without crashing the app.

Why it matters: Async calls (like API requests) can fail. try-catch prevents unhandled promise rejections and keeps the app stable.

5. Type Conversion vs Coercion
Type Conversion (Explicit): Manually converting a data type in code ( Number("123")).

Type Coercion (Implicit): Automatic conversion done behind the scenes by JS during operations ( "5" - 2 becomes 3).
**/
// MOhamed emad Eldin Asaad Mohamed
console.log("MOhamed emad Eldin Asaad Mohamed")