const User = require('../models/User');
const PageAnalytics = require('../models/PageAnalytics');

exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: '사용자를 찾을 수 없습니다.'
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, nickname, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        $set: { 
          'profileInfo.fullName': fullName,
          'profileInfo.nickname': nickname,
          'profileInfo.bio': bio
        }
      },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: '사용자를 찾을 수 없습니다.'
      });
    }
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

exports.getYoutubeInsights = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('youtubeChannel youtubeInsights');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.recordPageVisit = async (req, res) => {
  try {
    const { pageType, metrics } = req.body;
    await req.user.recordPageVisit(pageType, metrics);
    res.status(200).json({
      status: 'success',
      message: '페이지 방문이 기록되었습니다.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPageAnalytics = async (req, res) => {
  try {
    const analytics = await PageAnalytics.find({ userId: req.user.id }).sort('-date');
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
