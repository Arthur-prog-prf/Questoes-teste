import { supabase } from '../lib/supabase';


// Subject Service - Handles all subject-related database operations
export const subjectService = {
  // Get all subjects with their topics for current user or public subjects
  async getSubjects() {
    try {
      const { data: subjects, error } = await supabase
        ?.from('subjects')
        ?.select(`
          id,
          name, 
          area,
          description,
          color_code,
          created_at,
          topics (
            id,
            name,
            description,
            difficulty_level,
            estimated_hours,
            is_active
          )
        `)
        ?.eq('is_active', true)
        ?.order('name');

      if (error) {
        return { data: null, error: error?.message };
      }

      return { data: subjects || [], error: null };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: 'Failed to fetch subjects. Please try again.' };
    }
  },

  // Create a new subject with topics
  async createSubject(subjectData, userId = null) {
    try {
      // First, create the subject
      const { data: subject, error: subjectError } = await supabase
        ?.from('subjects')
        ?.insert({
          name: subjectData?.name?.trim(),
          area: this.mapSubjectToArea(subjectData?.name),
          description: `Matéria de ${subjectData?.name}`,
          color_code: this.getSubjectColor(subjectData?.name),
        })
        ?.select()
        ?.single();

      if (subjectError) {
        return { data: null, error: subjectError?.message };
      }

      // If topics are provided, create them
      const topics = [];
      if (subjectData?.topics && Array.isArray(subjectData?.topics) && subjectData?.topics?.length > 0) {
        const topicsToInsert = subjectData?.topics
          ?.filter(topic => topic?.trim())
          ?.map(topic => ({
            subject_id: subject?.id,
            name: topic?.trim(),
            description: `Tópico de ${topic?.trim()}`,
            difficulty_level: 2,
            estimated_hours: 2.0,
          }));

        if (topicsToInsert?.length > 0) {
          const { data: createdTopics, error: topicsError } = await supabase
            ?.from('topics')
            ?.insert(topicsToInsert)
            ?.select();

          if (topicsError) {
            // If topics fail, we still return the subject but with error info
            return { 
              data: { ...subject, topics: [] }, 
              error: `Subject created but failed to add topics: ${topicsError?.message}` 
            };
          }

          topics?.push(...(createdTopics || []));
        }
      }

      return { 
        data: { 
          ...subject, 
          topics: topics 
        }, 
        error: null 
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return { 
          data: null, 
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.' 
        };
      }
      return { data: null, error: 'Failed to create subject. Please try again.' };
    }
  },

  // Update an existing subject
  async updateSubject(subjectId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('subjects')
        ?.update(updates)
        ?.eq('id', subjectId)
        ?.select(`
          id,
          name,
          area,
          description,
          color_code,
          topics (
            id,
            name,
            description,
            difficulty_level,
            estimated_hours,
            is_active
          )
        `)
        ?.single();

      if (error) {
        return { data: null, error: error?.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to update subject. Please try again.' };
    }
  },

  // Delete a subject (only admins can do this)
  async deleteSubject(subjectId) {
    try {
      const { error } = await supabase
        ?.from('subjects')
        ?.delete()
        ?.eq('id', subjectId);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to delete subject. Please try again.' };
    }
  },

  // Helper functions
  mapSubjectToArea(subjectName) {
    const name = subjectName?.toLowerCase()?.trim();
    const areaMap = {
      'matemática': 'matematica',
      'português': 'portugues', 
      'direito': 'direito',
      'informática': 'informatica',
      'atualidades': 'atualidades',
      'física': 'fisica',
      'química': 'quimica',
      'biologia': 'biologia',
      'história': 'historia',
      'geografia': 'geografia'
    };
    
    return areaMap?.[name] || 'matematica'; // Default fallback
  },

  getSubjectColor(subjectName) {
    const name = subjectName?.toLowerCase()?.trim();
    const colorMap = {
      'matemática': '#3B82F6',
      'português': '#10B981',
      'direito': '#8B5CF6',
      'informática': '#F59E0B',
      'atualidades': '#EF4444',
      'física': '#06B6D4',
      'química': '#84CC16',
      'biologia': '#22C55E',
      'história': '#F97316',
      'geografia': '#EC4899'
    };
    
    return colorMap?.[name] || '#3B82F6'; // Default blue
  }
};

// Topic Service - Handles topic-related operations
export const topicService = {
  // Create a new topic for a subject
  async createTopic(subjectId, topicData) {
    try {
      const { data, error } = await supabase
        ?.from('topics')
        ?.insert({
          subject_id: subjectId,
          name: topicData?.name?.trim(),
          description: topicData?.description || `Tópico de ${topicData?.name}`,
          difficulty_level: topicData?.difficulty_level || 2,
          estimated_hours: topicData?.estimated_hours || 2.0,
        })
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error: error?.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to create topic. Please try again.' };
    }
  },

  // Update an existing topic
  async updateTopic(topicId, updates) {
    try {
      const { data, error } = await supabase
        ?.from('topics')
        ?.update(updates)
        ?.eq('id', topicId)
        ?.select()
        ?.single();

      if (error) {
        return { data: null, error: error?.message };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: 'Failed to update topic. Please try again.' };
    }
  },

  // Delete a topic
  async deleteTopic(topicId) {
    try {
      const { error } = await supabase
        ?.from('topics')
        ?.delete()
        ?.eq('id', topicId);

      if (error) {
        return { success: false, error: error?.message };
      }

      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: 'Failed to delete topic. Please try again.' };
    }
  }
};
