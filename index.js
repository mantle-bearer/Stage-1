const express = require("express");
const axios = require("axios");

const app = express();

// Utility Functions for Number Classification, isPrime, isPerfect, isArmstrong, getDigitSum
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

// API Route
app.get("/api/classify-number", async (req, res) => {

    const { number } = req.query;

    // Check if number is missing or empty
    if (!number || number.trim() === "") {
        return res.status(400).json({ number: "missing number parameter", error: true });
    }

    // Check if input contains spaces
    if (/\s/.test(number)) {
        return res.status(400).json({ number: "no spaces allowed", error: true });
    }

    // Check if input is a floating point number
    if (/\./.test(number)) {
        return res.status(400).json({ number: "only integers allowed", error: true });
    }

    // Check if input contains alphabets
    if (/[a-zA-Z]/.test(number)) {
        return res.status(400).json({ number: "alphabet", error: true });
    }

    // Check if input contains special characters
    if (/[^0-9]/.test(number)) {
        // If it contains mathematical operators
        if (/[-+*/]/.test(number)) {
            return res.status(400).json({ number: "no mathematical operators allowed", error: true });
        }
        return res.status(400).json({ number: "invalid characters", error: true });
    }

    // Check if number is too large
    if (Number(number) > Number.MAX_SAFE_INTEGER) {
        return res.status(400).json({ number: "too large", error: true });
    }
    

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

// Export for Vercel
module.exports = app;

// Local Development Support
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
} 
