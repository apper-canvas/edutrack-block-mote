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
import { classService } from "@/services/api/classService";
import { teacherService } from "@/services/api/teacherService";
import { studentService } from "@/services/api/studentService";

const Classes = () => {
const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    name_c: "",
    subject_c: "",
    teacher_id_c: "",
    student_ids_c: [],
    schedule_c: "",
    room_c: "",
    capacity_c: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [classesData, teachersData, studentsData] = await Promise.all([
        classService.getAll(),
        teacherService.getAll(),
        studentService.getAll()
      ]);
      setClasses(classesData);
      setFilteredClasses(classesData);
      setTeachers(teachersData);
      setStudents(studentsData);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
let filtered = classes;

    if (searchTerm) {
      filtered = filtered.filter(classItem =>
        classItem.name_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.subject_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.room_c.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (subjectFilter !== "all") {
      filtered = filtered.filter(classItem => classItem.subject === subjectFilter);
    }

    setFilteredClasses(filtered);
  }, [classes, searchTerm, subjectFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const classData = {
        ...formData,
teacher_id_c: parseInt(formData.teacher_id_c),
        student_ids_c: formData.student_ids_c.map(id => parseInt(id)),
        capacity_c: parseInt(formData.capacity_c)
      };
      
      if (editingClass) {
        await classService.update(editingClass.Id, classData);
        toast.success("Class updated successfully!");
      } else {
        await classService.create(classData);
        toast.success("Class created successfully!");
      }
      setShowModal(false);
      setEditingClass(null);
      setFormData({
        name: "",
        subject: "",
        teacherId: "",
        studentIds: [],
        schedule: "",
        room: "",
        capacity: ""
      });
      loadData();
    } catch (err) {
      toast.error(err.message || "Failed to save class");
    }
  };

  const handleEdit = (classItem) => {
setEditingClass(classItem);
    setFormData({
      ...classItem,
      teacher_id_c: classItem.teacher_id_c?.Id || classItem.teacher_id_c?.toString() || "",
      student_ids_c: typeof classItem.student_ids_c === 'string' ? classItem.student_ids_c.split(',') : (classItem.student_ids_c || []).map(id => id.toString()),
      capacity_c: classItem.capacity_c?.toString() || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (classItem) => {
if (window.confirm(`Are you sure you want to delete ${classItem.name_c}?`)) {
      try {
        await classService.delete(classItem.Id);
        toast.success("Class deleted successfully!");
        loadData();
      } catch (err) {
        toast.error(err.message || "Failed to delete class");
      }
    }
  };

  const handleAddNew = () => {
    setEditingClass(null);
    setFormData({
      name: "",
      subject: "",
      teacherId: "",
      studentIds: [],
      schedule: "",
      room: "",
      capacity: ""
    });
    setShowModal(true);
  };

  const handleStudentSelect = (studentId) => {
const currentIds = formData.student_ids_c;
    const newIds = currentIds.includes(studentId)
      ? currentIds.filter(id => id !== studentId)
      : [...currentIds, studentId];
    setFormData({ ...formData, student_ids_c: newIds });
  };

const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.Id === (teacherId?.Id || teacherId));
    return teacher ? `${teacher.first_name_c} ${teacher.last_name_c}` : "Unknown Teacher";
  };

const getStudentNames = (studentIds) => {
    const ids = typeof studentIds === 'string' ? studentIds.split(',').map(id => parseInt(id.trim())) : studentIds;
    return ids.map(id => {
      const student = students.find(s => s.Id === id);
      return student ? `${student.first_name_c} ${student.last_name_c}` : "Unknown";
    });
  };

const subjects = [...new Set(classes.map(c => c.subject_c))];

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-secondary-900">Classes</h2>
          <p className="text-secondary-600">Manage class schedules and enrollment</p>
        </div>
        <Button onClick={handleAddNew}>
          <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
          Create Class
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
            placeholder="Search classes..."
          />
        </div>
        <Select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="w-full sm:w-48"
        >
          <option value="all">All Subjects</option>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </Select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {filteredClasses.length === 0 ? (
          <Empty
            title="No classes found"
            description="Create your first class to start managing schedules and enrollment."
            icon="BookOpen"
            action={handleAddNew}
            actionLabel="Create Class"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
<Card key={classItem.Id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">
                      {classItem.name_c}
                    </h3>
                    <Badge variant="primary">{classItem.subject_c}</Badge>
                  </div>
                  <div className="text-right text-sm text-secondary-500">
                    Room {classItem.room_c}
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="User" className="h-4 w-4 mr-2" />
                    {getTeacherName(classItem.teacher_id_c)}
                  </div>
                  <div className="flex items-center text-sm text-secondary-600">
                    <ApperIcon name="Users" className="h-4 w-4 mr-2" />
                    {typeof classItem.student_ids_c === 'string' ? classItem.student_ids_c.split(',').length : (classItem.student_ids_c || []).length} / {classItem.capacity_c} students
                  </div>
                  <div className="flex items-start text-sm text-secondary-600">
                    <ApperIcon name="Clock" className="h-4 w-4 mr-2 mt-0.5" />
                    <span className="leading-tight">{classItem.schedule_c}</span>
                  </div>
                </div>
                
                <div className="border-t border-secondary-200 pt-3">
                  <div className="mb-2">
                    <span className="text-xs text-secondary-500 uppercase tracking-wide">
                      Enrolled Students
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getStudentNames(classItem.student_ids_c).slice(0, 3).map((name, idx) => (
                      <Badge key={idx} variant="default" className="text-xs">
                        {name}
                      </Badge>
                    ))}
                    {getStudentNames(classItem.student_ids_c).length > 3 && (
                      <Badge variant="default" className="text-xs">
                        +{getStudentNames(classItem.student_ids_c).length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(classItem)}>
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(classItem)}
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
        title={editingClass ? "Edit Class" : "Create New Class"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Class Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <Select
              label="Teacher"
              value={formData.teacherId}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
              required
            >
<option value="">Select a teacher</option>
              {teachers.filter(t => t.status_c === "Active").map(teacher => (
                <option key={teacher.Id} value={teacher.Id}>
                  {teacher.first_name_c} {teacher.last_name_c}
                </option>
              ))}
            </Select>
            <Input
              label="Room"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              required
            />
            <Input
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              required
            />
          </div>
          
          <Input
            label="Schedule"
            value={formData.schedule}
            onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
            placeholder="e.g., Monday, Wednesday, Friday 9:00 AM - 10:30 AM"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Enrolled Students
            </label>
            <div className="max-h-48 overflow-y-auto border border-secondary-300 rounded-lg p-3">
              <div className="space-y-2">
{students.filter(s => s.status_c === "Active").map(student => (
                  <label key={student.Id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.student_ids_c.includes(student.Id.toString())}
                      onChange={() => handleStudentSelect(student.Id.toString())}
                      className="mr-2"
                    />
                    <span className="text-sm">
                      {student.first_name_c} {student.last_name_c} ({student.grade_c})
                    </span>
                  </label>
                ))}
              </div>
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
              {editingClass ? "Update Class" : "Create Class"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Classes;