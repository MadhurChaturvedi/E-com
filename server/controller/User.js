import TryCatch from "../utils/TryCatch.js";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  console.log(email);
  res.send(email);
});
