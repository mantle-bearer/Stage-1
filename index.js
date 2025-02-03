const express = require("express");
const axios = require("axios");

const app = express();

// Cache for fun facts
const funFactCache = {};

// Optimized Prime Check
const isPrime = (num) => {
    if (num < 2) return false;
    if (num === 2) return true; // Skip even numbers after 2
    if (num % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
        if (num % i === 0) return false;
    }
    return true;
};

// Optimized Perfect Number Check
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

// Optimized Armstrong Check
const isArmstrong = (num) => {
    const digits = num.toString().split("").map(Number);
    const sum = digits.reduce((acc, digit) => acc + Math.pow(digit, digits.length), 0);
    return sum === num;
};

// Digit sum remains the same as it's already efficient
const getDigitSum = (num) => num.toString().split("").reduce((sum, digit) => sum + Number(digit), 0);

// API Route
app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;

    // Combined Validation
    if (!/^\d+$/.test(number)) {
        return res.status(400).json({ number: "invalid input", error: true });
    }

    const num = Number(number);

    if (num > Number.MAX_SAFE_INTEGER) {
        return res.status(400).json({ number: "too large", error: true });
    }

    const properties = [];
    if (isArmstrong(num)) properties.push("armstrong");
    properties.push(num % 2 === 0 ? "even" : "odd");

    // Use Cache for Fun Fact
    let funFact = funFactCache[num] || "Fun fact not found";
    if (!funFactCache[num]) {
        try {
            const response = await axios.get(`http://numbersapi.com/${num}/math?json`);
            funFact = response.data.text;
            // Cache the result
            funFactCache[num] = funFact;
        } catch (error) {
            console.error("Error fetching fun fact:", error.message);
        }
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
