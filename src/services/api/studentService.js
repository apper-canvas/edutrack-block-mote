export const studentService = {
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
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "parent_contact_c"}},
          {"field": {"Name": "address_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('student_c', params);
      
      if (!response.success) {
        console.error("Error fetching students:", response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching students:", error?.response?.data?.message || error);
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
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "enrollment_date_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "parent_contact_c"}},
          {"field": {"Name": "address_c"}}
        ]
      };

      const response = await apperClient.getRecordById('student_c', id, params);
      
      if (!response.success) {
        console.error(`Error fetching student ${id}:`, response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching student ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  async create(studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Name: studentData.first_name_c + ' ' + studentData.last_name_c,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c,
          date_of_birth_c: studentData.date_of_birth_c,
          enrollment_date_c: studentData.enrollment_date_c,
          status_c: studentData.status_c,
          grade_c: studentData.grade_c,
          parent_contact_c: studentData.parent_contact_c,
          address_c: studentData.address_c
        }]
      };

      const response = await apperClient.createRecord('student_c', params);
      
      if (!response.success) {
        console.error("Error creating student:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} students:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating student:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, studentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: parseInt(id),
          Name: studentData.first_name_c + ' ' + studentData.last_name_c,
          first_name_c: studentData.first_name_c,
          last_name_c: studentData.last_name_c,
          email_c: studentData.email_c,
          phone_c: studentData.phone_c,
          date_of_birth_c: studentData.date_of_birth_c,
          enrollment_date_c: studentData.enrollment_date_c,
          status_c: studentData.status_c,
          grade_c: studentData.grade_c,
          parent_contact_c: studentData.parent_contact_c,
          address_c: studentData.address_c
        }]
      };

      const response = await apperClient.updateRecord('student_c', params);
      
      if (!response.success) {
        console.error("Error updating student:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} students:`, failed);
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating student:", error?.response?.data?.message || error);
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

      const response = await apperClient.deleteRecord('student_c', params);
      
      if (!response.success) {
        console.error("Error deleting student:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} students:`, failed);
        }
        return failed.length === 0;
      }
      return true;
    } catch (error) {
      console.error("Error deleting student:", error?.response?.data?.message || error);
      throw error;
    }
  }
};