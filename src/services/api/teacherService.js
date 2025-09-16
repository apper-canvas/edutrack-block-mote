import teachersData from "@/services/mockData/teachers.json";

let teachers = [...teachersData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const teacherService = {
  async getAll() {
    await delay();
    return [...teachers];
  },

  async getById(id) {
    await delay();
    const teacher = teachers.find(t => t.Id === parseInt(id));
    if (!teacher) {
      throw new Error("Teacher not found");
    }
    return { ...teacher };
  },

  async create(teacherData) {
    await delay();
    const newId = Math.max(...teachers.map(t => t.Id)) + 1;
    const newTeacher = { ...teacherData, Id: newId };
    teachers.push(newTeacher);
    return { ...newTeacher };
  },

  async update(id, teacherData) {
    await delay();
    const index = teachers.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Teacher not found");
    }
    teachers[index] = { ...teacherData, Id: parseInt(id) };
    return { ...teachers[index] };
  },

  async delete(id) {
    await delay();
    const index = teachers.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Teacher not found");
    }
    teachers.splice(index, 1);
    return true;
  }
};