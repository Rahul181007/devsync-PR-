export interface IFileStorage{
    upload(data:{
        file:Buffer;
        folder:string;
        contentType: string;
    }):Promise<string>

    delete(fileKeyOrUrl:string):Promise<void>
}