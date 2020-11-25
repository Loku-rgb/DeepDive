const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  "stripeCustomerId": String, 
  "planActive": Boolean, 
  "planName": String, 
  "postCode": String,
  "address": String,
  "city": String,
  "state": String,
});
const User = mongoose.model("User", userSchema, "user");

const tagSchema = new Schema({});
const Tag = mongoose.model("Tag", tagSchema, "tag");

const invoicesSchema = new Schema( {
  "postCode": String,
  "address": String,
  "city": String,
  "state": String,
});
const Invoices = mongoose.model("Invoices", invoicesSchema, "invoices");

const contactsSchema = new Schema({});
const Contacts = mongoose.model("Contact", contactsSchema, "contacts");

const packageSchema = new Schema({});
const Package = mongoose.model("Package", packageSchema, "package");

const messageSchema = new Schema({});
const Message = mongoose.model("Message", messageSchema, "message");


const contact_metadataSchema = new Schema({});
const ContactMetadata = mongoose.model(
  "ContactMetadata",
  contact_metadataSchema,
  "contact_metadata"
);

module.exports = {
  User,
  Tag,
  Invoices,
  Contacts,
  Package,
  Message,
  ContactMetadata,
};
