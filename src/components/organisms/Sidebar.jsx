import React from "react";
import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { motion } from "framer-motion";

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Students", href: "/students", icon: "Users" },
    { name: "Teachers", href: "/teachers", icon: "UserCheck" },
    { name: "Classes", href: "/classes", icon: "BookOpen" },
    { name: "Reports", href: "/reports", icon: "BarChart3" }
  ];

  // Desktop Sidebar (Static)
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white border-r border-secondary-200 h-full">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-900">EduTrack</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                    : "text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ApperIcon 
                    name={item.icon} 
                    className={`mr-3 h-5 w-5 transition-colors ${
                      isActive ? "text-white" : "text-secondary-500 group-hover:text-secondary-700"
                    }`} 
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-secondary-200">
          <div className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-secondary-900">Admin User</p>
              <p className="text-xs text-secondary-500">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar (Overlay)
  const MobileSidebar = () => (
    <div className="lg:hidden">
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="GraduationCap" className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-xl font-bold text-secondary-900">EduTrack</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg text-secondary-500 hover:text-secondary-700 hover:bg-secondary-100"
                >
                  <ApperIcon name="X" className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <nav className="flex-1 px-4 space-y-1">
              {navigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                        : "text-secondary-700 hover:bg-secondary-100 hover:text-secondary-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <ApperIcon 
                        name={item.icon} 
                        className={`mr-3 h-5 w-5 transition-colors ${
                          isActive ? "text-white" : "text-secondary-500 group-hover:text-secondary-700"
                        }`} 
                      />
                      {item.name}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </motion.div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;