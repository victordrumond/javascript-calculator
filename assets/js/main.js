// Global variables //
let currentValue, storedValue, currentOp, storedOp, readyToNewInput, onGoingCalculation, displayContent, result, correctResult, maxDisplayLength, saveOpForLater, saveLastValueForLater, memoryValue;


// Initial parameters //
displayContent = "0";
currentValue = 0;
storedValue = currentOp = storedOp = saveOpForLater = saveLastValueForLater = null;
readyToNewInput = true;
onGoingCalculation = null;
maxDisplayLength = 10;
memoryValue = 0;


// Bank of math operations //
const mathOps = {
    "add": add = (a, b) => {return a + b},
    "sub": sub = (a, b) => {return a - b},
    "mul": mul = (a, b) => {return a * b},
    "div": div = (a, b) => {return a / b},
    "equals": equ = (a, b) => {return b}
};


// This function captures the display content and saves it as a number //
const saveCurrent = () => {
    
    displayContent = $("#display").html();
    currentValue = parseFloat(displayContent);
};


// This function updates the display //
const updateDisplay = (num) => {

    if (readyToNewInput) {
        $("#display").html("0");
    };

    saveCurrent();

    if (displayContent === "0" && num !== ".") {
        displayContent = num;
    } else if (displayContent === "-0" && num !== ".") {
        $("#display").html("-");
        displayContent = $("#display").html();
        displayContent += num;
    } else if (num !== "." && displayContent.length < maxDisplayLength) {
        displayContent += num;
    } else if (num === "." && (/\./g).test(displayContent) === false) {
        displayContent += num;
    };

    $("#display").html(displayContent);

    saveCurrent();
    readyToNewInput = false;
    onGoingCalculation = true;
    storedOp = currentOp;
};


// This function executes math operations //
const doOperation = (op) => {

    currentOp = op;

    if (!storedValue && storedValue !== 0) {
        storedValue = currentValue;
    } else if (onGoingCalculation) {
        saveOpForLater = storedOp;
        saveLastValueForLater = currentValue;
        result = mathOps[storedOp](storedValue, currentValue);
        $("#display").html(dealWithFloatResult(result));
    };

    saveCurrent();

    if (currentOp === "equals") {
        storedValue = null;
    } else {
        storedValue = currentValue;
    };

    if (!onGoingCalculation && currentOp === "equals") {
        result = mathOps[saveOpForLater](currentValue, saveLastValueForLater);
        $("#display").html(dealWithFloatResult(result));
    };

    saveCurrent();
    readyToNewInput = true;
    onGoingCalculation = false;
};


// This function formats the result of a math operation //
const dealWithFloatResult = (num) => {

    if (isNaN(num) || !isFinite(num)) {
        correctResult = "Error";
    } else if (Math.abs(num) < Math.pow(10, -maxDisplayLength + 1) || Math.abs(num) > Math.pow(10, maxDisplayLength - 1)) {
        correctResult = num.toExponential(maxDisplayLength - 5).toString().replace(/\.0+e/, "e");
    } else if (num.toString().length > maxDisplayLength) {
        correctResult = num.toFixed(maxDisplayLength - Math.round(Math.abs(num)).toString().length - 1).toString().replace(/\.0+e/, "e");
    } else {
        correctResult = num;
    };

    if (parseFloat(correctResult).toString().length < correctResult.toString().length) {
        return parseFloat(correctResult).toString();
    } else {
        return correctResult;
    };
};


// This function clears the display and resets the parameters to their initial values //
const clearDisplay = () => {

    $("#display").html("0");
    displayContent = "0";
    currentValue = 0;
    storedValue = currentOp = storedOp = saveOpForLater = saveLastValueForLater = null;
    readyToNewInput = true;
    onGoingCalculation = null;
};


// This function deletes the last digit on the display //
const deleteLast = () => {

    if ((displayContent.length === 1) || (displayContent.length === 2 && (/^[-]/).test(displayContent))) {
        $("#display").html("0");
    } else {
        $("#display").html(displayContent.slice(0, -1));
    };

    saveCurrent();
};


// This function makes the plus/minus button work properly //
const changeSignal = () => {
    
    if (currentOp && currentOp !== "equals" && readyToNewInput) {
        $("#display").html("-0");
    } else if ((/^[-]/).test(displayContent)) {
        displayContent = displayContent.substring(1);
        $("#display").html(displayContent);
    } else {
        $("#display").html("-" + displayContent);
    };

    saveCurrent();
    readyToNewInput = false;
};


// This function makes the percentage button work properly //
const handlePercentage = () => {

    if (!storedValue) {
        $("#display").html(dealWithFloatResult(parseFloat(displayContent / 100)));
    } else {
        $("#display").html(dealWithFloatResult(parseFloat(displayContent * storedValue / 100)))
    };

    saveCurrent();
};


// This function makes the memory buttons work properly //
const memoryButtons = (btn) => {

    if (btn === "m+") {
        $("#memory").html("M");
        memoryValue += currentValue;
    } else if (btn === "m-") {
        $("#memory").html("M");
        memoryValue -= currentValue;
    } else if (btn === "mr") {
        $("#display").html(dealWithFloatResult(memoryValue));
    } else if (btn === "mc") {
        $("#memory").html("");
        memoryValue = 0;
    };

    saveCurrent();
    readyToNewInput = true;
    onGoingCalculation = true;
    storedOp = currentOp;
};