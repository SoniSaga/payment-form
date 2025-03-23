
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; // Import styles

export default function CountryPhoneInput({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    return (
      <PhoneInput
        country={"in"} // Default country (India)
        value={value}
        onChange={onChange}
        inputClass="!w-full border p-2 rounded-md" // Apply Tailwind styles
        dropdownClass="!border !rounded-md"
      />
    );
  }