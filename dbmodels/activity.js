const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var schema = new Schema({
  "ActivityId": {type: String, required: true},
  "QRCode": {type: String, required: true},
  "CustomerId": {type: String, required: true},
  "StoreId": {type: String, required: true},
  "StoreStockId": {type: String, required: true},
  "StartDateTime": {type: Date, required: true},
  "EndDateTime": {type: Date, required: true},
  "TimesToUse": {type: Number, required: true},
  "NotificationEmail1": {type: String, required: true},
  "NotificationEmail2": {type: String, required: true}
});

module.exports = mongoose.model("Message", schema);
