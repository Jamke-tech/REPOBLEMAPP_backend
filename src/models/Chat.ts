import {Schema,model,Document, Mongoose, Types} from 'mongoose';
var mongoose = require('mongoose');
var SchemaMongo = mongoose.Schema;

//Falta implemtnar és una base molt pobre

const schema = new Schema({
    talkers: [{type: SchemaMongo.ObjectId, ref: "User"}],
    offerRelated: {type: SchemaMongo.ObjectId, ref: "Offer", required:true},
    messages: [{
        sender: {type: SchemaMongo.ObjectId, ref: "User"},
        content: {type: String}
    }],
    
});

var ChatModel = mongoose.model('Chat',schema);

export default ChatModel;