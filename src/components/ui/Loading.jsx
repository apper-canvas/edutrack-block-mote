import React from "react";
import Card from "@/components/atoms/Card";

const Loading = ({ type = "default" }) => {
  if (type === "table") {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-secondary-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-4">
                <div className="h-4 bg-secondary-200 rounded col-span-2"></div>
                <div className="h-4 bg-secondary-200 rounded"></div>
                <div className="h-4 bg-secondary-200 rounded"></div>
                <div className="h-4 bg-secondary-200 rounded"></div>
                <div className="h-4 bg-secondary-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-secondary-200 rounded w-24"></div>
                  <div className="h-8 bg-secondary-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-secondary-200 rounded-xl"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
    </div>
  );
};

export default Loading;