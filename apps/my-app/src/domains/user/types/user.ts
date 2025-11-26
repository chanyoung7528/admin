export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  site: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
}

export type UserStatus = User['status'];
