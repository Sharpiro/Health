///<reference path="../Lib/definitelyTyped/angular/angular.d.ts"/>

var app = angular.module("app", ["iosDblclick", "ui.router"]);

app.config(["$stateProvider", "$urlRouterProvider", ($stateProvider: any, $urlRouterProvider: any) =>
{
    $urlRouterProvider.otherwise("/history");

    $stateProvider
        .state("nutrition", {
            url: "/nutrition",
            templateUrl: "app/templates/nutritionTemplate.html",
            controller: "nutritionController"
        })
        .state("foodList", {
            url: "/foodlist",
            templateUrl: "app/templates/foodListTemplate.html",
            controller: "foodListController"
        })
        .state("history", {
            url: "/history",
            templateUrl: "app/templates/historyTemplate.html",
            controller: "historyController"
        })
        .state("login", {
            url: "/login",
            templateUrl: "app/templates/loginTemplate.html",
            controller: "loginController"
        });
}]);