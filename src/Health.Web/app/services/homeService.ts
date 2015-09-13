class HomeService
{
    constructor(private $http: ng.IHttpService)
    {

    }

    public getData(): ng.IPromise<any>
    {
        return this.$http.get("/api/values/GetManufacturers");
    }

    public login(userName: string, password: string): ng.IPromise<any>
    {
        var config = "grant_type=password&username=" + userName + "&password=" + password;
        return this.$http.post("/token", config, { headers: { "content-type": "application/x-www-form-urlencoded" } });
    }

    public getProtectedData(accessToken: string): ng.IPromise<any> {
        return this.$http.get("/api/admin/getdata", { headers: { "Authorization" : ` Bearer ${accessToken}` } });
    }
}

app.service("homeService", ["$http", HomeService]);