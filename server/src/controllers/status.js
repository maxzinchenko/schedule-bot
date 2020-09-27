const index = async (req, res) => {
  await res.status(200).json({ status: 'OK' });
};

module.exports = { index };
