import React from "react";
import RadarChart from "./views/RadarChart";

const App = () => {
  return (
    <div>
      <header
        style={{
          textAlign: "center",
          marginBottom: "20px",
          backgroundColor: "#e8dce5",
        }}
      >
        <h1>Radar Chart Example</h1>
      </header>
      <RadarChart />
      <footer
        style={{
          textAlign: "center",
          padding: "20px",
          borderTop: "1px solid #ccc",
        }}
      >
        © 2024
      </footer>
    </div>
  );
};

export default App;
