const mongoose = require('mongoose');
var Joi = require('joi');

var budgetTypeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    budgetType:{
        type:String,
        required:true
    },
});

var BudgetType = mongoose.model("BudgetType", budgetTypeSchema);


var validateBudgetType = (budgetType)=>{
    const schema = Joi.object({
        userId:Joi.objectId().required(),
        budgetType:Joi.string().min(1).max(50).required(),
    });
    return schema.validate(budgetType);
}

var validateBudgetTypeId = (budgetTypeId)=>{
    const schema = Joi.object({
        budgetTypeId: Joi.objectId().required()
    });
    return schema.validate(budgetTypeId);
}
module.exports.validateBudgetTypeId = validateBudgetTypeId;
module.exports.BudgetType = BudgetType;
module.exports.validateBudgetType = validateBudgetType;