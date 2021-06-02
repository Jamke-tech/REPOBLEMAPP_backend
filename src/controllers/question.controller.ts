import {Request, Response} from 'express'
import path from 'path';
import fs from 'fs-extra';
import Question from '../models/Question';

export async function addFaq(req: Request, res: Response): Promise<Response> {

    const { question, answer } = req.body;
    console.log(req.body);

    const newFaq = {
        question: question,
        answer: answer}
    
    try{
        const faq = new Question(newFaq);
        await faq.save();
        return res.json({
            code:'201',
            message:'added ok',
            faq: faq
        })
    }
    catch (error){
        return res.json({
            code:'500',
            message:'error',
            faq: null
        })
    }
}

export async function getFaqs(req: Request, res: Response): Promise<Response> {
    try{
      const Questions = await Question.find().populate();
      
      return res.json({
        code: '200',
        message: 'List of FAQS',
        questionsList: Questions
      }
        );
    }
    catch{
      return res.json({
        code: '500',
        message: 'Server Down or BBDD broken',
        questionsList: null
      }
        );
    }
  
  }