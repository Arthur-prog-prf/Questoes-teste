import { supabase } from '../lib/supabase';

// Task Service - Handles all task-related database operations
export const taskService = {
  // Get all tasks for current user
  async getUserTasks(userId) {
    try {
      if (!userId) {
        return { data: [], error: null };
      }

      const { data: tasks, error } = await supabase
        ?.from('tasks')
        ?.select(`
          id,
          title,
          description,
          task_status,
          priority,
          estimated_duration,
          actual_duration,
          scheduled_date,
          scheduled_start_time,
          scheduled_end_time,
          due_date,
          completion_percentage,
          notes,
          created_at,
          updated_at,
          completed_at,
          subject:subjects(id, name, area, color_code),
          topic:topics(id, name, description)
        `)
        ?.eq('user_id', userId)
        ?.order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error?.message };
      }

      return { data: tasks || [], error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: 'Failed to fetch tasks. Please try again.' };
    }
  },

  // Create a new task
  async createTask(taskData, userId) {
    try {
      if (!userId) {
        return { data: null, error: 'User must be logged in to create tasks.' };
      }

      // Find subject by name to get subject_id
      const { data: subjects } = await supabase
        ?.from('subjects')
        ?.select('id, name')
        ?.eq('name', taskData?.subject)
        ?.limit(1);

      if (!subjects || subjects?.length === 0) {
        return { data: null, error: `Subject "${taskData?.subject}" not found. Please create the subject first.` };
      }

      const subjectId = subjects?.[0]?.id;

      // Find topic if provided
      let topicId = null;
      if (taskData?.topic && taskData?.topic?.trim()) {
        const { data: topics } = await supabase
          ?.from('topics')
          ?.select('id')
          ?.eq('subject_id', subjectId)
          ?.eq('name', taskData?.topic?.trim())
          ?.limit(1);

        if (topics && topics?.length > 0) {
          topicId = topics?.[0]?.id;
        }
      }

      // Create the task
      const { data: task, error } = await supabase
        ?.from('tasks')
        ?.insert({
          user_id: userId,
          subject_id: subjectId,
          topic_id: topicId,
          title: taskData?.topic || taskData?.subject || 'Nova Tarefa',
          description: taskData?.description || '',
          task_status: 'todo',
          priority: taskData?.priority || 'media',
          estimated_duration: taskData?.duration || 1.0,
          scheduled_date: taskData?.taskDate || null,
          scheduled_start_time: taskData?.customStartTime || null,
          scheduled_end_time: taskData?.customEndTime || null,
          notes: taskData?.notes || ''
        })
        ?.select(`
          id,
          title,
          description,
          task_status,
          priority,
          estimated_duration,
          actual_duration,
          scheduled_date,
          scheduled_start_time,
          scheduled_end_time,
          due_date,
          completion_percentage,
          notes,
          created_at,
          updated_at,
          completed_at,
          subject:subjects(id, name, area, color_code),
          topic:topics(id, name, description)
        `)
        ?.single();

      if (error) {
        return { data: null, error: error?.message };
      }

      return { data: task, error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: 'Failed to create task. Please try again.' };
    }
  },

  // Update an existing task
  async updateTask(taskId, updates, userId) {
    try {
      if (!userId) {
        return { data: null, error: 'User must be logged in to update tasks.' };
      }

      const { data: task, error } = await supabase
        ?.from('tasks')
        ?.update(updates)
        ?.eq('id', taskId)
        ?.eq('user_id', userId) // Ensure user can only update their own tasks
        ?.select(`
          id,
          title,
          description,
          task_status,
          priority,
          estimated_duration,
          actual_duration,
          scheduled_date,
          scheduled_start_time,
          scheduled_end_time,
          due_date,
          completion_percentage,
          notes,
          created_at,
          updated_at,
          completed_at,
          subject:subjects(id, name, area, color_code),
          topic:topics(id, name, description)
        `)
        ?.single();

      if (error) {
        return { data: null, error: error?.message };
      }

      return { data: task, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to update task. Please try again.' };
    }
  },

  // Delete a task
  async deleteTask(taskId, userId) {
    try {
      if (!userId) {
        return { success: false, error: 'User must be logged in to delete tasks.' };
      }

      const { error } = await supabase
        ?.from('tasks')
        ?.delete()
        ?.eq('id', taskId)
        ?.eq('user_id', userId); // Ensure user can only delete their own tasks

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to delete task. Please try again.' };
    }
  },

  // Schedule a task to a specific date and time
  async scheduleTask(taskId, scheduleData, userId) {
    try {
      if (!userId) {
        return { data: null, error: 'User must be logged in to schedule tasks.' };
      }

      const updates = {
        scheduled_date: scheduleData?.date,
        scheduled_start_time: scheduleData?.startTime,
        scheduled_end_time: scheduleData?.endTime,
        task_status: 'todo', // Reset to todo when rescheduled
        updated_at: new Date()?.toISOString()
      };

      return await this.updateTask(taskId, updates, userId);
    } catch (error) {
      return { data: null, error: 'Failed to schedule task. Please try again.' };
    }
  },

  // Get tasks for a specific date
  async getTasksForDate(userId, date) {
    try {
      if (!userId) {
        return { data: [], error: null };
      }

      const { data: tasks, error } = await supabase
        ?.from('tasks')
        ?.select(`
          id,
          title,
          description,
          task_status,
          priority,
          estimated_duration,
          actual_duration,
          scheduled_date,
          scheduled_start_time,
          scheduled_end_time,
          due_date,
          completion_percentage,
          notes,
          created_at,
          updated_at,
          completed_at,
          subject:subjects(id, name, area, color_code),
          topic:topics(id, name, description)
        `)
        ?.eq('user_id', userId)
        ?.eq('scheduled_date', date)
        ?.order('scheduled_start_time');

      if (error) {
        return { data: null, error: error?.message };
      }

      return { data: tasks || [], error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch tasks for date. Please try again.' };
    }
  },

  // Get unscheduled tasks (no scheduled_date)
  async getUnscheduledTasks(userId) {
    try {
      if (!userId) {
        return { data: [], error: null };
      }

      const { data: tasks, error } = await supabase
        ?.from('tasks')
        ?.select(`
          id,
          title,
          description,
          task_status,
          priority,
          estimated_duration,
          actual_duration,
          scheduled_date,
          scheduled_start_time,
          scheduled_end_time,
          due_date,
          completion_percentage,
          notes,
          created_at,
          updated_at,
          completed_at,
          subject:subjects(id, name, area, color_code),
          topic:topics(id, name, description)
        `)
        ?.eq('user_id', userId)
        ?.is('scheduled_date', null)
        ?.order('created_at', { ascending: false });

      if (error) {
        return { data: null, error: error?.message };
      }

      return { data: tasks || [], error: null };
    } catch (error) {
      return { data: null, error: 'Failed to fetch unscheduled tasks. Please try again.' };
    }
  }
};
