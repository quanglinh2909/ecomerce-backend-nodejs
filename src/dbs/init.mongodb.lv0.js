const mongoose = require('mongoose');
const connectString  = `mongodb://localhost:27017/mongo`;
console.log("Connect to mongodb with string: " + connectString);
mongoose.connect(connectString).then(_=>{console.log("Connect to mongodb successfully")}).catch(err=>{console.log(err)} );

if(1===0){
    mongoose.set('debug', true);
    mongoose.set('debug',{color:true})
}

module.exports = mongoose;