let appConfig={};


appConfig.port=3000;
appConfig.allowedCorsOrigin='*';
appConfig.env="dev";
appConfig.db={
    uri:'mongodb://localhost:27017/Twitter-Clone'
}
appConfig.apiVersion='/api/v1';
appConfig.secret='senthil';

module.exports={
    port:appConfig.port,
    allowedCorsOrigin:appConfig.allowedCorsOrigin,
    environment:appConfig.env,
    db:appConfig.db,
    apiVersion:appConfig.apiVersion,
    secret:appConfig.secret
}