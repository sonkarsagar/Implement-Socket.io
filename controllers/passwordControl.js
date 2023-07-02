const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const bcrypt=require('bcrypt')
const user = require("../models/user");
const ForgotPasswordRequests = require("../models/ForgotPasswordRequests");

exports.forgot = async (req, res, next) => {
  
  const user1 = await user.findOne({ where: { email: req.body.email } });
  if (user1) {
    uuid = uuidv4();
    await ForgotPasswordRequests.create({
      id: uuid,
      isActive: true,
      userId: user1.id,
    });
    Sib.ApiClient.instance.authentications["api-key"].apiKey =
      process.env.SENDINBLUE_API_KEY;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "sagar.citydel@gmail.com",
      name: "Expense App",
    };
    const receivers = [{ email: req.body.email }];
    try {
      const result = await tranEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: "RESET PASSWORD",
        textContent: `<h2>Click below link to reset:</h2>
        http://3.82.230.183:3000/password/resetpassword/${uuid}
            <h4>Same link will not work after the link is opened.</h4>`,
      });
    } catch (error) {
      console.log(error);
    }
    res.status(200).send("OK");
  } else {
    res.status(200).send("NOT OK");
  }
};

exports.reset = async (req, res, next) => {
  const result = await ForgotPasswordRequests.findOne({
    where: { id: req.params.id },
  });
  if (result) {
    if (result.isActive == true) {
      res
        .status(200)
        .sendFile(path.join(__dirname, '../', "views", "newPassword.html"));
      await result.update({ isActive: false });
    }
  }
};

exports.update = (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hashed) => {
    user
      .findOne({ where: { email: req.body.email } })
      .then((result) => {
        result.update({ password: hashed });
        res.send("SUCCESS");
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
