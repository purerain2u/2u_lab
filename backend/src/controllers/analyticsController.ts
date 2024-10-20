import { Request, Response } from 'express';
import PageAnalytics, { IPageAnalytics } from '../models/PageAnalytics';

export const recordPageVisit = async (req: Request, res: Response) => {
  try {
    const { userId, pageType, metrics } = req.body;

    let pageAnalytics = await PageAnalytics.findOne({ userId, pageType });

    if (!pageAnalytics) {
      pageAnalytics = new PageAnalytics({ userId, pageType });
    }

    pageAnalytics.metrics = pageAnalytics.metrics || {};
    pageAnalytics.metrics.visits = (pageAnalytics.metrics.visits || 0) + 1;
    pageAnalytics.metrics.uniqueVisitors = (pageAnalytics.metrics.uniqueVisitors || 0) + 1;
    pageAnalytics.metrics.pageViews = (pageAnalytics.metrics.pageViews || 0) + 1;
    pageAnalytics.metrics.bounceRate = metrics.bounceRate || 0;

    await pageAnalytics.save();

    res.status(200).json({ message: '페이지 방문이 기록되었습니다.' });
  } catch (error) {
    console.error('Error recording page visit:', error);
    res.status(500).json({ message: '페이지 방문 기록 중 오류가 발생했습니다.' });
  }
};

export const getPageAnalytics = async (req: Request, res: Response) => {
  try {
    const { userId, pageType } = req.query;

    const pageAnalytics = await PageAnalytics.findOne({ userId, pageType });

    if (!pageAnalytics) {
      return res.status(404).json({ message: '해당 페이지의 분석 데이터를 찾을 수 없습니다.' });
    }

    res.status(200).json(pageAnalytics);
  } catch (error) {
    console.error('Error fetching page analytics:', error);
    res.status(500).json({ message: '페이지 분석 데이터 조회 중 오류가 발생했습니다.' });
  }
};

export const updatePageAnalytics = async (req: Request, res: Response) => {
  try {
    const { userId, pageType } = req.params;
    const updateData = req.body;

    const pageAnalytics = await PageAnalytics.findOneAndUpdate(
      { userId, pageType },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!pageAnalytics) {
      return res.status(404).json({ message: '해당 페이지의 분석 데이터를 찾을 수 없습니다.' });
    }

    res.status(200).json(pageAnalytics);
  } catch (error) {
    console.error('Error updating page analytics:', error);
    res.status(500).json({ message: '페이지 분석 데이터 업데이트 중 오류가 발생했습니다.' });
  }
};

export const deletePageAnalytics = async (req: Request, res: Response) => {
  try {
    const { userId, pageType } = req.params;

    const result = await PageAnalytics.findOneAndDelete({ userId, pageType });

    if (!result) {
      return res.status(404).json({ message: '해당 페이지의 분석 데이터를 찾을 수 없습니다.' });
    }

    res.status(200).json({ message: '페이지 분석 데이터가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    console.error('Error deleting page analytics:', error);
    res.status(500).json({ message: '페이지 분석 데이터 삭제 중 오류가 발생했습니다.' });
  }
};