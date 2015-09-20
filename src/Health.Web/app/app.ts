///<reference path="../Lib/definitelyTyped/angular/angular.d.ts"/>

var app = angular.module("app", ["ui.router"]);

app.config(["$stateProvider", "$urlRouterProvider", ($stateProvider: any, $urlRouterProvider: any) =>
{
    $urlRouterProvider.otherwise("/foodlist");

    $stateProvider
        .state("home", {
            url: "/home",
            templateUrl: "app/templates/homeTemplate.html",
            controller: "homeController"
        }).state("nutrition", {
            url: "/nutrition",
            templateUrl: "app/templates/nutritionTemplate.html",
            controller: "nutritionController"
        })
        .state("foodList", {
            url: "/foodlist",
            templateUrl: "app/templates/foodListTemplate.html",
            controller: "foodListController"
        });
}]);