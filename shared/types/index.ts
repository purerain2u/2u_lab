// 사용자 타입 정의
export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // 멤버십 타입 정의
  export interface Membership {
    id: string;
    userId: string;
    type: 'basic' | 'premium' | 'pro';
    startDate: Date;
    endDate: Date;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // 결제 타입 정의
  export interface Payment {
    id: string;
    userId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
  }
  
  // API 응답 타입 정의
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }