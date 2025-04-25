export interface Request {
  id: string;
  purpose: string;
  destination: string;
  startTime: string;
  endTime: string;
  passengers: string;
  status: 'pending' | 'approved' | 'rejected';
  createTime: string;
  remarks?: string;
} 