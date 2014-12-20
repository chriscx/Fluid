var Schema, Setting, SettingSchema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

SettingSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  value: String
});

Setting = mongoose.model("Setting", SettingSchema);

module.exports = {
  Setting: Setting,
  Schema: SettingSchema
};
