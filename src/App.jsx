import DataTable from "datatables.net-react";
import DT from "datatables.net-dt";
import "datatables.net-select-dt";
import "datatables.net-responsive-dt";
import "datatables.net-buttons-dt";
import "datatables.net-buttons/js/buttons.html5";
import jszip from "jszip";
import pdfmake from "pdfmake";

//https://datatables.net/blog/2020/highcharts-integration

DataTable.use(DT);
DT.Buttons.jszip(jszip);
DT.Buttons.pdfMake(pdfmake);

function App() {
  const columns = [
    { data: "name" },
    { data: "position" },
    { data: "office" },
    { data: "extn" },
    { data: "start_date" },
    { data: "salary" },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <DataTable
        ajax="/data.json"
        columns={columns}
        className="display"
        options={{
          responsive: true,
          pageLength: 10,
          lengthMenu: [5, 10, 25, 50, 100],
          lengthChange: true, // Ensure the dropdown is enabled
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
  );
}

export default App;
