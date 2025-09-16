import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import StatCard from "@/components/molecules/StatCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";
import { teacherService } from "@/services/api/teacherService";
import { classService } from "@/services/api/classService";

const Reports = () => {
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState("overview");

  const loadReportsData = async () => {
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
      setError(err.message || "Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportsData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadReportsData} />;

  const getEnrollmentByGrade = () => {
    const gradeData = students.reduce((acc, student) => {
      if (student.status === "Active") {
        acc[student.grade] = (acc[student.grade] || 0) + 1;
      }
      return acc;
    }, {});
    
    return Object.entries(gradeData).map(([grade, count]) => ({
      grade,
      count
    })).sort((a, b) => a.grade.localeCompare(b.grade));
  };

  const getTeachersByDepartment = () => {
    const deptData = teachers.reduce((acc, teacher) => {
      if (teacher.status === "Active") {
        acc[teacher.department] = (acc[teacher.department] || 0) + 1;
      }
      return acc;
    }, {});
    
    return Object.entries(deptData).map(([department, count]) => ({
      department,
      count
    }));
  };

  const getClassUtilization = () => {
    return classes.map(classItem => ({
      name: classItem.name,
      enrolled: classItem.studentIds.length,
      capacity: classItem.capacity,
      utilization: Math.round((classItem.studentIds.length / classItem.capacity) * 100)
    })).sort((a, b) => b.utilization - a.utilization);
  };

  const activeStudents = students.filter(s => s.status === "Active").length;
  const inactiveStudents = students.filter(s => s.status === "Inactive").length;
  const activeTeachers = teachers.filter(t => t.status === "Active").length;
  const totalEnrollments = classes.reduce((sum, c) => sum + c.studentIds.length, 0);
  const averageClassSize = classes.length > 0 ? Math.round(totalEnrollments / classes.length) : 0;

  const enrollmentByGrade = getEnrollmentByGrade();
  const teachersByDepartment = getTeachersByDepartment();
  const classUtilization = getClassUtilization();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-secondary-900">Reports & Analytics</h2>
          <p className="text-secondary-600">Overview of school statistics and performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="w-48"
          >
            <option value="overview">Overview Report</option>
            <option value="enrollment">Enrollment Report</option>
            <option value="classes">Class Reports</option>
          </Select>
          <Button variant="secondary">
            <ApperIcon name="Download" className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
          value={classes.length}
          icon="BookOpen"
          color="warning"
          trend={5.1}
        />
        <StatCard
          title="Avg. Class Size"
          value={averageClassSize}
          icon="Users"
          color="info"
          trend={-2.1}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Student Enrollment by Grade
            </h3>
            <div className="space-y-3">
              {enrollmentByGrade.map((item) => (
                <div key={item.grade} className="flex items-center justify-between">
                  <span className="text-secondary-700">{item.grade} Grade</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                        style={{ 
                          width: `${(item.count / Math.max(...enrollmentByGrade.map(g => g.count))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-secondary-900 w-8">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Teachers by Department
            </h3>
            <div className="space-y-3">
              {teachersByDepartment.map((item) => (
                <div key={item.department} className="flex items-center justify-between">
                  <span className="text-secondary-700">{item.department}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-secondary-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                        style={{ 
                          width: `${(item.count / Math.max(...teachersByDepartment.map(d => d.count))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-secondary-900 w-8">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Class Utilization
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-secondary-200">
                  <th className="text-left py-3 px-4 font-medium text-secondary-700">
                    Class Name
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-700">
                    Enrolled
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-700">
                    Capacity
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-secondary-700">
                    Utilization
                  </th>
                </tr>
              </thead>
              <tbody>
                {classUtilization.map((classItem) => (
                  <tr key={classItem.name} className="border-b border-secondary-100">
                    <td className="py-3 px-4 text-secondary-900">{classItem.name}</td>
                    <td className="py-3 px-4 text-center text-secondary-700">
                      {classItem.enrolled}
                    </td>
                    <td className="py-3 px-4 text-center text-secondary-700">
                      {classItem.capacity}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-16 bg-secondary-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              classItem.utilization >= 90
                                ? "bg-red-500"
                                : classItem.utilization >= 70
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${classItem.utilization}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-secondary-900">
                          {classItem.utilization}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <Card className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="Users" className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 mb-1">Student Status</h3>
          <div className="text-sm text-secondary-600">
            <div>Active: {activeStudents}</div>
            <div>Inactive: {inactiveStudents}</div>
          </div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="BookOpen" className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 mb-1">Total Subjects</h3>
          <div className="text-2xl font-bold text-secondary-900">
            {[...new Set(classes.map(c => c.subject))].length}
          </div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ApperIcon name="GraduationCap" className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-secondary-900 mb-1">Total Enrollments</h3>
          <div className="text-2xl font-bold text-secondary-900">
            {totalEnrollments}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Reports;