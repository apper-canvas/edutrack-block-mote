import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const studentService = {
  async getAll() {
    await delay();
    return [...students];
  },

  async getById(id) {
    await delay();
    const student = students.find(s => s.Id === parseInt(id));
    if (!student) {
      throw new Error("Student not found");
    }
    return { ...student };
  },

  async create(studentData) {
    await delay();
    const newId = Math.max(...students.map(s => s.Id)) + 1;
    const newStudent = { ...studentData, Id: newId };
    students.push(newStudent);
    return { ...newStudent };
  },

  async update(id, studentData) {
    await delay();
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students[index] = { ...studentData, Id: parseInt(id) };
    return { ...students[index] };
  },

  async delete(id) {
    await delay();
    const index = students.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Student not found");
    }
    students.splice(index, 1);
    return true;
  }
};