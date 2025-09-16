import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, color = "primary" }) => {
  const colorStyles = {
    primary: "text-primary-600 bg-primary-100",
    success: "text-green-600 bg-green-100",
    warning: "text-yellow-600 bg-yellow-100",
    info: "text-blue-600 bg-blue-100"
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-600">{title}</p>
          <p className="text-3xl font-bold text-secondary-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                className={`h-4 w-4 ${trend > 0 ? "text-green-500" : "text-red-500"}`} 
              />
              <span className={`text-sm ml-1 ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
      <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 opacity-10">
        <div className={`w-full h-full rounded-full bg-gradient-to-br from-${color}-400 to-${color}-600`} />
      </div>
    </Card>
  );
};

export default StatCard;