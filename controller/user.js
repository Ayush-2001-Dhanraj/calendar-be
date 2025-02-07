const getUser = (req, res) => {
  return res.status(200).json({ msg: "working" });
};
const deleteUser = (req, res) => {};
const updateEmail = (req, res) => {};

export { getUser, deleteUser, updateEmail };
