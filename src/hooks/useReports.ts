import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Report {
  id: string;
  user_id: string;
  hazard_type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  description: string;
  immediate_actions: string | null;
  location_description: string | null;
  latitude: number | null;
  longitude: number | null;
  reporter_name: string | null;
  contact_number: string | null;
  reporter_email: string | null;
  media_files: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        return;
      }

      setReports((data as Report[]) || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    if (!user) {
      throw new Error('User must be authenticated to upload files');
    }

    const uploadPromises = files.map(async (file) => {
      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`File type ${file.type} is not allowed. Only PNG, JPG, JPEG, and MP4 files are supported.`);
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('report-media')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('report-media')
        .getPublicUrl(fileName);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const createReport = async (
    reportData: Omit<Report, 'id' | 'user_id' | 'status' | 'created_at' | 'updated_at' | 'media_files'>, 
    files?: File[]
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to create reports');
    }

    try {
      // Upload files first if any
      let mediaUrls: string[] = [];
      if (files && files.length > 0) {
        mediaUrls = await uploadFiles(files);
      }

      const { data, error } = await supabase
        .from('reports')
        .insert({
          ...reportData,
          user_id: user.id,
          media_files: mediaUrls.length > 0 ? mediaUrls : null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      // If report creation fails after files were uploaded, clean up files
      console.error('Error creating report:', error);
      throw error;
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  };

  const deleteReport = async (id: string) => {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('reports-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        () => {
          fetchReports(); // Refetch all reports on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    reports,
    loading,
    error,
    fetchReports,
    createReport,
    updateReport,
    deleteReport,
    uploadFiles,
  };
};