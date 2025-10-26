import { useState, useCallback } from 'react';
import { useMaterialsApi } from '../services/materials';
import { Material, UpdateMaterialCommand } from '../types/api';

export const useMaterialActions = () => {
  const { updateMaterial, deleteMaterials } = useMaterialsApi();
  const [isEditing, setIsEditing] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const handleEdit = useCallback((material: Material) => {
    setEditingMaterial(material);
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingMaterial(null);
    setIsEditing(false);
  }, []);

  const handleSaveEdit = useCallback(
    async (data: UpdateMaterialCommand) => {
      try {
        await updateMaterial(data);
        setIsEditing(false);
        setEditingMaterial(null);
        return true;
      } catch (error) {
        console.error('Failed to update material:', error);
        return false;
      }
    },
    [updateMaterial],
  );

  const handleDelete = useCallback((ids: string[]) => {
    setDeletingIds(ids);
    setIsDeleting(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      await deleteMaterials({ ids: [] });
      setIsDeleting(false);
      setDeletingIds([]);
      return true;
    } catch (error) {
      console.error('Failed to delete materials:', error);
      return false;
    }
  }, [deleteMaterials, deletingIds]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleting(false);
    setDeletingIds([]);
  }, []);

  return {
    // Edit actions
    isEditing,
    editingMaterial,
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
