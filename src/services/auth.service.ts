import bcrypt from 'bcryptjs';
import User from '../models/user.schema';
import jwt from 'jsonwebtoken';

const registerUser = async (email: string, password: string, role: string, name: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword, role, name });
  return await user.save();
};

const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  return { user: user, token, message: 'Login successful' };
};

export { registerUser, loginUser }; 