import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <Card className="text-center py-12">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-secondary-600">{message}</p>
        </div>
        {onRetry && (
          <Button onClick={onRetry} variant="primary">
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default Error;