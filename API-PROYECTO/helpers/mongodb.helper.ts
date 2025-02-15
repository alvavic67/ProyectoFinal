//MongoDB import
import {MongoClient} from 'mongodb';

export default class MongoDbHelper {
    public db:any;

    private cnn:any;
    private port:number;
    private dbUri:string;
    private static _instance: MongoDbHelper;

    constructor(SETTINGS:any){
        this.port = SETTINGS.PORT;
        this.dbUri = `mongodb://${SETTINGS.USER_NAME}:${SETTINGS.USER_PASSWORD}@${SETTINGS.HOST}/${SETTINGS.DEFAULT_DATABASE}`;

    }

    public static getInstance(settings:any){
        return this._instance || (this._instance = new this(settings));
    }

    async connect(){
        await MongoClient.connect(this.dbUri, { useNewUrlParser: true, useUnifiedTopology:true})
            .then((connection:any) =>{
                this.cnn = connection;
                this.db = this.cnn.db();
                console.log('Conexion a MongoDB correcta !!!')
            })
            .catch((err:any) =>{
                console.log(`Ocurrio un error al intentar conectarse a la base de datos: `, err)
            })
    }

    setDatabase(dbName:string){
        this.db = this.cnn.db(dbName);

    }

    async close(){
        await this.cnn.close();
    }
}