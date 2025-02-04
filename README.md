# 📊 Number Classification API

This is a simple API that classifies numbers based on their mathematical properties and provides a fun fact about the number.

## 🚀 Features

- Determines if a number is **prime** or **perfect**.
- Checks if the number is an **Armstrong number**.
- Identifies whether the number is **odd or even**.
- Computes the **sum of the digits** of the number.
- Fetches a **fun fact** about the number using the [Numbers API](http://numbersapi.com/#42).

---

## 🛠️ Technology Stack

- **Node.js** (Express.js)
- **Vercel** (Deployment)
- **Numbers API (math)** (Fun fact retrieval)

---

## 👥 Installation & Setup

1. **Clone the Repository**

   ```sh
   git clone https://github.com/mantle-bearer/Stage-1.git
   cd Stage-1
   ```

2. **Install Dependencies**

   ```sh
   npm install
   ```

3. **Run the Server Locally**
   ```sh
   npm start
   ```
   The API will be accessible at:
   ```
   http://localhost:3000/api/classify-number?number=371
   ```

---

## 💼 API Documentation

### **📌 Endpoint:**

**GET** `/api/classify-number?number={value}`

### **✅ Success Response (200 OK)**

```json
{
  "number": 371,
  "is_prime": false,
  "is_perfect": false,
  "properties": ["armstrong", "odd"],
  "digit_sum": 11,
  "fun_fact": "371 is an Armstrong number because 3^3 + 7^3 + 1^3 = 371"
}
```

### **❌ Error Responses (400 Bad Request)**

#### 🔴 **Invalid Input**

```json
{
  "number": "alphabet",
  "error": true
}
```

---

## 🚀 Deployment

This API is deployed on **Vercel**. You can access it at:  
👉 [Live Demo](https://stage-1-xi.vercel.app/api/classify-number?number=371)

---

## 👨‍💻 Author

- **Your Name**
- GitHub: [@mantle-bearer](https://github.com/mantle-bearer)
- Twitter: [@demantlebearer](https://twitter.com/demantlebearer)

---

## 📝 License

This project is licensed under the **MIT License**.
