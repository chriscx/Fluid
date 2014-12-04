var Schema, Setting, SettingSchema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

SettingSchema = new Schema({
  id: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  name: {
    type: String,
    required: true
  },
  description: String
});

Setting = mongoose.model("Setting", SettingSchema);

module.exports = {
  Setting: Setting,
  Schema: SettingSchema
};
