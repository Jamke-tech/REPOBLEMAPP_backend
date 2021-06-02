import {Schema,model,Document, Mongoose, Types} from 'mongoose';
var mongoose = require('mongoose');
var SchemaMongo = mongoose.Schema;

//Falta implemtnar és una base molt pobre

const schema = new Schema({
    owner: {type: SchemaMongo.ObjectId, ref: "User"},
    admin:{type: SchemaMongo.ObjectId, ref: "User",
            denormalize:['name','surname'], 
            required:true,
            propagate: true,
            populate:true
    },
    message: String,
});

var AjudaModel = mongoose.model('Ajuda',schema);

export default AjudaModel;