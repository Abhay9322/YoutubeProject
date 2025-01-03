import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"


const registerUser = asyncHandler( async (req,res) => {

    const {fullName,email,username,password} = req.body

    console.log("email",email)

    if (
        [fullName,email,username,password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = User.findOne({
        $or: [{username},{email}]
    })

    if (existedUser) {

        throw new ApiError(409,"User with email or username already exist")
        
    }

    const avatarlocalPath = req.files?.avatar[0]?.path
    const coverImagelocalPath = req.files?.coverImage[0]?.path


    if (!avatarlocalPath) {
        
        throw new ApiError(400,"Avatar file is required ")
    }

    const avatar = await uploadOnCloudinary(avatarlocalPath)
    const coverImage = await uploadOnCloifudinary(coverImagelocalPath)

    if (!avatar) {

        throw new ApiError(400,"Avatar file is required")
        
    }


   const user = await User.create({

        filename,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()

    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {

        throw new ApiError(500,"Something went wrong whole registering the user")
        
    }


    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registred successfully")
    )



})

export {registerUser}