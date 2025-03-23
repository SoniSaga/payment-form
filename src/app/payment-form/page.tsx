"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CountryPhoneInput from "@/components/common/CountryPhoneInput";
import FormDescription from "@/components/common/FormDescription";
import "react-phone-input-2/lib/style.css";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { SingleValue } from "react-select";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FormData {
  name: string;
  email: string;
  phone: string;
  countryCode: string;
  purpose: string;
  image: File | null;
  reportType: string;
  country: Option | null;
  state: Option | null;
  city: Option | null;
}

interface Option {
  value: string;
  label: string;
}

export default function AuraScanForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    purpose: "",
    image: null,
    reportType: "499",
    country: null,
    state: null,
    city: null,
  });

  // Dynamically load Razorpay Payment Button based on selected report type
  useEffect(() => {
    // Remove existing script to prevent duplication
    const existingScript = document.getElementById("razorpay-script");
    if (existingScript) {
      existingScript.remove();
    }

    // Create new script element
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute(
      "data-payment_button_id",
      formData.reportType === "499" ? "pl_Q9fj5zfW27sJeG" : "pl_Q9fmdlVVCe8zDl"
    );
    script.async = true;
    script.id = "razorpay-script";

    // Append script inside the button container
    const buttonContainer = document.getElementById(
      "razorpay-button-container"
    );
    if (buttonContainer) {
      buttonContainer.innerHTML = ""; // Clear previous button
      buttonContainer.appendChild(script);
    }
  }, [formData.reportType]); // Re-run effect when report type changes

  // Handles input changes for text fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles file upload and updates form state with the selected image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSelectChange = (selected: SingleValue<Option>, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: selected,
      ...(field === "country" ? { state: null, city: null } : {}),
      ...(field === "state" ? { city: null } : {}),
    }));
  };

  // Submits form data to the WordPress API
  const submitFormInfo = async () => {
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("phone", formData.phone);
    formDataObj.append("countryCode", formData.countryCode);
    formDataObj.append("purpose", formData.purpose);
    formDataObj.append("reportType", formData.reportType);
    if (formData.image) {
      formDataObj.append("image", formData.image);
    }
    formDataObj.append("status", "successful");
    formDataObj.append(
      "country",
      formData.country != null ? formData.country.label : ""
    );
    formDataObj.append(
      "state",
      formData.state != null ? formData.state.label : ""
    );
    formDataObj.append(
      "city",
      formData.city != null ? formData.city.label : ""
    );

    try {
      await fetch(`${apiBaseUrl}/wp-json/custom/v1/submit-form/`, {
        method: "POST",
        body: formDataObj,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Card className="md:p-6 max-w-lg mx-auto mt-10 shadow-lg border">
        <FormDescription />
        <CardContent>
          <h2 className="text-xl font-bold mb-4">Aura Scan Form</h2>

          {/* User Input Fields */}
          <div>
            <Input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="mb-3"
              required
            />

            <Input
              name="email"
              type="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              className="mb-3"
              required
            />

            <div className="flex gap-2 mb-3">
              <CountryPhoneInput
                value={formData.countryCode}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, countryCode: val }))
                }
              />
              <Input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <Select
              options={
                Country.getAllCountries().map((c) => ({
                  value: c.isoCode,
                  label: c.name,
                })) as any
              }
              value={formData.country}
              onChange={(selected) => handleSelectChange(selected, "country")}
              placeholder="Select Country"
              className="mb-3"
            />

            <Select
              options={
                (formData.country
                  ? State.getStatesOfCountry(formData.country.value).map(
                      (s) => ({
                        value: s.isoCode,
                        label: s.name,
                      })
                    )
                  : []) as any
              }
              value={formData.state}
              onChange={(selected) => handleSelectChange(selected, "state")}
              placeholder="Select State"
              isDisabled={!formData.country}
              className="mb-3"
            />

            <Select
              options={
                (formData.state
                  ? formData.country != null
                    ? City.getCitiesOfState(
                        formData.country.value,
                        formData.state.value
                      ).map((c) => ({ value: c.name, label: c.name }))
                    : []
                  : []) as any
              }
              value={formData.city}
              onChange={(selected) => handleSelectChange(selected, "city")}
              placeholder="Select City"
              isDisabled={!formData.state}
              className="mb-3"
            />

            <textarea
              name="purpose"
              placeholder="Purpose of aura scanning"
              value={formData.purpose}
              onChange={handleChange}
              className="border p-2 w-full rounded-md mb-3"
            />

            {/* File Upload Section */}
            <label className="block mb-2 font-semibold">
              Upload your Image - follow reference below:
            </label>

            <img
              src={"/images/PaymentFormImage.jpg"}
              alt="Uploaded Preview"
              className="mb-4 h-full w-full"
            />

            <Input type="file" onChange={handleFileChange} className="mb-4" />

            {/* Report Type Selection */}
            <h3 className="font-semibold mb-2">Select Report Type:</h3>
            <RadioGroup
              value={formData.reportType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, reportType: value }))
              }
              className="mb-4"
            >
              <label className="flex items-center gap-2">
                <RadioGroupItem value="499" /> ₹499 – Short guidance with 3 key
                areas
              </label>
              <label className="flex items-center gap-2">
                <RadioGroupItem value="999" /> ₹999 – Detailed aura analysis
              </label>
            </RadioGroup>

            {/* Razorpay Payment Button Container */}
            <div onClick={submitFormInfo}>
              <form id="razorpay-button-container" className="mt-4"></form>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </>
  );
}
