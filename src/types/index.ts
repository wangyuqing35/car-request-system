export interface Request {
  id: string;
  purpose: string;
  destination: string;
  passengers: string;
  startTime: string;
  endTime: string;
  createTime: string;
  remarks?: string;
  status: 'pending' | 'approved' | 'rejected';
} 