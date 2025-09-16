export const teacherService = {
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "subjects_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('teacher_c', params);
      
      if (!response.success) {
        console.error("Error fetching teachers:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching teachers:", error?.response?.data?.message || error);
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
          {"field": {"Name": "first_name_c"}},
          {"field": {"Name": "last_name_c"}},
          {"field": {"Name": "email_c"}},
          {"field": {"Name": "phone_c"}},
          {"field": {"Name": "subjects_c"}},
          {"field": {"Name": "hire_date_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };

      const response = await apperClient.getRecordById('teacher_c', id, params);
      
      if (!response.success) {
        console.error(`Error fetching teacher ${id}:`, response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching teacher ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(teacherData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: teacherData.first_name_c + ' ' + teacherData.last_name_c,
          first_name_c: teacherData.first_name_c,
          last_name_c: teacherData.last_name_c,
          email_c: teacherData.email_c,
          phone_c: teacherData.phone_c,
          subjects_c: Array.isArray(teacherData.subjects_c) ? teacherData.subjects_c.join(',') : teacherData.subjects_c,
          hire_date_c: teacherData.hire_date_c,
          department_c: teacherData.department_c,
          status_c: teacherData.status_c
        }]
      };

      const response = await apperClient.createRecord('teacher_c', params);
      
      if (!response.success) {
        console.error("Error creating teacher:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} teachers:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating teacher:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, teacherData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: teacherData.first_name_c + ' ' + teacherData.last_name_c,
          first_name_c: teacherData.first_name_c,
          last_name_c: teacherData.last_name_c,
          email_c: teacherData.email_c,
          phone_c: teacherData.phone_c,
          subjects_c: Array.isArray(teacherData.subjects_c) ? teacherData.subjects_c.join(',') : teacherData.subjects_c,
          hire_date_c: teacherData.hire_date_c,
          department_c: teacherData.department_c,
          status_c: teacherData.status_c
        }]
      };

      const response = await apperClient.updateRecord('teacher_c', params);
      
      if (!response.success) {
        console.error("Error updating teacher:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} teachers:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating teacher:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('teacher_c', params);
      
      if (!response.success) {
        console.error("Error deleting teacher:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} teachers:`, failed);
        }
        return failed.length === 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting teacher:", error?.response?.data?.message || error);
      throw error;
    }
  }
};