
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  UsersIcon,
  StarIcon,
} from "@heroicons/react/24/outline";

const icons = {
  "Jobs Posted": <BriefcaseIcon className="w-6 h-6 text-blue-500" />,
  "Total Applicants": <UsersIcon className="w-6 h-6 text-green-500" />,
  "Shortlisted Candidates": <StarIcon className="w-6 h-6 text-yellow-500" />,
};

const DashboardStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => {
        const CardContent = (
          <>
            <div className="p-3 bg-gray-100 rounded-full">
              {icons[stat.title]}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-gray-500">{stat.title}</p>
            </div>
          </>
        );

        return stat.path ? (
          <Link
            key={i}
            to={stat.path}
            className="bg-white shadow-md rounded-lg p-5 flex items-center space-x-4
                       hover:shadow-lg transition cursor-pointer"
          >
            {CardContent}
          </Link>
        ) : (
          <div
            key={i}
            className="bg-white shadow-md rounded-lg p-5 flex items-center space-x-4"
          >
            {CardContent}
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
