
// Sample data generator for metric details - in a real app this would come from an API
export const generateDetailData = (days = 14) => {
  const data = [];
  const now = new Date();
  const baseValue = Math.random() * 300 + 100;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Create some random fluctuation
    const randomFactor = Math.random() * 0.4 - 0.2; // -20% to +20%
    const value = baseValue * (1 + randomFactor);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value),
    });
  }
  
  return data;
};

// Format date for display in tooltip
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};
