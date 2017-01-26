import { User, UserWithId, transformUserIns, UserModel,init } from './declare'

export {init};

export const addUser = async (user: User): Promise<UserWithId> => {
    const userIns: any = await UserModel.create(user);
    return transformUserIns(userIns);
}

export const findUserByEmail = async (email:string):Promise<UserWithId> => {
    const userIns: any = await UserModel.findOne({
        where:{
            email:email
        }
    });
    return transformUserIns(userIns);
}

export const findUserById = async (id:number):Promise<UserWithId> => {
    const userIns: any = await UserModel.findById(id);
    return transformUserIns(userIns);
}

export const deleteUserById = async (id: number): Promise<UserWithId> => {
    const userIns: any = await UserModel.findById(id);
    const preReturn = transformUserIns(userIns);
    await userIns.destroy();
    return preReturn;
}

export const modUser = async (id: number, mod: any): Promise<UserWithId> => {
    const userIns: any = await UserModel.findById(id);
    for (let i in mod) {
        userIns[i] = mod[i];
    }
    await userIns.save();
    return transformUserIns(userIns);
}

export const getUserList = async (): Promise<UserWithId[]> => {
    const userInses: any[] = await UserModel.findAll();
    return userInses.map(userIns => transformUserIns(userIns));
}

export const auth = async (email:string, password:string):Promise<boolean> => {
    const userIns: any = await UserModel.findOne({
        where:{
            email:email
        }
    });
    return userIns.get("password") === password;
}
