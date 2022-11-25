import User from '../models/user.js';

export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findOne({ where: { id: userId }, raw: true });
    const { password, ...info } = user;
    return res.status(200).send(info);
  } catch (error) {
    return res.status(500).send(error);
  }
};
