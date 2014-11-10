var Menu, MenuSchema, Schema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

MenuSchema = new Schema({
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
  route: String,
  description: String
}, {
  strict: true
});

Menu = mongoose.model("Menu", MenuSchema);

module.exports = {
  Menu: Menu,
  Schema: MenuSchema
};
