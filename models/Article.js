const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Article
var Article = new Schema({
  title: { type: String, required: true},
  body: { type: String, required: true },
},
{
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
},
{
    collection: 'articles'
});

module.exports = mongoose.model('Article', Article);
