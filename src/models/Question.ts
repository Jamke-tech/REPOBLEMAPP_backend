import {Schema,model,Document, Mongoose, Types} from 'mongoose';
import { createTrue } from 'typescript';
var mongoose = require('mongoose');
var SchemaMongo = mongoose.Schema;

const schema = new Schema({
    question: String,
    answer: String,
});

var QuestionModel = mongoose.model('Question',schema);

export default  QuestionModel;