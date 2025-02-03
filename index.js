const express = require("express");
const axios = require("axios");

const app = express();

// Cache for fun facts and number properties to help reduce API calls
const funFactCache = {};
const numberPropertiesCache = {};


const isPrime = (num) => {
    if (num < 2) return false;
    if (num === 2) return true;
    if (num % 2 === 0) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
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


const getDigitSum = (num) => num.toString().split("").reduce((sum, digit) => sum + Number(digit), 0);

// Function to fetch fun fact with caching
const getFunFact = async (num) => {
    if (funFactCache[num]) {
        return funFactCache[num];
    }

    try {
        const response = await axios.get(`http://numbersapi.com/${num}/math?json`);
        const funFact = response.data.text;
        funFactCache[num] = funFact;
        return funFact;
    } catch (error) {
        console.error("Error fetching fun fact:", error.message);
        return "Fun fact not found";
    }
};

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

    // Check if properties are cached
    let properties = numberPropertiesCache[num];
    if (!properties) {
        properties = [];
        if (isArmstrong(num)) properties.push("armstrong");
        properties.push(num % 2 === 0 ? "even" : "odd");

        // Cache the results
        numberPropertiesCache[num] = properties;
    }

    // Fetch the fun fact asynchronously
    const funFactPromise = getFunFact(num);

    // Get other number properties in parallel
    const primePromise = isPrime(num);
    const perfectPromise = isPerfect(num);
    const digitSumPromise = getDigitSum(num);

    // Wait for all promises to resolve
    const [funFact, isPrimeResult, isPerfectResult, digitSum] = await Promise.all([
        funFactPromise,
        primePromise,
        perfectPromise,
        digitSumPromise,
    ]);

    res.json({
        number: num,
        is_prime: isPrimeResult,
        is_perfect: isPerfectResult,
        properties,
        digit_sum: digitSum,
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
