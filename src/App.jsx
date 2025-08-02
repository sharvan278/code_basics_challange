// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const mockData = [
  { id: 'MH', name: 'Maharashtra', aqi: 150, hospitalAdmissions: 50000, incomeLevel: 'High' },
  { id: 'DL', name: 'Delhi', aqi: 280, hospitalAdmissions: 80000, incomeLevel: 'High' },
  { id: 'KA', name: 'Karnataka', aqi: 120, hospitalAdmissions: 30000, incomeLevel: 'Medium' },
  { id: 'TN', name: 'Tamil Nadu', aqi: 90, hospitalAdmissions: 25000, incomeLevel: 'Medium' },
  { id: 'UP', name: 'Uttar Pradesh', aqi: 220, hospitalAdmissions: 70000, incomeLevel: 'Low' },
  { id: 'WB', name: 'West Bengal', aqi: 180, hospitalAdmissions: 45000, incomeLevel: 'Low' },
  { id: 'GJ', name: 'Gujarat', aqi: 110, hospitalAdmissions: 28000, incomeLevel: 'Medium' },
  { id: 'RJ', name: 'Rajasthan', aqi: 190, hospitalAdmissions: 55000, incomeLevel: 'Low' },
  { id: 'MP', name: 'Madhya Pradesh', aqi: 170, hospitalAdmissions: 40000, incomeLevel: 'Low' },
  { id: 'PB', name: 'Punjab', aqi: 130, hospitalAdmissions: 32000, incomeLevel: 'Medium' },
  { id: 'HR', name: 'Haryana', aqi: 160, hospitalAdmissions: 38000, incomeLevel: 'High' },
  { id: 'KL', name: 'Kerala', aqi: 80, hospitalAdmissions: 20000, incomeLevel: 'High' },
  { id: 'AP', name: 'Andhra Pradesh', aqi: 100, hospitalAdmissions: 27000, incomeLevel: 'Medium' },
  { id: 'TG', name: 'Telangana', aqi: 95, hospitalAdmissions: 26000, incomeLevel: 'High' },
  { id: 'OD', name: 'Odisha', aqi: 200, hospitalAdmissions: 60000, incomeLevel: 'Low' },
];

const getProductSuggestion = (incomeLevel) => {
  switch (incomeLevel) {
    case 'High':
      return 'Premium, feature-rich air purifiers (e.g., IoT enabled, advanced filtration, sleek design)';
    case 'Medium':
      return 'Mid-range air purifiers (e.g., good filtration, essential features, balanced pricing)';
    case 'Low':
      return 'Economical, basic air purifiers (e.g., essential filtration, affordable, durable)';
    default:
      return 'No specific suggestion';
  }
};

const Filters = ({ filters, setFilters, applyFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  return (
    <div className="filters">
      <h2>Filter Data</h2>

      <label>State
        <select name="state" value={filters.state} onChange={handleChange}>
          <option value="">Select a State</option>
          {mockData.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </label>

      <label>AQI Range
        <div className="range-inputs">
          <input type="number" name="aqiMin" placeholder="Min AQI" value={filters.aqiMin} onChange={handleRangeChange} />
          <input type="number" name="aqiMax" placeholder="Max AQI" value={filters.aqiMax} onChange={handleRangeChange} />
        </div>
      </label>

      <label>Max Hospital Admissions
        <input type="number" name="hospitalAdmissions" value={filters.hospitalAdmissions} onChange={handleRangeChange} />
      </label>

      <label>Income Level
        <select name="incomeLevel" value={filters.incomeLevel} onChange={handleChange}>
          <option value="">All Income Levels</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </label>

      <button onClick={applyFilters}>Apply Filters</button>
    </div>
  );
};

const Dashboard = ({ filteredData, selectedStateId }) => {
  const selectedState = filteredData.find(d => d.id === selectedStateId);

  return (
    <div className="dashboard">
      <h2>Market Intelligence Dashboard</h2>

      <div className="map-overview">
        <h3>India Map Overview (Simplified)</h3>
        <div className="state-grid">
          {mockData.map(state => (
            <div
              key={state.id}
              className={`state-box ${selectedStateId === state.id ? 'selected' : ''} ${state.aqi > 200 ? 'high-aqi' : ''}`}
              title={`${state.name} (AQI: ${state.aqi})`}
            >
              {state.name}
            </div>
          ))}
        </div>
        <p className="legend">
          <span className="legend-box selected"></span> Selected State
          <span className="legend-box other"></span> Other States
          <span className="legend-box high-aqi-border"></span> High AQI (&gt;200)
        </p>
      </div>

      {selectedState ? (
        <div className="metrics">
          <h3>Metrics for {selectedState.name}</h3>
          <div className="metrics-grid">
            <div className="metric-card">
              <p>Current AQI:</p>
              <h4>{selectedState.aqi}</h4>
            </div>
            <div className="metric-card">
              <p>Hospital Admissions (Annual):</p>
              <h4>{selectedState.hospitalAdmissions.toLocaleString()}</h4>
            </div>
            <div className="metric-card">
              <p>Predominant Income Level:</p>
              <h4>{selectedState.incomeLevel}</h4>
            </div>
            <div className="metric-card wide">
              <p>Product Type Suggestion:</p>
              <p>{getProductSuggestion(selectedState.incomeLevel)}</p>
            </div>
          </div>
        </div>
      ) : (
        <p className="no-selection">Apply filters or select a state to view detailed metrics.</p>
      )}
    </div>
  );
};

export default function App() {
  const [filters, setFilters] = useState({
    state: '',
    aqiMin: 0,
    aqiMax: 500,
    hospitalAdmissions: 100000,
    incomeLevel: '',
  });

  const [filteredData, setFilteredData] = useState(mockData);
  const [selectedStateId, setSelectedStateId] = useState('');

  const applyFilters = () => {
    const newFilteredData = mockData.filter(item => {
      const matchesState = filters.state === '' || item.id === filters.state;
      const matchesAqi = item.aqi >= filters.aqiMin && item.aqi <= filters.aqiMax;
      const matchesHospitalAdmissions = filters.hospitalAdmissions === 0 || item.hospitalAdmissions <= filters.hospitalAdmissions;
      const matchesIncomeLevel = filters.incomeLevel === '' || item.incomeLevel === filters.incomeLevel;

      return matchesState && matchesAqi && matchesHospitalAdmissions && matchesIncomeLevel;
    });
    setFilteredData(newFilteredData);
    if (filters.state) setSelectedStateId(filters.state);
    else setSelectedStateId('');
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <div className="app">
      <div className="layout">
        <Filters filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
        <Dashboard filteredData={filteredData} selectedStateId={selectedStateId} />
      </div>
    </div>
  );
}
