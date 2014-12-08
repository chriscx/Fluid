var File, FileSchema, Schema, mongoose;

mongoose = require('mongoose');

Schema = mongoose.Schema;

FileSchema = new Schema({
  path: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  }
}, {
  strict: true
});

File = mongoose.model("File", FileSchema);

module.exports = {
  File: File,
  Schema: FileSchema
};
