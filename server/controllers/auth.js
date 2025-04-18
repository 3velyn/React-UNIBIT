const User = require('../models/User');
const jwt = require('jsonwebtoken');

const sendAuthCookie = (user, statusCode, res) => {
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
  );
  const cookieOptions = {
    expires: new Date(
      Date.now() + (parseInt(process.env.COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'lax', 
    path: '/'
  };

  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
  }

  console.log('Setting auth cookie with options:', cookieOptions);

  user.password = undefined;

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    user
  });
};

const sendRegistrationResponse = (user, statusCode, res) => {
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    message: 'Registration successful. Please log in.',
    user
  });
};

exports.register = async (req, res) => {
  try {
    const { username, email, avatar, password } = req.body;
 
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'Email already in use' 
          : 'Username already taken'
      });
    }

    const user = await User.create({
      username,
      email,
      avatar: avatar || 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg',
      password
    });
    
    sendRegistrationResponse(user, 201, res);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('Password verified, setting cookie...');
    sendAuthCookie(user, 200, res);
    console.log('Cookie set and response sent');
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', 'logout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    path: '/'
  });

  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user data'
    });
  }
};