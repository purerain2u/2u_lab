'use client';

import axios, { AxiosError } from 'axios';
import { debounce } from 'lodash';

interface PageVisitLoggerProps {
  pageType: string;
}

class PageVisitLogger {
  private pageType: string;
  private maxRetries: number = 3;
  private retryDelay: number = 1000; // 1초
  private debouncedLogPageVisit: () => void;

  constructor({ pageType }: PageVisitLoggerProps) {
    this.pageType = pageType;
    this.debouncedLogPageVisit = debounce(this.sendLogRequest.bind(this), 300);
  }

  private getToken(): string | null {
    return document.cookie.includes('token') ? 'token_exists' : null;
  }

  private async sendLogRequest(retryCount: number = 0): Promise<void> {
    try {
      const token = this.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['X-Token-Exists'] = 'true';
      }

      await axios.post('/api/log-visit', {
        pageType: this.pageType,
        timestamp: new Date().toISOString(),
      }, { headers, withCredentials: true });

      console.log('Page visit logged successfully');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401 && retryCount < this.maxRetries) {
          console.warn(`Authentication failed, retrying... (${retryCount + 1}/${this.maxRetries})`);
          setTimeout(() => this.sendLogRequest(retryCount + 1), this.retryDelay);
        } else {
          console.error('Failed to log page visit:', axiosError.message);
        }
      } else {
        console.error('An unexpected error occurred while logging page visit:', error);
      }
    }
  }

  public logPageVisit(): void {
    this.debouncedLogPageVisit();
  }

  public cancelPendingLogs(): void {
    (this.debouncedLogPageVisit as any).cancel();
  }
}

export default PageVisitLogger;
