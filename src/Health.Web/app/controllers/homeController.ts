class HomeController
{
    constructor(private scope: any, private homeService: HomeService)
    {
        scope.vm = this;
        scope.userName = "sharpiro";
        scope.password = "password";
    }

    public login(userName: string, password: string): void
    {
        this.clearMessage();
        this.homeService.login(userName, password).then((data) =>
        {
            this.scope.accessToken = data.data.access_token;
            this.scope.message = `${data.status}: ${data.statusText}`;
            this.scope.data = data.data.access_token;
            console.log(data);
            return null;
        }, (error) =>
            {
                this.scope.message = `${error.status}: ${error.statusText}`;
            });
    }

    public getProtectedData(): void
    {
        this.clearMessage();
        this.homeService.getProtectedData(this.scope.accessToken).then((data) =>
        {
            console.log(data.data);
            this.scope.message = `${data.status}: ${data.statusText}`;
            this.scope.data = data.data;
            return null;
        }, (error) =>
            {
                this.scope.message = `${error.status}: ${error.statusText}`;
            });
    }

    public clearMessage()
    {
        this.scope.message = "";
    }
}

app.controller("homeController", ["$scope", "homeService", HomeController]);