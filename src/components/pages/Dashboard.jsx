import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { teacherService } from "@/services/api/teacherService";
import { classService } from "@/services/api/classService";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      const [studentsData, teachersData, classesData] = await Promise.all([
        studentService.getAll(),
        teacherService.getAll(),
        classService.getAll()
      ]);
      setStudents(studentsData);
      setTeachers(teachersData);
      setClasses(classesData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

const activeStudents = students.filter(s => s.status_c === "Active").length;
  const activeTeachers = teachers.filter(t => t.status_c === "Active").length;
  const totalClasses = classes.length;
  const totalEnrollments = classes.reduce((sum, c) => {
    const studentIds = typeof c.student_ids_c === 'string' ? c.student_ids_c.split(',') : (c.student_ids_c || []);
    return sum + studentIds.length;
  }, 0);

  const recentActivities = [
    {
      id: 1,
      type: "student",
      message: "New student Emma Johnson enrolled",
      time: "2 hours ago",
      icon: "UserPlus"
    },
    {
      id: 2,
      type: "class",
      message: "Advanced Mathematics class updated",
      time: "4 hours ago",
      icon: "BookOpen"
    },
    {
      id: 3,
      type: "teacher",
      message: "Lisa Brown joined Arts department",
      time: "1 day ago",
      icon: "UserCheck"
    }
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Active Students"
          value={activeStudents}
          icon="Users"
          color="primary"
          trend={8.2}
        />
        <StatCard
          title="Active Teachers"
          value={activeTeachers}
          icon="UserCheck"
          color="success"
          trend={12.5}
        />
        <StatCard
          title="Total Classes"
          value={totalClasses}
          icon="BookOpen"
          color="warning"
          trend={5.1}
        />
        <StatCard
          title="Total Enrollments"
          value={totalEnrollments}
          icon="GraduationCap"
          color="info"
          trend={15.3}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">Recent Activity</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <ApperIcon name={activity.icon} className="h-4 w-4 text-primary-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-secondary-900">{activity.message}</p>
                    <p className="text-xs text-secondary-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-secondary-900">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="primary" className="h-20 flex-col">
                <ApperIcon name="UserPlus" className="h-6 w-6 mb-2" />
                Add Student
              </Button>
              <Button variant="secondary" className="h-20 flex-col">
                <ApperIcon name="UserCheck" className="h-6 w-6 mb-2" />
                Add Teacher
              </Button>
              <Button variant="outline" className="h-20 flex-col">
                <ApperIcon name="BookOpen" className="h-6 w-6 mb-2" />
                Create Class
              </Button>
              <Button variant="ghost" className="h-20 flex-col">
                <ApperIcon name="BarChart3" className="h-6 w-6 mb-2" />
                View Reports
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Class Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.slice(0, 6).map((classItem) => (
<div
                key={classItem.Id}
                className="p-4 bg-secondary-50 rounded-lg border border-secondary-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-secondary-900">{classItem.name_c}</h4>
                  <span className="text-xs text-secondary-500">Room {classItem.room_c}</span>
                </div>
                <p className="text-sm text-secondary-600 mb-2">{classItem.subject_c}</p>
                <div className="flex items-center justify-between text-xs text-secondary-500">
                  <span>
                    {typeof classItem.student_ids_c === 'string' ? classItem.student_ids_c.split(',').length : (classItem.student_ids_c || []).length} students
                  </span>
                  <span>Capacity: {classItem.capacity_c}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;