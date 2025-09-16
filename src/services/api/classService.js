export const classService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "student_ids_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "room_c"}},
          {"field": {"Name": "capacity_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('class_c', params);
      
      if (!response.success) {
        console.error("Error fetching classes:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching classes:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "subject_c"}},
          {"field": {"Name": "teacher_id_c"}},
          {"field": {"Name": "student_ids_c"}},
          {"field": {"Name": "schedule_c"}},
          {"field": {"Name": "room_c"}},
          {"field": {"Name": "capacity_c"}}
        ]
      };

      const response = await apperClient.getRecordById('class_c', id, params);
      
      if (!response.success) {
        console.error(`Error fetching class ${id}:`, response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching class ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(classData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: classData.name_c,
          name_c: classData.name_c,
          subject_c: classData.subject_c,
          teacher_id_c: parseInt(classData.teacher_id_c),
          student_ids_c: Array.isArray(classData.student_ids_c) ? classData.student_ids_c.join(',') : classData.student_ids_c,
          schedule_c: classData.schedule_c,
          room_c: classData.room_c,
          capacity_c: parseInt(classData.capacity_c)
        }]
      };

      const response = await apperClient.createRecord('class_c', params);
      
      if (!response.success) {
        console.error("Error creating class:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} classes:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating class:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, classData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: classData.name_c,
          name_c: classData.name_c,
          subject_c: classData.subject_c,
          teacher_id_c: parseInt(classData.teacher_id_c),
          student_ids_c: Array.isArray(classData.student_ids_c) ? classData.student_ids_c.join(',') : classData.student_ids_c,
          schedule_c: classData.schedule_c,
          room_c: classData.room_c,
          capacity_c: parseInt(classData.capacity_c)
        }]
      };

      const response = await apperClient.updateRecord('class_c', params);
      
      if (!response.success) {
        console.error("Error updating class:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} classes:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating class:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = { 
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('class_c', params);
      
      if (!response.success) {
        console.error("Error deleting class:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} classes:`, failed);
        }
        return failed.length === 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting class:", error?.response?.data?.message || error);
      throw error;
    }
  }
};