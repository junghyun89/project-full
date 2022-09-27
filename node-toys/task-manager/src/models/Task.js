const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  todo: {
    type: String,
    required: [true, 'must provide todo'],
    trim: true,
    maxlength: [20, 'todo can not be more than 20 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Task', TaskSchema);
