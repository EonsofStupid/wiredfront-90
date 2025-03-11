
import { useState } from "react";
import { APIConfiguration } from "@/types/admin/settings/api";

export const useAPIKeyList = (configurations: APIConfiguration[]) => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleOpenAddDialog = () => setShowAddDialog(true);
  const handleCloseAddDialog = () => setShowAddDialog(false);

  const hasConfigurations = configurations.length > 0;

  return {
    showAddDialog,
    handleOpenAddDialog,
    handleCloseAddDialog,
    hasConfigurations
  };
};
