const internModel = require("../models/internModels");
const collegeModel = require("../models/collegeModels");
//const validateEmail = require("email-validator")
const validateEmail=/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
let validMobile = /^[6-9]\d{9}$/  //validating the mobile number (starting from 6 also considerd)

const isValid=function(val){
    if(typeof val==='undefined'|| val ==null) return false
    if(typeof val!=='string')return false
    if(typeof val==='string' && val.trim().length==0)return false
    return true
}

const createIntern = async function (req, res) {
    try {
        let userRequest = req.body;
        //check body empty or not
        if (Object.keys(userRequest).length == 0) {
            res.status(201).send({ status: false, data: "Keys is req to create Intern" });
        }
        let { name, email, mobile, collegeName } = userRequest
        if (!isValid(name)) return res.status(400).send({ status: false, message: "name is req" });
        if (!isValid(email)) return res.status(400).send({ status: false, message: "email is req" });
        if (!validMobile.test(mobile)) return res.status(400).send({ status: false, message: "mobile number should contain only numeric numbers and must contain 10 numbers" });
        if (!isValid(collegeName)) return res.status(400).send({ status: false, message: "collegeName is req" });

        //email formate check
        if (!validateEmail.test(email)) return res.status(400).send({ status: false, message: "email should be in right formate" });

        let uniqueName = await internModel.findOne({ $or: [{ email: email }, { mobile: mobile }] })
        if (uniqueName) {
            if (uniqueName.email == email) return res.status(400).send({ stastus: false, message: "email is already exist" })
            if (uniqueName.mobile == mobile) return res.status(400).send({ stastus: false, message: "mobile is already exist" })

        }


        // console.log(collegeName)
        let collegeData = await collegeModel.findOne({ fullName: collegeName })
            .select({ _id: 1 })
        console.log(collegeData)

        let collegeId = collegeData._id
        console.log(collegeId)

        let data = { name, email, mobile, collegeId }

        let internData = await internModel.create(data);

        res.status(201).send({ status: true, data: internData });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createIntern = createIntern;