import { Request, Response } from "express";
import { extractTextFromInput } from "../utils/extractText";

interface FileRequest extends Request {
  file?: Express.Multer.File;
}

export async function summarizeText(req:Request,res:Response) {
    try{
        const text=await extractTextFromInput({
            text:req.body.text,
            fileBuffer:req.file?.buffer,
        })
        const summary = `Summary (demo): ${text.slice(0, 200)}...`;
        res.json({summary})
    }    
    catch(error){
        res.status(400).json({error:(error as Error).message})
    }
}