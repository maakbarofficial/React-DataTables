import React, { useState, useEffect } from "react";
import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.html5";
import jszip from "jszip";
import pdfmake from "pdfmake";
import ReactApexChart from "react-apexcharts";

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

function App() {
  const [tableData, setTableData] = useState([]);
  const [selectedColumn1, setSelectedColumn1] = useState("position"); // x-axis
  const [selectedColumn2, setSelectedColumn2] = useState("salary"); // y-axis
  const [chartData, setChartData] = useState({
    series: [],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Categories",
        },
      },
      yaxis: {
        title: {
          text: "Values",
        },
      },
    },
  });

  const columns = [
    { data: "name" },
    { data: "position" },
    { data: "office" },
    { data: "extn" },
    { data: "start_date" },
    { data: "salary" },
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const { data } = await response.json();
        setTableData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Update chart data based on selected columns
  const handleColumnChange = () => {
    if (tableData.length > 0) {
      const xAxisCategories = tableData.map((row) => row[selectedColumn1]);
      const yAxisData = tableData.map((row) => {
        const value = row[selectedColumn2];
        if (selectedColumn2 === "salary") {
          return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
        }
        return parseFloat(value) || 0;
      });

      setChartData({
        series: [
          {
            name: selectedColumn2,
            data: yAxisData,
          },
        ],
        options: {
          ...chartData.options,
          xaxis: {
            categories: xAxisCategories,
            title: {
              text: selectedColumn1.charAt(0).toUpperCase() + selectedColumn1.slice(1),
            },
          },
          yaxis: {
            title: {
              text: selectedColumn2.charAt(0).toUpperCase() + selectedColumn2.slice(1),
            },
          },
          dataLabels: {
            enabled: false,
            style: {
              fontSize: "5px", // Smaller font size
              colors: ["#000"], // Customize the text color
            },
            textAnchor: "middle", // Center-aligns the text on the bar
            formatter: function (val) {
              return val.toFixed(2); // Formats the value, optional
            },
            offsetX: 0, // Aligns horizontally
            offsetY: 0, // Aligns vertically
            orientation: "vertical", // Forces vertical alignment
            rotate: 360, // Rotates the text to be vertical
          },
        },
      });
    }
  };

  useEffect(() => {
    handleColumnChange();
  }, [selectedColumn1, selectedColumn2, tableData]);

  return (
    <>
      <div style={{ padding: "20px" }}>
        <DataTable
          data={tableData}
          columns={columns}
          className="display"
          options={{
            responsive: true,
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50, 100],
            lengthChange: true,
            layout: {
              top1End: "buttons",
            },
            select: true,
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Office</th>
              <th>Extn.</th>
              <th>Start date</th>
              <th>Salary</th>
            </tr>
          </thead>
        </DataTable>
      </div>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
        <div>
          <h1>Data Visualization</h1>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <label htmlFor="column1">Select X-Axis</label>
            <select
              name="column1"
              id="column1"
              value={selectedColumn1}
              onChange={(e) => setSelectedColumn1(e.target.value)}
            >
              <option value="position">Position</option>
              <option value="office">Office</option>
            </select>
          </div>
          <div>
            <label htmlFor="column2">Select Y-Axis</label>
            <select
              name="column2"
              id="column2"
              value={selectedColumn2}
              onChange={(e) => setSelectedColumn2(e.target.value)}
            >
              <option value="salary">Salary</option>
              <option value="extn">Extension</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ padding: "20px" }}>
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={350}
        />
      </div>
    </>
  );
}

export default App;