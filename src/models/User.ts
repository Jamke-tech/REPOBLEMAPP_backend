import {Schema,model,Document, Mongoose, Types} from 'mongoose';
import { createTrue } from 'typescript';
var mongoose = require('mongoose');
var SchemaMongo = mongoose.Schema;

const schema = new Schema({
    userName: { type: String , unique: true, required : true},
    name: String,
    surname: String,
    password: String,
    email: {type: String , unique: true, required: true},
    phone: Number,
    profilePhoto: String,
    birthDate: Date,
    createdOffers: [{type: SchemaMongo.ObjectId, ref: "Offer", populate: true}], //Las ofertas guardadas seran vector de Offers
    savedOffers: [{type: SchemaMongo.ObjectId, ref: "Offer", populate: true}], //Las ofertas guardadas seran vector de Offers
    social: [{type: SchemaMongo.ObjectId, ref: "Chat",populate:true, propagate:true}], //Todas las conversaciones que tiene
    role: {type: String, enum: ["USER", "ADMIN"], required:true},
    notifications: Boolean,
    privacity: Boolean,
    security: Boolean,

});

var UserModel = mongoose.model('User',schema);

export default  UserModel;

