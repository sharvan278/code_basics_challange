import React, { useState } from "react";
import "./App.css";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const productMap = {
  High: "Smart Filter Mask",
  Middle: "Air Purifier Pro",
  Medium: "Air Purifier Pro",
  Low: "Budget Air Cleaner",
};

const rawStates = [
  { name: "Andhra Pradesh", aqi: 120, hospitalAdmissions: 20000, incomeLevel: "Middle" },
  { name: "Arunachal Pradesh", aqi: 90, hospitalAdmissions: 5000, incomeLevel: "Low" },
  { name: "Assam", aqi: 150, hospitalAdmissions: 15000, incomeLevel: "Low" },
  { name: "Bihar", aqi: 280, hospitalAdmissions: 30000, incomeLevel: "Low" },
  { name: "Chhattisgarh", aqi: 190, hospitalAdmissions: 18000, incomeLevel: "Low" },
  { name: "Goa", aqi: 70, hospitalAdmissions: 4000, incomeLevel: "High" },
  { name: "Gujarat", aqi: 200, hospitalAdmissions: 21000, incomeLevel: "Middle" },
  { name: "Haryana", aqi: 310, hospitalAdmissions: 26000, incomeLevel: "Middle" },
  { name: "Himachal Pradesh", aqi: 85, hospitalAdmissions: 6000, incomeLevel: "High" },
  { name: "Jharkhand", aqi: 170, hospitalAdmissions: 16000, incomeLevel: "Low" },
  { name: "Karnataka", aqi: 110, hospitalAdmissions: 18000, incomeLevel: "High" },
  { name: "Kerala", aqi: 95, hospitalAdmissions: 12000, incomeLevel: "High" },
  { name: "Madhya Pradesh", aqi: 230, hospitalAdmissions: 25000, incomeLevel: "Low" },
  { name: "Maharashtra", aqi: 150, hospitalAdmissions: 23000, incomeLevel: "High" },
  { name: "Manipur", aqi: 75, hospitalAdmissions: 4000, incomeLevel: "Low" },
  { name: "Meghalaya", aqi: 80, hospitalAdmissions: 3500, incomeLevel: "Low" },
  { name: "Mizoram", aqi: 60, hospitalAdmissions: 2000, incomeLevel: "Low" },
  { name: "Nagaland", aqi: 65, hospitalAdmissions: 3000, incomeLevel: "Low" },
  { name: "Odisha", aqi: 160, hospitalAdmissions: 17000, incomeLevel: "Low" },
  { name: "Punjab", aqi: 270, hospitalAdmissions: 24000, incomeLevel: "Middle" },
  { name: "Rajasthan", aqi: 210, hospitalAdmissions: 22000, incomeLevel: "Middle" },
  { name: "Sikkim", aqi: 55, hospitalAdmissions: 1500, incomeLevel: "Low" },
  { name: "Tamil Nadu", aqi: 130, hospitalAdmissions: 19000, incomeLevel: "High" },
  { name: "Telangana", aqi: 140, hospitalAdmissions: 20000, incomeLevel: "High" },
  { name: "Tripura", aqi: 100, hospitalAdmissions: 5000, incomeLevel: "Low" },
  { name: "Uttar Pradesh", aqi: 310, hospitalAdmissions: 67000, incomeLevel: "Low" },
  { name: "Uttarakhand", aqi: 105, hospitalAdmissions: 9000, incomeLevel: "Middle" },
  { name: "West Bengal", aqi: 190, hospitalAdmissions: 27000, incomeLevel: "Middle" },
  { name: "Delhi", aqi: 290, hospitalAdmissions: 45000, incomeLevel: "Middle" },
];

const stateData = rawStates.map((state) => ({
  ...state,
  productSuggestion: productMap[state.incomeLevel] || "Basic Protection Kit",
}));

function getAqiColor(aqi) {
  if (aqi <= 50) return "green";
  if (aqi <= 100) return "lightgreen";
  if (aqi <= 150) return "palegoldenrod";
  if (aqi <= 200) return "orange";
  if (aqi <= 300) return "red";
  return "maroon";
}

function App() {
  const [aqiRange, setAqiRange] = useState([0, 500]);
  const [selectedState, setSelectedState] = useState(null);

  const handleRangeChange = (newRange) => {
    setAqiRange(newRange);
    setSelectedState(null);
  };

  const filteredStates = stateData.filter(
    (state) => state.aqi >= aqiRange[0] && state.aqi <= aqiRange[1]
  );

  const selectedData = stateData.find((s) => s.name === selectedState);

  const exportCSV = () => {
    const csvContent = [
      ["State", "AQI", "Hospital Admissions", "Income Level", "Product Suggestion"],
      ...filteredStates.map((s) => [s.name, s.aqi, s.hospitalAdmissions, s.incomeLevel, s.productSuggestion]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "aqi_data.csv");
  };

  const exportToPDF = () => {
    const dashboard = document.getElementById("dashboard");
    html2canvas(dashboard).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save("AQI-Dashboard.pdf");
    });
  };

  return (
    <div className="app-container">
      <h1>AQI Dashboard</h1>

      <div className="controls">
        <label htmlFor="aqiSlider">Select AQI Range:</label>
        <Slider
          range
          min={0}
          max={500}
          step={10}
          value={aqiRange}
          onChange={handleRangeChange}
          allowCross={false}
          id="aqiSlider"
        />
        <div className="aqi-values">
          <span>Min: {aqiRange[0]}</span>
          <span>Max: {aqiRange[1]}</span>
        </div>
      </div>

      <div className="highlighted-states">
        <h3>States in AQI Range:</h3>
        {filteredStates.length > 0 ? (
          filteredStates.map((state) => (
            <button
              key={state.name}
              className={`state-button ${selectedState === state.name ? "active" : ""}`}
              onClick={() => setSelectedState(state.name)}
            >
              {state.name}
            </button>
          ))
        ) : (
          <p>No states in this AQI range.</p>
        )}

        {selectedState && (
          <button onClick={() => setSelectedState(null)} className="clear-btn">
            Clear Selection
          </button>
        )}
      </div>

      <div id="dashboard">
        {selectedData && (
          <div
            className="metrics-card fade-in"
            style={{ borderLeft: `8px solid ${getAqiColor(selectedData.aqi)}` }}
          >
            <h2>Metrics for {selectedData.name}:</h2>
            <p><strong>Current AQI:</strong> {selectedData.aqi}</p>
            <p><strong>Hospital Admissions:</strong> {selectedData.hospitalAdmissions}</p>
            <p><strong>Income Level:</strong> {selectedData.incomeLevel}</p>
            <p><strong>Product Suggestion:</strong> {selectedData.productSuggestion}</p>
          </div>
        )}
      </div>

      <div className="export-buttons">
        <button className="export-btn" onClick={exportCSV}>Export CSV</button>
        <button className="export-btn" onClick={exportToPDF}>Download PDF</button>
      </div>
    </div>
  );
}

export default App;
