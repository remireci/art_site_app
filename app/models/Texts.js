// models/Texts.js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const textSchema = new Schema({
  title: String,
  subtitle: String,
  text: String,
  url: String,
  edition_url: String,
  html_content: String  
});

// Specify the collection name explicitly when creating the model
module.exports = mongoose.models.Text || mongoose.model('Text', textSchema, "DWR_Texts");

