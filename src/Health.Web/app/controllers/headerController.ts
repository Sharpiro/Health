class HeaderController
{
    private test = "Nada";

    constructor(private scope: any, private location: ng.ILocationService)
    {
        scope.vm = this;
    }

    private isActive(path: string)
    {
        const currentPath = this.location.path();
        const result = currentPath === path ? "active": null;
        return result;
    }
}

app.controller("headerController", ["$scope", "$location", HeaderController]);