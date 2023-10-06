import express from 'express';
import cors from 'cors'
import DatabaseConnection from './config/databaseConfig';
import Route from './routers';
import path from 'path';
import 'dotenv/config'

const app: express.Application = express();

app.set('views', path.join(__dirname, '../src', 'views'));
app.set('view engine', 'ejs');


// Database Connection
DatabaseConnection();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/', Route);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Application is running on PORT ${port}`)
})

export default app;