const categoryData = require("../models/category");
const { isAdminUser } = require("../utils/adminUser");
const { createSuccessResponse, createErrorResponse } = require("../utils/responseHelper");


exports.createCategory = async (req, res) => {
    const { name ,color} = req.body;
    console.log(req.body);
    console.log(name,color);
    const token = req.headers?.authorization?.split(" ")[1];
    const isAdmin = await isAdminUser(token, res);
    if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!name || !color) {
        return res
            .status(400)
            .json({ message: "Name and Color Required !" })
    }
       const created_at = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
       const updated_at = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const catResp = await categoryData.create({
            color,name,created_at,updated_at,
            
        });

        if(catResp){
            console.log(catResp);
            res.send(createSuccessResponse(catResp));
        }
        else {
            res.send(createErrorResponse());
        }
} 


exports.updateCategory = async (req, res) => {
    const { name,created_at } = req.body;
    if (!name) {
        return res
            .status(400)
            .json({ message: "name Required !" })
    }
       const updated_at = new Date().toLocaleString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const catResp = await categoryData.updateOne({
            name,created_at,updated_at
        });

        if(catResp.acknowledged){
            console.log(catResp);
            res.send(createSuccessResponse(req.body));
        }
        else {
            res.send(createErrorResponse());
        }
} 


exports.getAllCategories = async (req, res) => {

    console.log(req.query);

    // let sortKey   =  req.query.sortKey;
    let sortOrder =  req.query.sortOrder;
    let order = -1;
    if(sortOrder === "asc"){
        order = 1
    }
    console.log(order);

        const catResp = await categoryData.find({
        }).sort({ created_at: order });

        if(catResp){
            console.log(catResp);
            res.send(createSuccessResponse(catResp));
        }
        else {
            res.send(createErrorResponse());
        }
} 


exports.deleteCategoryById = async (req, res) => {
    const { catId } = req.params;
    if (!catId) {
        return res
            .status(400)
            .json({ message: "blog Id Required !" })
    }
    const token = req.headers?.authorization?.split(" ")[1];
    const isAdmin = await isAdminUser(token, res);
    if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const catResp = await categoryData.deleteOne({_id:catId
    });

    if(catResp){
        console.log(catResp);
        res.send(createSuccessResponse(catResp));
    }
    else {
        res.send(createErrorResponse());
    }
} 