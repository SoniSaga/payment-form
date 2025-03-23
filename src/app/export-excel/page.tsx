"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment-timezone";

// Base URL for API calls, retrieved from environment variables
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const ExportExcelButton = () => {
  // State to store selected start and end dates
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);

  // Function to handle export action
  const handleExport = async () => {
    // Ensure both dates are selected before proceeding
    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      return;
    }

    setLoading(true); // Set loading state to true while fetching data

    // Format dates for API request
    const formattedStartDate =
      startDate.toISOString().split("T")[0] + " 00:00:00";
    const formattedEndDate = endDate.toISOString().split("T")[0] + " 23:59:59";

    // Construct API URL with selected date range
    const apiUrl = `${apiBaseUrl}/wp-json/custom/v1/export-json?start_date=${formattedStartDate}&end_date=${formattedEndDate}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // Handle API errors
      if (!response.ok) {
        throw new Error(data.message || "Error fetching data");
      }

      // Show alert if no records are found
      if (data.length === 0) {
        alert("No records found for the selected date range.");
        return;
      }

      // Modify data before exporting
      const modifiedData = data.map((row: any) => {
        // Convert UTC timestamps to India Standard Time (IST)
        if (row.created_at) {
          row.created_at = moment
            .utc(row.created_at)
            .tz("Asia/Kolkata")
            .format("YYYY-MM-DD HH:mm:ss");
        }

        // Combine country code and phone number for better readability
        if (row.phone && row.country_code) {
          row.phone = `${row.country_code} ${row.phone}`;
          delete row.country_code; // Remove separate country_code field
        }

        return row;
      });

      // Create an Excel worksheet from the JSON data
      const worksheet = XLSX.utils.json_to_sheet(modifiedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Payments");

      // Convert workbook to a downloadable Blob
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Download the Excel file
      saveAs(
        blob,
        `wp_payment_form_${formattedStartDate}_to_${formattedEndDate}.xlsx`
      );
    } catch (error) {
      alert(`Error: ${error}`); // Show error message if API call fails
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-lg font-semibold">Export Payment Data</h2>

      {/* Date pickers for selecting the start and end date */}
      <div className="flex space-x-2">
        <div>
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border p-2"
          />
        </div>
        <div>
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="border p-2"
          />
        </div>
      </div>

      {/* Export button to trigger data download */}
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Exporting..." : "Export Excel"}
      </button>
    </div>
  );
};

export default ExportExcelButton;
