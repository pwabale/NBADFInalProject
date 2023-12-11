var express = require('express');
const { BudgetType, validateBudgetType } = require('../models/budgetType');
const auth = require('../middelware/auth');
const router = express.Router();

router.post("/", [auth], async (req, res) => {
    req.body.userId = req.user._id;
    let error = validateBudgetType(req.body);
    if (error.error) return res.status(400).send(error.error.details[0].message);

    let alreadyPresentBudgetType = await BudgetType.find({ userId: req.user._id, budgetType: req.body.budgetType });
    if (alreadyPresentBudgetType.length == 0) {
        let budgetType = new BudgetType({
            userId: req.body.userId,
            budgetType: req.body.budgetType,
        });
        try {
            let result = await budgetType.save();
            return res.json({
                data: result,
                message: "success"
            });
        } catch (ex) {
            res.status(400).send(ex.message);
        }
    } else {
        res.status(400).send("You already have same budget Type");
    }

});

router.get("/", [auth], async (req, res) => {
    let result = await BudgetType.find({ userId: req.user._id });
    return res.json({
        data: result,
        message: "success"
    });
});

module.exports = router;