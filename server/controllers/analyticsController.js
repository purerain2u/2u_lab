const PageAnalytics = require('../models/PageAnalytics');
const User = require('../models/User');
const { AppError } = require('../utils/errorClasses');
const logger = require('../utils/logger');

exports.recordPageView = async (req, res, next) => {
  try {
    const { pageType, visitorId } = req.body;
    
    let analytics = await PageAnalytics.findOne({ pageType, date: new Date().toISOString().split('T')[0] });
    
    if (!analytics) {
      analytics = new PageAnalytics({
        pageType,
        date: new Date().toISOString().split('T')[0],
        visitorMetrics: {
          totalVisitors: 1,
          uniqueVisitors: 1
        }
      });
    } else {
      analytics.visitorMetrics.totalVisitors += 1;
      if (!analytics.visitorMetrics.uniqueVisitorIds.includes(visitorId)) {
        analytics.visitorMetrics.uniqueVisitors += 1;
        analytics.visitorMetrics.uniqueVisitorIds.push(visitorId);
      }
    }

    await analytics.save();

    res.status(200).json({
      status: 'success',
      message: '페이지 뷰가 기록되었습니다.'
    });
  } catch (error) {
    logger.error(`Page view recording error: ${error.message}`);
    next(new AppError('페이지 뷰 기록 중 오류가 발생했습니다.', 500));
  }
};

exports.getPageAnalytics = async (req, res, next) => {
  try {
    const { pageType, startDate, endDate } = req.query;
    
    const analytics = await PageAnalytics.find({
      pageType,
      date: { $gte: startDate, $lte: endDate }
    });

    res.status(200).json({
      status: 'success',
      data: { analytics }
    });
  } catch (error) {
    logger.error(`Page analytics fetch error: ${error.message}`);
    next(new AppError('페이지 분석 데이터 조회 중 오류가 발생했습니다.', 500));
  }
};

exports.getUserAnalytics = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError('해당 사용자를 찾을 수 없습니다.', 404));
    }

    const analytics = {
      serviceUsage: user.serviceUsage,
      contentCreationInsights: user.contentCreationInsights,
      performanceMetrics: user.performanceMetrics
    };

    res.status(200).json({
      status: 'success',
      data: { analytics }
    });
  } catch (error) {
    logger.error(`User analytics fetch error: ${error.message}`);
    next(new AppError('사용자 분석 데이터 조회 중 오류가 발생했습니다.', 500));
  }
};

exports.getOverallAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ 'accountStatus.isActive': true });
    const totalPageViews = await PageAnalytics.aggregate([
      { $group: { _id: null, total: { $sum: '$visitorMetrics.totalVisitors' } } }
    ]);

    const analytics = {
      totalUsers,
      activeUsers,
      totalPageViews: totalPageViews[0]?.total || 0
    };

    res.status(200).json({
      status: 'success',
      data: { analytics }
    });
  } catch (error) {
    logger.error(`Overall analytics fetch error: ${error.message}`);
    next(new AppError('전체 분석 데이터 조회 중 오류가 발생했습니다.', 500));
  }
};

exports.updateUserAnalytics = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { serviceUsage, contentCreationInsights, performanceMetrics } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          'serviceUsage.aiAnalysisUsed': serviceUsage?.aiAnalysisUsed || 0,
          'serviceUsage.trendPredictionsViewed': serviceUsage?.trendPredictionsViewed || 0,
          'serviceUsage.contentOptimizationsApplied': serviceUsage?.contentOptimizationsApplied || 0
        },
        $set: {
          contentCreationInsights,
          performanceMetrics
        }
      },
      { new: true }
    );

    if (!user) {
      return next(new AppError('해당 사용자를 찾을 수 없습니다.', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    logger.error(`User analytics update error: ${error.message}`);
    next(new AppError('사용자 분석 데이터 업데이트 중 오류가 발생했습니다.', 500));
  }
};