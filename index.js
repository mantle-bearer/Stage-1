const express = require("express");
const axios = require("axios");
const app = express();

const isPrime = (num) => num > 1 && [...Array(num).keys()].slice(2).every(i => num % i !== 0);
const isPerfect = (num) => [...Array(num).keys()].reduce((sum, i) => num % i === 0 ? sum + i : sum, 0) === num;
const isArmstrong = (num) => num === num.toString().split("").reduce((sum, d) => sum + Math.pow(+d, num.toString().length), 0);
const getDigitSum = (num) => num.toString().split("").reduce((sum, d) => sum + +d, 0);

const validateNumber = (num) => (!/^\d+$/.test(num) || Number(num) > Number.MAX_SAFE_INTEGER) 
    ? { number: "Invalid input. Accepts only numbers", error: true } : null;

app.get("/api/classify-number", async (req, res) => {
    const { number } = req.query;
    const validationError = validateNumber(number);
    if (validationError) return res.status(400).json(validationError);

    const num = Number(number);
    const properties = isArmstrong(num) ? ["armstrong", num % 2 ? "odd" : "even"] : [num % 2 ? "odd" : "even"];

    try {
        const { data } = await axios.get(`http://numbersapi.com/${num}/math?json`);
        res.json({ number: num, is_prime: isPrime(num), is_perfect: isPerfect(num), properties, digit_sum: getDigitSum(num), fun_fact: data.text });
    } catch {
        res.json({ number: num, is_prime: isPrime(num), is_perfect: isPerfect(num), properties, digit_sum: getDigitSum(num), fun_fact: "Fun fact not found" });
    }
});

module.exports = app;
if (require.main === module) app.listen(process.env.PORT || 3000, () => console.log(`Server running`));
