var Schema, Setting, SettingSchema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

SettingSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  header: {
    content: String,
    body: String
  },
  footer: {
    content: String,
    body: String
  }
});

Setting = mongoose.model("Setting", SettingSchema);

module.exports = {
  Setting: Setting,
  Schema: SettingSchema
};
