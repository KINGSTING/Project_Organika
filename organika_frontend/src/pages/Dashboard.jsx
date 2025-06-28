import { useEffect, useState } from "react";

function Dashboard() {
  const [welcomeMessage, setWelcomeMessage] = useState("Welcome to the Dashboard!");

  useEffect(() => {
    // Simulate fetching data later
    setTimeout(() => {
      setWelcomeMessage("📊 Dashboard Overview");
    }, 500);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{welcomeMessage}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">📁 Plantilla Items</h3>
          <p className="text-sm text-gray-600">Manage government plantilla positions.</p>
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">👥 Employees</h3>
          <p className="text-sm text-gray-600">View and manage employee data.</p>
        </div>

        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="text-lg font-semibold">⚙️ Settings</h3>
          <p className="text-sm text-gray-600">Configure app preferences.</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-4 rounded shadow">
        <p className="text-gray-700">
          You can expand this dashboard to include charts, real-time stats, and quick action buttons.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
