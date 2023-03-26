const mongoose = require('mongoose');
require('dotenv').config();
const uri =`${ process.env.MONGOURL}`;
const connect =async()=>{
   mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
}

module.exports = connect
