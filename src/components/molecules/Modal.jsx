import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-2xl",
    lg: "max-w-4xl",
    xl: "max-w-6xl"
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`fixed inset-0 z-50 overflow-y-auto`}
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div className={`w-full ${sizeClasses[size]} bg-white rounded-xl shadow-2xl`}>
                <div className="flex items-center justify-between p-6 border-b border-secondary-200">
                  <h3 className="text-lg font-semibold text-secondary-900">{title}</h3>
                  <Button variant="ghost" size="sm" onClick={onClose}>
                    <ApperIcon name="X" className="h-5 w-5" />
                  </Button>
                </div>
                <div className="p-6">
                  {children}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;