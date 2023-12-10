const express=require('express');
const app=express();
require('./startup/validation')();
require('./startup/db')();

require('./startup/routes')(app);

var port=process.env.PORT || 4000;
app.listen(port,()=>{
    console.log(`server started on port number ${port}`);
})