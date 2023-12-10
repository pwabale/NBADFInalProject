const mongoose = require('mongoose');
var Joi = require('joi');

var budgetSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    budgetTypeId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    budgetAmount: {
        type:Number,
        required:true,
    }
});

var Budget = mongoose.model("Budget", budgetSchema);


var validateBudget = (budget)=>{

    const schema = Joi.object({
        userId:Joi.objectId().required(),
        budgetTypeId:Joi.objectId().required(),
        budgetAmount:Joi.number().required()
    });
    return schema.validate(budget);
}

var validateBudgetId = (budgetId)=>{
    const schema = Joi.object({
        budgetId: Joi.objectId().required()
    });
    return schema.validate(budgetId);
}

module.exports.Budget = Budget;
module.exports.validateBudgetId = validateBudgetId;
module.exports.validateBudget = validateBudget;