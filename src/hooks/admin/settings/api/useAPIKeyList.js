import { useState } from "react";
export const useAPIKeyList = (configurations) => {
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
