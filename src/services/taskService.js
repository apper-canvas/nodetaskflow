/**
 * Task service for handling all task-related operations
 * Uses ApperClient to interact with the Apper backend
 */

// Initialize ApperClient
const initializeClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID, 
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Table name from the provided schema
const TABLE_NAME = 'task';

// Fetch all tasks with optional filtering
export const fetchTasks = async (filter = 'all') => {
  try {
    const apperClient = initializeClient();
    
    // Prepare where conditions based on filter
    let whereConditions = [
      {
        fieldName: "IsDeleted",
        operator: "ExactMatch",
        values: [false]
      }
    ];
    
    // Add status filter if not 'all'
    if (filter !== 'all') {
      whereConditions.push({
        fieldName: "status",
        operator: "ExactMatch",
        values: [filter]
      });
    }
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "dueDate" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "status" } },
        { Field: { Name: "completedOn" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "ModifiedOn" } },
        { Field: { Name: "Owner" } }
      ],
      where: whereConditions,
      orderBy: [
        {
          field: "CreatedOn",
          direction: "DESC"
        }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// Get a single task by ID
export const getTaskById = async (taskId) => {
  try {
    const apperClient = initializeClient();
    
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "dueDate" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "status" } },
        { Field: { Name: "completedOn" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "ModifiedOn" } },
        { Field: { Name: "Owner" } }
      ]
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, taskId, params);
    
    if (!response || !response.data) {
      return null;
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const apperClient = initializeClient();
    
    // Prepare task record data
    const params = {
      records: [
        {
          title: taskData.title,
          description: taskData.description || "",
          dueDate: taskData.dueDate || null,
          priority: taskData.priority || "medium",
          status: taskData.status || "not-started",
          IsDeleted: false
        }
      ]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      throw new Error("Failed to create task");
    }
    
    // Return the created task data
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  try {
    const apperClient = initializeClient();
    
    // Prepare update data
    const params = {
      records: [
        {
          Id: taskId,
          ...taskData,
          ModifiedOn: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response || !response.success) {
      throw new Error("Failed to update task");
    }
    
    // Return the updated task data
    return response.results?.[0]?.data || null;
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

// Delete a task (soft delete)
export const deleteTask = async (taskId) => {
  try {
    const apperClient = initializeClient();
    
    // Mark as deleted instead of actually deleting
    const params = {
      records: [
        {
          Id: taskId,
          IsDeleted: true,
          DeletedOn: new Date().toISOString()
        }
      ]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    return response && response.success;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};