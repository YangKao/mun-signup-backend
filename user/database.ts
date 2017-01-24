import {User,UserWithId,transformUserIns,UserModel} from './declare'

export const addUser = async (user:User):Promise<UserWithId> => {
  const userIns:any = await UserModel.create(user);
  return transformUserIns(userIns);
}

export const deleteUserById = async (id:number):Promise<UserWithId> => {
  const userIns:any = await UserModel.findById(id);
  const preReturn = transformUserIns(userIns);
  await userIns.destroy();
  return preReturn;
}

export const deleteUserByEmail = async (email:string):Promise<UserWithId> => {
  const userIns:any = await UserModel.findOne({where:{email:email}});
  const preReturn = transformUserIns(userIns);
  await userIns.destroy();
  return preReturn;
}

export const modUser = async (id:number,mod:any):Promise<UserWithId> => {
  const userIns:any = await UserModel.findById(id);
  for(let i in mod){
    userIns[i] = mod[i];
  }
  await userIns.save();
  return transformUserIns(userIns);
}
