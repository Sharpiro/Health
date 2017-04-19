class LoginService
{
    constructor(private $http: ng.IHttpService)
    {

    }

    public login(username: string, password: string): ng.IPromise<any>
    {
        var model = { username: username, password: password };
        return this.$http.post("/api/account/login", model);
    }

    public logout(): ng.IPromise<any>
    {
        return this.$http.put("/api/account/logout", null);
    }

    public register(username: string, password: string): ng.IPromise<any>
    {
        var model = { username: username, password: password };
        return this.$http.post("/api/account/register", model);
    }

    public getData(): ng.IPromise<any>
    {
        return this.$http.get("/api/account/getdata", null);
    }
}

app.service("loginService", ["$http", LoginService]);