// Import required dependencies
const express = require("express");
const axios = require("axios");

const app = express();

// Utility Functions
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const isPerfect = (num) => {
    let sum = 1;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            sum += i;
            if (i !== num / i) sum += num / i;
        }
    }
    return sum === num && num !== 1;
};

const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, digits.length), 0);
    return sum === num;
};

const getDigitSum = (num) => {
    return num.toString().split("").reduce((sum, digit) => sum + Number(digit), 0);
};


// Validate number parameter
const validateNumber = (number) => {
    const rules = [
        (n) => !n || n.trim() === "",   // Test for Missing input
        (n) => /\s/.test(n),            // Test for Contains spaces
        (n) => /\./.test(n),            // Test for Floating point numbers
        (n) => /[a-zA-Z]/.test(n),      // Test for Alphabets
        (n) => /[-+*/]/.test(n),        // Test for Mathematical operators
        (n) => /[^0-9]/.test(n),        // Test for Special characters
        (n) => Number(n) > Number.MAX_SAFE_INTEGER, // Test for Number greater than MAX_SAFE_INTEGER
    ];

    return rules.some((test) => test(number)) ? { number: "Invalid input. Accepts only numbers", error: true } : null;

};


// API Route
app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;
    const validationError = validateNumber(number);
    if (validationError) return res.status(400).json(validationError);

    const num = Number(number);
    const properties = [];
    if (isArmstrong(num)) properties.push("armstrong");
    properties.push(num % 2 === 0 ? "even" : "odd");

    // Fetch Fun Fact
    let funFact = "Fun fact not found";
    try {
        const response = await axios.get(`http://numbersapi.com/${num}/math?json`);
        funFact = response.data.text;
    } catch (error) {
        console.error("Error fetching fun fact:", error.message);
    }

    res.json({
        number: num,
        is_prime: isPrime(num),
        is_perfect: isPerfect(num),
        properties,
        digit_sum: getDigitSum(num),
        fun_fact: funFact,
    });
});

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} 
