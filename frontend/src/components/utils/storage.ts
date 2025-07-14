import {del, get,set} from "idb-keyval"

export const saveText=async(text:string)=>{
    await set("notesmith_text",text)
}

export const loadText=async():Promise<string>=>{
    const stored=await get<string>("notesmith_text")
    return stored || ""
}

export const saveFile=async(file:File)=>{
    await set("notesmith_file",file)
}

export const loadFile=async():Promise<File|null>=>{
    const stored=await get<File>("notesmith_file")
    return stored || null
}

export const clearFile=async()=>{
    await del("notesmith_file")
}