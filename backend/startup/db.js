const mongoose=require('mongoose');
module.exports=()=>{
    mongoose.connect("mongodb+srv://wablepratiksha1903:qwert12345@budget.zdbobut.mongodb.net/?retryWrites=true&w=majority")
    .then(()=> console.log("successfully connected to mongoDB"))
    .catch((err)=>console.log("error :" + err));
}