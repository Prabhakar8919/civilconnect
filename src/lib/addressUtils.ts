export interface AddressFields {
  house_number?: string;
  plot_number?: string;
  street?: string;
  area?: string;
  village?: string;
  mandal?: string;
  district?: string;
  city?: string;
  state?: string;
}

export const formatAddress = (address: Partial<AddressFields>): string => {
  const parts: string[] = [];
  
  // Add house/plot number
  if (address.house_number) parts.push(`H.No: ${address.house_number}`);
  if (address.plot_number) parts.push(`Plot: ${address.plot_number}`);
  
  // Add street and area
  if (address.street) parts.push(address.street);
  if (address.area) parts.push(address.area);
  
  // Add village and mandal
  if (address.village) parts.push(address.village);
  if (address.mandal) parts.push(`${address.mandal} Mandal`);
  
  // Add district, city, state
  if (address.district) parts.push(address.district);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  
  return parts.join(', ') || 'Location not specified';
};

export const formatCompactAddress = (address: Partial<AddressFields>): string => {
  const parts: string[] = [];
  
  // For compact display, prioritize key fields
  if (address.area) parts.push(address.area);
  if (address.village) parts.push(address.village);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  
  return parts.join(', ') || 'Location not specified';
};
