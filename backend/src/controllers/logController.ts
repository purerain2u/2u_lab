import { Request, Response } from 'express';
import PageVisit from '../models/PageVisit';
import { AppError } from '../utils/errorClasses';
import logger from '../utils/logger';

export const logPageVisit = async (req: Request, res: Response) => {
  try {
    const { pageType, timestamp } = req.body;
    const userId = req.user ? req.user._id : null;

    const pageVisit = new PageVisit({
      userId,
      pageType,
      timestamp: new Date(timestamp)
    });

    await pageVisit.save();

    logger.info(`Page visit logged: ${pageType} by user ${userId || 'anonymous'}`);
    res.status(200).json({ message: 'Page visit logged successfully' });
  } catch (error) {
    logger.error(`Error logging page visit: ${error instanceof Error ? error.message : 'Unknown error'}`);
    res.status(500).json({ message: 'Failed to log page visit' });
  }
};