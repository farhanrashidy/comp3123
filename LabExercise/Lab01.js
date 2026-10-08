// Exercise 1
function capitalizeWords(str){
    return str
        .split(' ')
        .map(word=> word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
console.log("--- Exercise 1 ---");
console.log(capitalizeWords("the quick brown fox")); 

// Exercise 2
function max(a, b, c){
    return Math.max(a, b, c);
}
console.log("--- Exercise 2 ---");
console.log(max(1, 0, 1));
console.log(max(0, -10, -20));
console.log(max(1000, 510, 440));

// Exercise 3
function right(str){
    if (str.length < 3) return str;
    return str.slice(-3) + str.slice(0, -3);
}
console.log("--- Exercise 3 ---");
console.log(right("Python"));
console.log(right("JavaScript"));
console.log(right("Hi"));

// Exercise 4
function angle_type(angle){
    if (angle < 90 && angle > 0) return "Acute angle";
    if (angle === 90) return "Right angle";
    if (angle > 90 && angle < 180) return "Obtuse angle";
    if (angle === 180) return "Straight angle";
    return "Invalid angle";
}
console.log("--- Exercise 4 ---");
console.log(angle_type(47));
console.log(angle_type(90));
console.log(angle_type(145));
console.log(angle_type(180));

// Exercise 5
function array_max_sum(arr, k){
    if (k > arr.length) return null;
    let windowSum = 0;
    for (let i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    let maxSum = windowSum;
    for (let i = k; i < arr.length; i++) {
        windowSum = windowSum - arr[i - k] + arr[i];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}
console.log("--- Exercise 5 ---");
console.log(array_max_sum([1,2,3,14,5],2));
console.log(array_max_sum([2,3,5,1,6],3));
console.log(array_max_sum([9,3,5,1,7],2));