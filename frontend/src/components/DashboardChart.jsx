/**
 * Dashboard Chart - Bar chart for Balance, Deposits, Withdrawals
 */
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const DashboardChart = ({ balance, deposits, withdrawals }) => {
  const data = {
    labels: ["Balance", "Deposits", "Withdrawals"],
    datasets: [
      {
        label: "Account Summary",
        data: [balance, deposits, withdrawals],
        backgroundColor: ["#3b82f6", "#22c55e", "#ef4444"],
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 font-archivo">Account Overview</h2>
      <Bar data={data} options={{ responsive: true }} />
    </div>
  );
};

export default DashboardChart;
