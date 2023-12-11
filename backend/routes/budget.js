var express = require('express');
const { validateBudget, Budget, validateBudgetId } = require('../models/budget');
const auth = require('../middelware/auth');
const { validateBudgetTypeId, BudgetType } = require('../models/budgetType');
const router = express.Router();

router.post("/", [auth], async (req, res) => {
    req.body.userId = req.user._id;
    console.log(req.body);
    let error = validateBudget(req.body);
    if (error.error) return res.status(400).send(error.error.details[0].message);

    let bugetTypeCheck = await BudgetType.findById(req.body.budgetTypeId);
    if (bugetTypeCheck._id == req.body.budgetTypeId) {
        let budget = new Budget({
            userId: req.body.userId,
            budgetTypeId: req.body.budgetTypeId,
            budgetAmount: req.body.budgetAmount,
        });

        try {
            let result = await budget.save();
            result = await Budget.findById(result._id).populate("budgetTypeId");
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

router.get("/", [auth], async (req, res) => {
    let result = await Budget.find({ userId: req.user._id }).populate("budgetTypeId");
    console.log(result);
    return res.json({
        data: result,
        message: "success"
    });
});

router.get("/:budgetTypeId", [auth], async (req, res) => {
    let error = validateBudgetTypeId({ "budgetTypeId": req.params.budgetTypeId });
    if (error.error) return res.status(400).send(error.error.details[0].message);

    console.log(req.params.budgetTypeId);
    console.log(req.user._id);
    let result = await Budget.find({ userId: req.user._id, budgetTypeId: req.params.budgetTypeId }).populate("budgetTypeId");
    return res.json({
        data: result,
        message: "success"

    });
});



router.put("/:budgetId", [auth], async (req, res) => {
    let error = validateBudgetId({ budgetId: req.params.budgetId });
    if (error.error) return res.status(400).send(error.error.details[0].message);
    let budgetToBeModified = await Budget.findById(req.params.budgetId);

    if (budgetToBeModified) {
        if (budgetToBeModified.userId == req.user._id) {
            let budget = await Budget.findOneAndUpdate({ _id: req.params.budgetId }, { budgetAmount: req.body.budgetAmount}, { new: true }).populate("budgetTypeId");
            return res.json({
                data: budget,
                message: "success"
            });
        } else {
            return res.status(400).send("This Budget does not belong to you");
        }
    } else {
        return res.status(400).send("Incorrect Budget Id");
    }
});

module.exports = router;