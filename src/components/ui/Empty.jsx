import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  icon = "Database",
  action,
  actionLabel = "Add New"
}) => {
  return (
    <Card className="text-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="h-8 w-8 text-secondary-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">{title}</h3>
          <p className="text-secondary-600">{description}</p>
        </div>
        {action && (
          <Button onClick={action} variant="primary">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Empty;