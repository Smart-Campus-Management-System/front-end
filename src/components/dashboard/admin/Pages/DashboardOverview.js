import React from "react";
import DashboardCard from "../Utilities/DashboardCard";

const DashboardOverview = () => {
  const stats = [
    { title: "Total Tutors", count: 56, icon: "👩‍🏫" },
    { title: "Total Students", count: 120, icon: "👩‍🎓" },
    { title: "Subjects Offered", count: 20, icon: "📚" },
    { title: "Pending Approvals", count: 5, icon: "⏳" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white">
      <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <DashboardCard
            key={index}
            title={stat.title}
            count={stat.count}
            icon={stat.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardOverview;
