
import { useState } from "react";
import { APIConfiguration } from "@/hooks/admin/settings/api/apiKeyManagement";

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
