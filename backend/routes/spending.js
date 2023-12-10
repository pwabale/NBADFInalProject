var express=require('express');
const auth = require('../middelware/auth');
const { validateSpending, Spending } = require('../models/spending');
const { BudgetType } = require('../models/budgetType');
const router = express.Router();

router.post("/",[auth],async(req,res)=> {
    req.body.userId = req.user._id;
    let error = validateSpending(req.body);
    if(error.error) return res.status(400).send(error.error.details[0].message);

    let bugetTypeCheck = await BudgetType.findById(req.body.budgetTypeId);
    if (bugetTypeCheck._id == req.body.budgetTypeId) {
        let spending = new Spending({
            userId:req.body.userId,
            budgetTypeId:req.body.budgetTypeId,
            amountSpent: req.body.amountSpent,
            month: req.body.month
        });
        try{
            let result = await spending.save();
            return res.send(result);
        }catch(ex){
            return res.status(400).send(ex.message);
        }
    } else {
        return res.status(400).send("Incorrect BudgetType.");
    }
})

router.get("/",[auth],async(req,res)=>{
    let result = await Spending.find({userId: req.user._id});
    return res.send(result);
})

router.get("/:month",[auth],async(req,res)=>{
    let result = await Spending.find({userId: req.user._id, month: req.params.month});
    return res.send(result);
})

module.exports=router;