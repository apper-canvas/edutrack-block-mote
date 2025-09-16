import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import SearchBar from "@/components/molecules/SearchBar";
import DataTable from "@/components/molecules/DataTable";
import Modal from "@/components/molecules/Modal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { studentService } from "@/services/api/studentService";

const Students = () => {
const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
const [formData, setFormData] = useState({
    first_name_c: "",
    last_name_c: "",
    email_c: "",
    phone_c: "",
    date_of_birth_c: "",
    enrollment_date_c: "",
    status_c: "Active",
    grade_c: "9th",
    parent_contact_c: "",
    address_c: "",
    science_marks_c: ""
  });

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await studentService.getAll();
      setStudents(data);
      setFilteredStudents(data);
    } catch (err) {
      setError(err.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student =>
        `${student.first_name_c} ${student.last_name_c}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email_c.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(student => student.status_c === statusFilter);
    }

    if (gradeFilter !== "all") {
      filtered = filtered.filter(student => student.grade_c === gradeFilter);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, statusFilter, gradeFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await studentService.update(editingStudent.Id, formData);
        toast.success("Student updated successfully!");
      } else {
        await studentService.create(formData);
        toast.success("Student added successfully!");
      }
      setShowModal(false);
      setEditingStudent(null);
setFormData({
        first_name_c: "",
        last_name_c: "",
        email_c: "",
        phone_c: "",
        date_of_birth_c: "",
        enrollment_date_c: "",
        status_c: "Active",
        grade_c: "9th",
        parent_contact_c: "",
        address_c: "",
        science_marks_c: ""
      });
      loadStudents();
    } catch (err) {
      toast.error(err.message || "Failed to save student");
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData(student);
    setShowModal(true);
  };

  const handleDelete = async (student) => {
if (window.confirm(`Are you sure you want to delete ${student.first_name_c} ${student.last_name_c}?`)) {
      try {
        await studentService.delete(student.Id);
        toast.success("Student deleted successfully!");
        loadStudents();
      } catch (err) {
        toast.error(err.message || "Failed to delete student");
      }
    }
  };

  const handleAddNew = () => {
    setEditingStudent(null);
setFormData({
      first_name_c: "",
      last_name_c: "",
      email_c: "",
      phone_c: "",
      date_of_birth_c: "",
      enrollment_date_c: "",
      status_c: "Active",
      grade_c: "9th",
      parent_contact_c: "",
      address_c: "",
      science_marks_c: ""
    });
    setShowModal(true);
  };

const columns = [
    { key: "first_name_c", label: "First Name" },
    { key: "last_name_c", label: "Last Name" },
    { key: "email_c", label: "Email" },
    { key: "grade_c", label: "Grade" },
    { key: "status_c", label: "Status" },
    { key: "enrollment_date_c", label: "Enrollment Date" }
  ];

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadStudents} />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-secondary-900">Students</h2>
          <p className="text-secondary-600">Manage student records and enrollment</p>
        </div>
        <Button onClick={handleAddNew}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Add Student
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
            placeholder="Search students..."
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Select>
        <Select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="all">All Grades</option>
          <option value="9th">9th Grade</option>
          <option value="10th">10th Grade</option>
          <option value="11th">11th Grade</option>
          <option value="12th">12th Grade</option>
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredStudents.length === 0 ? (
          <Empty
            title="No students found"
            description="Add your first student to get started with student management."
            icon="Users"
            action={handleAddNew}
            actionLabel="Add Student"
          />
        ) : (
          <DataTable
            data={filteredStudents}
            columns={columns}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </motion.div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingStudent ? "Edit Student" : "Add New Student"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<Input
              label="First Name"
              value={formData.first_name_c}
              onChange={(e) => setFormData({ ...formData, first_name_c: e.target.value })}
              required
            />
            <Input
              label="Last Name"
              value={formData.last_name_c}
              onChange={(e) => setFormData({ ...formData, last_name_c: e.target.value })}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email_c}
              onChange={(e) => setFormData({ ...formData, email_c: e.target.value })}
              required
            />
            <Input
              label="Phone"
              value={formData.phone_c}
              onChange={(e) => setFormData({ ...formData, phone_c: e.target.value })}
              required
            />
            <Input
              label="Date of Birth"
              type="date"
              value={formData.date_of_birth_c}
              onChange={(e) => setFormData({ ...formData, date_of_birth_c: e.target.value })}
              required
            />
            <Input
              label="Enrollment Date"
              type="date"
              value={formData.enrollment_date_c}
              onChange={(e) => setFormData({ ...formData, enrollment_date_c: e.target.value })}
              required
            />
            <Select
              label="Grade"
              value={formData.grade_c}
              onChange={(e) => setFormData({ ...formData, grade_c: e.target.value })}
              required
            >
              <option value="9th">9th Grade</option>
              <option value="10th">10th Grade</option>
              <option value="11th">11th Grade</option>
              <option value="12th">12th Grade</option>
            </Select>
            <Select
              label="Status"
              value={formData.status_c}
              onChange={(e) => setFormData({ ...formData, status_c: e.target.value })}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
            <Input
              label="Parent Contact"
              value={formData.parent_contact_c}
              onChange={(e) => setFormData({ ...formData, parent_contact_c: e.target.value })}
              required
            />
</div>
          <Input
            label="Address"
            value={formData.address_c}
            onChange={(e) => setFormData({ ...formData, address_c: e.target.value })}
            required
          />
          <Input
            label="Science Marks"
            type="number"
            value={formData.science_marks_c}
            onChange={(e) => setFormData({ ...formData, science_marks_c: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingStudent ? "Update Student" : "Add Student"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;