import mongoose from 'mongoose';

export const Databaseconfig = {
  databaseName: process.env.DATABASE_URL,
  databaseUrl: process.env.DATABASE_NAME
}

export const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

export default function DatabaseConnection() {
  mongoose.Promise = global.Promise;
  mongoose.set('strictQuery', true);
  mongoose.connect(process.env.DATABASE_URL, options as object)
    .then(() => {
      console.log("Mongo Connected");
    })
    .catch((error:any) => {
      console.log(error.message, error);
    });
}