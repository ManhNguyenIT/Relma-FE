import { useState, useCallback } from 'react';
import { useAssetsApi } from '../services/assets';
import { Asset, UpdateAssetCommand } from '../types/api';

export const useAssetActions = () => {
  const { updateAsset, deleteAssets } = useAssetsApi();
  const [isEditing, setIsEditing] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const handleEdit = useCallback((asset: Asset) => {
    setEditingAsset(asset);
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingAsset(null);
    setIsEditing(false);
  }, []);

  const handleSaveEdit = useCallback(
    async (data: UpdateAssetCommand) => {
      try {
        await updateAsset(data);
        setIsEditing(false);
        setEditingAsset(null);
        return true;
      } catch (error) {
        console.error('Failed to update asset:', error);
        return false;
      }
    },
    [updateAsset],
  );

  const handleDelete = useCallback((ids: string[]) => {
    setDeletingIds(ids);
    setIsDeleting(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    try {
      // await deleteAssets();
      setIsDeleting(false);
      setDeletingIds([]);
      return true;
    } catch (error) {
      console.error('Failed to delete assets:', error);
      return false;
    }
  }, [deleteAssets, deletingIds]);

  const handleCancelDelete = useCallback(() => {
    setIsDeleting(false);
    setDeletingIds([]);
  }, []);

  return {
    // Edit actions
    isEditing,
    editingAsset,
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
