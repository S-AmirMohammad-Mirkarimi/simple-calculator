// ===== Calculator variables =====
let displayValue = "0";            // what is currently shown in the display
let firstNumber = null;             // first number of the calculation
let operator = null;                // chosen operator (+, -, *, /)
let waitingForSecondNumber = false; // are we waiting for the second number?

// Get the display element from the HTML
let display = document.getElementById("display");

// Shows the current value in the display
function updateDisplay() {
  display.textContent = displayValue;
}

// ===== 1. Enter a number (0-9) =====
function inputNumber(number) {
  if (displayValue === "Error") {
    displayValue = "0";   // restart after an error
  }

  if (waitingForSecondNumber === true) {
    displayValue = number;              // start a new number
    waitingForSecondNumber = false;
  } else {
    if (displayValue === "0") {
      displayValue = number;            // replace the leading zero
    } else {
      displayValue = displayValue + number; // append the digit
    }
  }
  updateDisplay();
}

// ===== 2. Decimal point =====
function inputDecimal() {
  if (displayValue === "Error") {
    displayValue = "0";
  }

  if (waitingForSecondNumber === true) {
    displayValue = "0.";
    waitingForSecondNumber = false;
    updateDisplay();
    return;
  }

  // allow only one decimal point per number
  if (displayValue.indexOf(".") === -1) {
    displayValue = displayValue + ".";
  }
  updateDisplay();
}

// ===== 3. Choose an operator (+, -, *, /) =====
function chooseOperator(op) {
  if (displayValue === "Error") {
    return;   // do nothing if there is an error
  }

  let currentValue = parseFloat(displayValue);

  // two operators in a row? -> just change the operator
  if (waitingForSecondNumber === true && operator !== null) {
    operator = op;
    return;
  }

  if (firstNumber === null) {
    firstNumber = currentValue;   // save the first number
  } else if (operator !== null) {
    // calculate a running result, e.g. 5 + 3 + 2
    let result = calculate(firstNumber, currentValue, operator);
    displayValue = String(result);
    firstNumber = result;
    updateDisplay();
  }

  operator = op;
  waitingForSecondNumber = true;
}

// ===== 4. Perform the calculation (with switch) =====
function calculate(num1, num2, op) {
  let result = 0;
  switch (op) {
    case "+":
      result = num1 + num2;
      break;
    case "-":
      result = num1 - num2;
      break;
    case "*":
      result = num1 * num2;
      break;
    case "/":
      if (num2 === 0) {
        return "Error";   // division by zero is not allowed
      }
      result = num1 / num2;
      break;
  }
  return result;
}

// ===== 5. Equals button (=) =====
function equals() {
  // if there is no operator or there is an error: do nothing
  if (operator === null || displayValue === "Error") {
    return;
  }

  let currentValue = parseFloat(displayValue);
  let result = calculate(firstNumber, currentValue, operator);

  if (result === "Error") {
    // division by zero -> show error
    displayValue = "Error";
    alert("Division by zero is not allowed!");
  } else {
    // round to avoid small decimal errors like 0.1 + 0.2
    result = Math.round(result * 100000000) / 100000000;
    displayValue = String(result);
  }

  updateDisplay();

  // reset; the result can be used for the next calculation
  firstNumber = null;
  operator = null;
  waitingForSecondNumber = true;
}

// ===== 6. Clear everything (C) =====
function clearAll() {
  displayValue = "0";
  firstNumber = null;
  operator = null;
  waitingForSecondNumber = false;
  updateDisplay();
}

// ===== 7. Delete the last digit (Backspace) =====
function backspace() {
  if (displayValue === "Error" || waitingForSecondNumber === true) {
    return;   // do nothing on error or while waiting
  }
  if (displayValue === "0") {
    return;
  }

  displayValue = displayValue.slice(0, -1); // remove the last character

  if (displayValue === "") {
    displayValue = "0";   // if empty, show "0" again
  }
  updateDisplay();
}
