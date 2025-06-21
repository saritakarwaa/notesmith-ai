import pdfParse from 'pdf-parse'

export async function extractTextFromInput(input:{text?:string; fileBuffer?:Buffer}){
    if(input.text) return input.text;
    else if(input.fileBuffer){
        const pdfData=await pdfParse(input.fileBuffer);
        return pdfData.text;
    }
    throw new Error("No valid input provided");
}