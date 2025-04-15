const Mongoose = require("mongoose")
const localDB = `mongodb+srv://kpankpand:vOTld8VCnhm6RdM8@cluster0.x2qt1pr.mongodb.net/studyZone`
const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log("MongoDB Connected")
}
module.exports = connectDB