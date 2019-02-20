const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb+srv://movie_user:cml180183@movie-api-jmxml.mongodb.net/test?retryWrites=true', {useCreateIndex: true, useNewUrlParser: true } );
    mongoose.connection.on('open', ()=> {
        console.log('MongoDB: Connected');
    });
    mongoose.connection.on('error', (err)=> {
        console.log('MongoDB: Has a error',err);
    });
    mongoose.Promise = global.Promise;
    
}