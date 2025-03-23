import React from "react";

const FormDescription = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4">
        Aura Energy Scanning
      </h1>
      <p className="text-lg font-semibold text-center">Welcome to Divoo! ✨</p>
      <p className="mt-4 text-gray-700">
        We are excited to assist you on your{" "}
        <strong>Aura Scanning journey!</strong> Your aura holds the key to
        understanding the <strong>energy blocks</strong> affecting different
        areas of your life—whether in{" "}
        <strong>health, wealth, or relationships</strong>.{" "}
        <strong>Aura Scanning helps identify these blocks</strong> so you can
        work on them and bring positive transformation.
      </p>

      <h2 className="text-xl font-bold mt-6">
        🔮 Aura Scanning Report Options:
      </h2>
      <p className="mt-2">We offer two types of reports based on your needs:</p>

      <div className="mt-4 p-4 border rounded-lg bg-gray-100">
        <p className="font-bold">✅ Short Report – ₹499</p>
        <p>
          Identifies <strong>3 major energy blocks</strong> in your aura.
        </p>
        <p>Provides focused guidance on how to work on it.</p>
      </div>

      <div className="mt-4 p-4 border rounded-lg bg-gray-100">
        <p className="font-bold">✅ Detailed Report – ₹999</p>
        <p>
          <strong>In-depth analysis</strong> of your aura, covering multiple
          blockages.
        </p>
        <p>Guidance on how to remove energy blocks for overall well-being.</p>
      </div>

      <h2 className="text-xl font-bold mt-6">How to Get Your Aura Scanning?</h2>
      <ul className="mt-4 space-y-3">
        <li className="flex items-center space-x-2">
          <span className="text-blue-600 text-xl">1️⃣</span>
          <span>Fill the Form – Enter your details and submit.</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-blue-600 text-xl">2️⃣</span>
          <span>Upload Image – Attach your photo for scanning.</span>
        </li>
        <li className="flex items-center space-x-2">
          <span className="text-blue-600 text-xl">3️⃣</span>
          <span>Make Payment – Pay using the provided details.</span>
        </li>
      </ul>
    </div>
  );
};

export default FormDescription;
