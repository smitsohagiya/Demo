import User from "../models/User";

export async function UserFindWithEmail(_email:string){
    const  existUser = await User.findOne({
        email: _email
    })
     if(existUser){
        return existUser
     }
     return null;
}


export async function UserFindWithId(_id:object){
    const  existUser = await User.findOne({
        _id
    }).select('-user_password')
     if(existUser){
        return existUser
     }
     return null;
}

