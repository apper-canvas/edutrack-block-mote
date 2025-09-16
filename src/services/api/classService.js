import classesData from "@/services/mockData/classes.json";

let classes = [...classesData];

const delay = () => new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));

export const classService = {
  async getAll() {
    await delay();
    return [...classes];
  },

  async getById(id) {
    await delay();
    const classItem = classes.find(c => c.Id === parseInt(id));
    if (!classItem) {
      throw new Error("Class not found");
    }
    return { ...classItem };
  },

  async create(classData) {
    await delay();
    const newId = Math.max(...classes.map(c => c.Id)) + 1;
    const newClass = { ...classData, Id: newId };
    classes.push(newClass);
    return { ...newClass };
  },

  async update(id, classData) {
    await delay();
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes[index] = { ...classData, Id: parseInt(id) };
    return { ...classes[index] };
  },

  async delete(id) {
    await delay();
    const index = classes.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Class not found");
    }
    classes.splice(index, 1);
    return true;
  }
};