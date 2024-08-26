import express from 'express';
import http from 'http';
import consolidate from 'consolidate';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import routes from './routes.js';
import initialize from './socket-events.js';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json({limit: '5mb'}));

app.set('views', 'views');
app.use(express.static('./public'));

app.set('view engine', 'html');
app.engine('html', consolidate.handlebars);

const localConnection = "mongodb://root:123456@127.0.0.1:27017/uberX?authSource=admin";

mongoose.set('strictQuery', true);

(async () => {
    try {
        await mongoose.connect(localConnection);
        console.log('Connected to local MongoDB instance');
    } catch (error) {
        console.error('Error connecting to local instance');
    }
})();

app.use('/', routes);

const server = http.Server(app);
const portNumber = 3000;

server.listen(portNumber, () => {
    console.log(`Server listening at port ${portNumber}`);
    initialize(server);
});