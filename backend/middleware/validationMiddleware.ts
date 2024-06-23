import z from "zod";
import { Request, Response, NextFunction } from "express";

const usernameSchema = z.string().email();
const passwordSchema = z.string().min(8);
const handleSchema = z.string();

const userSignup = z.object({
    username:usernameSchema,
    password:passwordSchema,
    handle:handleSchema
})

const userSignin = z.object({
    username:usernameSchema,
    password:passwordSchema
})

function signupValidation(req:Request,res:Response,next:NextFunction){
    const signUp = req.body;
    const response = userSignup.safeParse(signUp);
    if(response.success)
        next();
    else
    res.status(403).json({message:"Invalid Inputs"});
}

function signinValidation(req:Request,res:Response,next:NextFunction){
    const signIn = req.body;
    const response = userSignin.safeParse(signIn);
    if(response.success)
        next();
    else
    res.status(403).json({message:"Invalid Inputs"});
}

export {signinValidation, signupValidation};

