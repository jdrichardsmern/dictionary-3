const mongoose = require('mongoose');
const moment = require('moment');

const CommentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'word' },
  comment: { type: String, required: true },
  date: {
    type: String,
    default: () => moment().format('dddd, MMMM Do YYYY, h:mm:ss a')
  },
  synonyms: [String]
});

module.exports = mongoose.model('comment', CommentSchema);
