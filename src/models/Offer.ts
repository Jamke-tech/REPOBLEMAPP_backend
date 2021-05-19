import { truncate } from 'fs-extra';
import {Schema,model,Document, Mongoose, Types} from 'mongoose';
var mongoose = require('mongoose');
var SchemaMongo = mongoose.Schema;

const schema = new Schema({
    title: String,
    description: String,
    pictures: String,
    
        place: {type: String}, //Adreça del carrer
        village: String, //Poble
        //province: {type: String, enum: ["Girona", "Barcelona","Tarragona","LLeida"], required:true}, //Provincia

        point: { 
            type: {type: mongoose.Schema.Types.Point},
            coordinates: {type: [Number] }
        },


      
    owner: {type: SchemaMongo.ObjectId, ref: "User", populate:true},
    //tags: {type: [String], enum: ["Girona", "Barcelona","Tarragona","LLeida"], required:true},
    price: Number,
});


var OfferModel = mongoose.model('Offer',schema);
export default OfferModel;
