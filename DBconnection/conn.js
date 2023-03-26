const mongoose = require("mongoose");
const DBName = process.env.DataBaseName;

(async () => {
  try {
    module.exports = await mongoose.connect(DBName, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`connect with data base succesfuly`)
  } catch (error) {
    console.log(error);
  }
})();
