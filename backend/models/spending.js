const mongoose = require('mongoose');
var Joi = require('joi');

var spendingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    budgetTypeId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    amountSpent: {
        type:Number,
        required:true,
    },
    month: {
        type:String,
        required:true,
        enum:['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December']
    }
});

var Spending = mongoose.model("Spending", spendingSchema);

const isMonthName = (value, helpers) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    // Convert the value to lowercase for case-insensitive comparison
    const lowercasedValue = value.toLowerCase();
  
    if (!monthNames.some(month => lowercasedValue.includes(month.toLowerCase()))) {
      return helpers.error('any.invalid');
    }
  
    return value;
  };

var validateSpending = (spending)=>{
    const schema = Joi.object({
        userId:Joi.objectId().required(),
        budgetTypeId:Joi.objectId().required(),
        amountSpent:Joi.number().required(),
        month:Joi.string().custom(isMonthName, 'Month Names Validation')
    });
    return schema.validate(spending);
}

module.exports.Spending = Spending;
module.exports.validateSpending = validateSpending;