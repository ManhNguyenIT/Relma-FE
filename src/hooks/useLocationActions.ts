import { useState, useCallback } from 'react';
import { useLocationsApi } from '../services/locations';
import { Location, UpdateLocationCommand } from '../types/api';

export const useLocationActions = () => {
  const { updateLocation, deleteLocations } = useLocationsApi();
  const [isEditing, setIsEditing] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const handleEdit = useCallback((location: Location) => {
    setEditingLocation(location);
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingLocation(null);
    setIsEditing(false);
  }, []);

  const handleSaveEdit = useCallback(
    async (data: UpdateLocationCommand) => {
      try {
        console.log('Updating location with data:', data);
        const result = await updateLocation(data);
        console.log('Update result:', result);
        setIsEditing(false);
        setEditingLocation(null);
        return true;
      } catch (error) {
        console.error('Failed to update location:', error);
        return false;
      }
    },
    [updateLocation],
  );

  const handleDelete = useCallback((ids: string[]) => {
    setDeletingIds(ids);
    setIsDeleting(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      console.log('Deleting locations with IDs:', deletingIds);
      const result = await deleteLocations(deletingIds);
      console.log('Delete result:', result);
      setIsDeleting(false);
      setDeletingIds([]);
      return true;
    } catch (error) {
      console.error('Failed to delete locations:', error);
      return false;
    }
  }, [deleteLocations, deletingIds]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleting(false);
    setDeletingIds([]);
  }, []);

  return {
    // Edit actions
    isEditing,
    editingLocation,
    handleEdit,
    handleCancelEdit,
    handleSaveEdit,

    // Delete actions
    isDeleting,
    deletingIds,
    handleDelete,
    handleConfirmDelete,
    handleCancelDelete,
  };
};
