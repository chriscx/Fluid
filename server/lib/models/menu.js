var Menu, MenuSchema, Schema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

MenuSchema = new Schema({
  name: String,
  route: String,
  description: String
});

Menu = mongoose.model("Menu", MenuSchema);

module.exports = {
  Menu: Menu,
  Schema: MenuSchema
};
