class LoginController
{
    private vm: any;

    constructor(private _scope: any, private _loginService: LoginService, private _responseService: ResponseService)
    {
        _scope.vm = this;
    }

    private login(username: string, password: string): void
    {
        this._loginService.login(username, password).then(this._responseService.successCallBack, this._responseService.errorCallBack);
    }

    private logout(): void
    {
        this._loginService.logout().then(this._responseService.successCallBack, this._responseService.errorCallBack);
    }

    private register(username: string, password: string): void
    {
        this._loginService.register(username, password).then(this._responseService.successCallBack, this._responseService.errorCallBack);
    }

    private getData(): void
    {
        this._loginService.getData().then(this._responseService.successCallBack, this._responseService.errorCallBack);
    }
}

app.controller("loginController", ["$scope", "loginService", "responseService", LoginController]);