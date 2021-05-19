import {Schema,model,Document, Mongoose, Types} from 'mongoose';
var mongoose = require('mongoose');
var SchemaMongo = mongoose.Schema;

//Falta implemtnar és una base molt pobre

const schema = new Schema({
    owner: {type: SchemaMongo.ObjectId, ref: "User"},
    user:{type: SchemaMongo.ObjectId, ref: "User",
            denormalize:['name','surname'], 
            required:true,
            propagate: true,
            populate:true
    },
    offerRelated: {type: SchemaMongo.ObjectId, ref: "Offer",
            denormalize:['title','pictures'], 
            required:true,
            propagate: true,
            populate:true
                            
        },
    messages: [{
        sender: {type: SchemaMongo.ObjectId, ref: "User"},
        content: {type: String}
    }],
    
});

var ChatModel = mongoose.model('Chat',schema);

export default ChatModel;