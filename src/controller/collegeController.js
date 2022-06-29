const collegeModel= require("../models/collegeModels");

 let validUrl =/^(https:\/\/)[a-zA-Z\-_]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9\-_]+\.[a-zA-Z]+\.[a-zA-Z]+\/[a-zA-Z]+\/[a-zA-Z]+\.[a-zA-Z]{2,5}/
 //let validUrl=require("valid-url")



const isValid=function(val){
    if(typeof val==='undefined'|| val ==null) return false
    //if(typeof val!=='string')return false
    if(typeof val==='string' && val.trim().length==0)return false
    return true
}


const createCollege= async function(req,res){
   
   try{
    let {name,fullName,logoLink}=req.body
       let data= req.body;
        if(Object.keys(data).length===0){
            return res.status(400).send({stastus:false,message:"Invalid request parameters plz provide college details"})
 }
 if(!isValid(name)){
    return res.status(400).send({stastus:false,message:"Name is req"})
}
if(!isValid(fullName)){
    return res.status(400).send({stastus:false,message:"fullName is req"})
}

//for checking duplication
let uniqueName=await collegeModel.findOne({$or:[{name:name},{fullName:fullName}]})
if(uniqueName){
    if(uniqueName.name==name)    return res.status(400).send({stastus:false,message:"Name is already exist"})

    if(uniqueName.fullName==fullName) return res.status(400).send({stastus:false,message:"fullName is already exist"})

}

if(!isValid(logoLink)){
    return res.status(400).send({stastus:false,message:"logoLink is req"})
}
if(!validUrl.test(logoLink)){
    return res.status(400).send({stastus:false,message:"Enter Valid Url"})
}



   let collegeData= await collegeModel.create(data);
    res.status(201).send({status: true, data: collegeData});
   }catch(err){
    return res.status(500).send({stastus:false,msg:err.message})
   }
}

module.exports.createCollege = createCollege;
//module.exports={isValid}