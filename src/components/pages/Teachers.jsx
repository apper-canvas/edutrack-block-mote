import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { teacherService } from "@/services/api/teacherService";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subjects: [],
    hireDate: "",
    department: "",
    status: "Active"
  });

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await teacherService.getAll();
      setTeachers(data);
      setFilteredTeachers(data);
    } catch (err) {
      setError(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (departmentFilter !== "all") {
      filtered = filtered.filter(teacher => teacher.department === departmentFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(teacher => teacher.status === statusFilter);
    }

    setFilteredTeachers(filtered);
  }, [teachers, searchTerm, departmentFilter, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const teacherData = {
        ...formData,
        subjects: formData.subjects.filter(s => s.trim() !== "")
      };
      
      if (editingTeacher) {
        await teacherService.update(editingTeacher.Id, teacherData);
        toast.success("Teacher updated successfully!");
      } else {
        await teacherService.create(teacherData);
        toast.success("Teacher added successfully!");
      }
      setShowModal(false);
      setEditingTeacher(null);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subjects: [],
        hireDate: "",
        department: "",
        status: "Active"
      });
      loadTeachers();
    } catch (err) {
      toast.error(err.message || "Failed to save teacher");
    }
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData(teacher);
    setShowModal(true);
  };

  const handleDelete = async (teacher) => {
    if (window.confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}?`)) {
      try {
        await teacherService.delete(teacher.Id);
        toast.success("Teacher deleted successfully!");
        loadTeachers();
      } catch (err) {
        toast.error(err.message || "Failed to delete teacher");
      }
    }
  };

  const handleAddNew = () => {
    setEditingTeacher(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subjects: [],
      hireDate: "",
      department: "",
      status: "Active"
    });
    setShowModal(true);
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = value;
    setFormData({ ...formData, subjects: newSubjects });
  };

  const addSubject = () => {
    setFormData({ ...formData, subjects: [...formData.subjects, ""] });
  };

  const removeSubject = (index) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData({ ...formData, subjects: newSubjects });
  };

  const departments = [...new Set(teachers.map(t => t.department))];

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadTeachers} />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-secondary-900">Teachers</h2>
          <p className="text-secondary-600">Manage teacher profiles and assignments</p>
        </div>
        <Button onClick={handleAddNew}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search teachers..."
          />
        </div>
        <Select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </Select>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredTeachers.length === 0 ? (
          <Empty
            title="No teachers found"
            description="Add your first teacher to get started with staff management."
            icon="UserCheck"
            action={handleAddNew}
            actionLabel="Add Teacher"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map((teacher) => (
              <Card key={teacher.Id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <p className="text-sm text-secondary-600">{teacher.department}</p>
                    </div>
                  </div>
                  <Badge variant={teacher.status === "Active" ? "success" : "default"}>
                    {teacher.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Mail" className="h-4 w-4 mr-2" />
                    {teacher.email}
                  </div>
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Phone" className="h-4 w-4 mr-2" />
                    {teacher.phone}
                  </div>
                  <div className="flex items-start text-sm text-secondary-600">
                    <ApperIcon name="BookOpen" className="h-4 w-4 mr-2 mt-0.5" />
                    <span>{teacher.subjects.join(", ")}</span>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(teacher)}>
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(teacher)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingTeacher ? "Edit Teacher" : "Add New Teacher"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              label="Department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
            <Input
              label="Hire Date"
              type="date"
              value={formData.hireDate}
              onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
              required
            />
            <div className="md:col-span-2">
              <Select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-secondary-700">
                Subjects
              </label>
              <Button type="button" variant="ghost" size="sm" onClick={addSubject}>
                <ApperIcon name="Plus" className="h-4 w-4 mr-1" />
                Add Subject
              </Button>
            </div>
            <div className="space-y-2">
              {formData.subjects.map((subject, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={subject}
                    onChange={(e) => handleSubjectChange(index, e.target.value)}
                    placeholder="Enter subject"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubject(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <ApperIcon name="X" className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingTeacher ? "Update Teacher" : "Add Teacher"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Teachers;