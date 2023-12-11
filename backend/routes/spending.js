var express = require('express');
const auth = require('../middelware/auth');
const { validateSpending, Spending } = require('../models/spending');
const { BudgetType } = require('../models/budgetType');
const { Budget } = require('../models/budget');
const router = express.Router();

router.post("/", [auth], async (req, res) => {
    req.body.userId = req.user._id;
    let error = validateSpending(req.body);
    if (error.error) return res.status(400).send(error.error.details[0].message);

    let bugetTypeCheck = await BudgetType.findById(req.body.budgetTypeId);
    if (bugetTypeCheck._id == req.body.budgetTypeId) {
        let spending = new Spending({
            userId: req.body.userId,
            budgetTypeId: req.body.budgetTypeId,
            amountSpent: req.body.amountSpent,
            month: req.body.month
        });
        try {
            let result = await spending.save();
            result = await Spending.findById(result._id).populate("budgetTypeId");
            return res.json({
                data: result,
                message: "success"
            });
        } catch (ex) {
            return res.status(400).send(ex.message);
        }
    } else {
        return res.status(400).send("Incorrect BudgetType.");
    }
});
router.put("/:spendingId", [auth], async (req, res) => {
    req.body.userId = req.user._id;
    let error = validateSpending(req.body);
    console.log(req.body);
    if (error.error) return res.status(400).send(error.error.details[0].message);

    let bugetTypeCheck = await BudgetType.findById(req.body.budgetTypeId);
    if (bugetTypeCheck._id == req.body.budgetTypeId) {
        let spending = await Spending.findById(req.params.spendingId);
        if (spending.userId == req.user._id) {
            spending.budgetTypeId = req.body.budgetTypeId;
            spending.amountSpent = req.body.amountSpent;
            spending.month = req.body.month;
            try {
                let result = await spending.save();
                result = await Spending.findById(result._id).populate("budgetTypeId");
                return res.json({
                    data: result,
                    message: "success"
                });
            } catch (ex) {
                return res.status(400).send(ex.message);
            }
        } else {
            return res.status(400).send("Incorrect User.");
        }
    } else {
        return res.status(400).send("Incorrect BudgetType.");
    }
}
);
router.get("/", [auth], async (req, res) => {
    let result = await Spending.find({ userId: req.user._id }).populate("budgetTypeId");

    return res.json({
        data: result,
        message: "success"
    });
});

router.get("/", [auth], async (req, res) => {
    let result = await Spending.find({ userId: req.user._id, month: req.params.month }).populate("budgetTypeId");
    return res.json({
        data: result,
        message: "success"
    });
});
router.get("/getBugetSpendingGraph", [auth], async (req, res) => {
    let budgetTypes = await BudgetType.find({ userId: req.user._id });
    let budgets = await Budget.find({ userId: req.user._id });
    let spendings = await Spending.find({ userId: req.user._id });
  
    let result = [];
  
    budgetTypes.forEach((budgetType) => {
      let budgetsFiltered = budgets.filter((budget) => {
        return budget.budgetTypeId.toString() == budgetType._id.toString();
      });
  
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
  
      let spendingsFiltered = spendings.filter((spending) => {
        return spending.budgetTypeId.toString() == budgetType._id.toString();
      });
  
      months.forEach((month) => {
        let totalMonthSpending = 0;
        spendingsFiltered.forEach((spending) => {
          if (spending.month == month) {
            totalMonthSpending = totalMonthSpending + spending.amountSpent;
          }
        });
        let eachbudgetTypeSpendingForMonth = {};
        eachbudgetTypeSpendingForMonth.budgetType = budgetType.budgetType;
        eachbudgetTypeSpendingForMonth.budgetAmount =
        budgetsFiltered.length > 0 ? budgetsFiltered[0].budgetAmount : 0;
        eachbudgetTypeSpendingForMonth.spending = totalMonthSpending;
        eachbudgetTypeSpendingForMonth.month = month;
        result.push(eachbudgetTypeSpendingForMonth);
      });
    });
  
    console.log(result);
    return res.json({
      data: result,
      message: "success",
    });
  });

module.exports = router;