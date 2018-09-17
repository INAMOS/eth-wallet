const app=require('./config/server');

app.listen(app.get('port'),()=>{

    console.log('Server listen on port '+app.get('port'));

});

