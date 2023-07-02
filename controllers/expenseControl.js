const Razorpay = require("razorpay");
const expense = require("../models/expense");
const Orders = require("../models/orders");
const user = require("../models/user");
const Leaderboard = require("../models/leaderboard");
const sequelize = require("../util/database");
const AWS = require("aws-sdk");
const Download = require("../models/download");
// req.user from auth.authorize via routes
exports.postExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const result = await expense.create(
      {
        date: req.body.date,
        description: req.body.description,
        category: req.body.category,
        income: req.body.category == "Salary" ? req.body.amount : 0,
        expense: req.body.category != "Salary" ? req.body.amount : 0,
        userId: req.user.id,
      },
      { transaction: t }
    );
    res.status(200).send(result);
    const user1 = await user.findOne({ where: { id: result.userId } });
    const response = await Leaderboard.findOne({ where: { userId: user1.id } });

    if (response) {
      await response.update(
        {
          totalIncome: parseInt(response.totalIncome) + parseInt(result.income),
          totalExpense:
            parseInt(response.totalExpense) + parseInt(result.expense),
        },
        { transaction: t }
      );
    } else {
      await Leaderboard.create(
        {
          name: user1.name + " " + user1.sur,
          totalIncome: req.body.category == "Salary" ? req.body.amount : 0,
          totalExpense: result.category != "Salary" ? result.expense : 0,
          userId: user1.id,
        },
        { transaction: t }
      );
    }
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
};

exports.deleteExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const result = await expense.findByPk(req.params.id);
    console.log(result);
    const response = await Leaderboard.findOne({
      where: { userId: result.userId },
    });
    await response.update(
      {
        totalIncome: parseInt(response.totalIncome) - parseInt(result.income),
        totalExpense:
          parseInt(response.totalExpense) - parseInt(result.expense),
      },
      { transaction: t }
    );
    res.status(200).send(result);
    await result.destroy({ transaction: t });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
};

exports.getExpense = (req, res, next) => {
  page = req.query.page;
  limit = req.query.limit;
  if (limit > 50) {
    limit = 50;
  }
  expense
    .findAll({ where: { userId: req.user.id } })
    .then((result) => {
      data = {};
      result = result.reverse();
      start = (page - 1) * limit;
      end = page * limit;
      if (page > 1) {
        data.previous = parseInt(page - 1);
      }
      data.current = parseInt(page);
      if (end < result.length) {
        data.next = parseInt(page) + 1;
      }
      data.start = start + 1;
      data.end = end;
      data.count = result.length;
      data.result = result.slice(start, end);
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getexpensePremium = async (req, res, next) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 2500;
    await rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        try {
          const t = await sequelize.transaction();
          const result = await req.user.createOrder(
            {
              orderId: order.id,
              status: "PENDING",
            },
            { transaction: t }
          );
          res.status(201).json({ order, key_id: rzp.key_id });
          await t.commit();
        } catch (error) {
          await t.rollback();
          console.log(error);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postexpenseSuccess = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const result = await Orders.findOne({
      where: { orderId: req.body.order_id },
    });
    await result.update(
      { paymentId: req.body.payment_id, status: "SUCCESS" },
      { transaction: t }
    );
    const response = await user.findOne({ where: { id: result.userId } });
    await response.update({ premiumUser: true }, { transaction: t });
    await t.commit();
  } catch (error) {
    await t.rollback();
    console.log(error);
  }
};

exports.postexpenseFail = async (req, res, next) => {
  // const t = await sequelize.transaction();
  try {
    const result = await Orders.findOne({
      where: { orderId: req.body.order_id },
    });
    result.update(
      { paymentId: "failed", status: "FAILED" }
      // { transaction: t }
    );
    // await t.commit();
  } catch (error) {
    // await t.rollback();
    console.log(error);
  }
};

exports.getpremiumLeaderboard = async (req, res, next) => {
  try {
    const result = await Leaderboard.findAll({
      order: [["totalExpense", "DESC"]],
      limit: 5,
    });
    res.status(201).send(result);
  } catch (error) {
    console.log(error);
  }
};

exports.getexpenseDownload = async (req, res, next) => {
  result = await expense.findAll({ where: { userId: req.user.id } });
  expenseData = JSON.stringify(result);
  let s3 = new AWS.S3({
    region: "ap-south-1",
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });
  s3.upload(
    {
      Bucket: "expense-tracker-s3",
      Key: `${req.user.name} Expense ${new Date()}.txt`,
      Body: expenseData,
      ACL: "public-read",
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        Download.create({
          link: data.Location,
          userId: req.user.id,
        });
        res.send(data);
      }
    }
  );
};
