import { useEffect } from 'react';
import axios from 'axios';

interface PageVisitLoggerProps {
  pageType: string;
}

const PageVisitLogger: React.FC<PageVisitLoggerProps> = ({ pageType }) => {
  useEffect(() => {
    const logPageVisit = async () => {
      try {
        await axios.post('/api/log-visit', {
          pageType,
          date: new Date().toISOString()
        });
      } catch (error) {
        console.error('Failed to log page visit:', error);
      }
    };

    logPageVisit();
  }, [pageType]);

  return null;
};

export default PageVisitLogger;