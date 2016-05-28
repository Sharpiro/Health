var app = angular.module("app", ["iosDblclick", "ui.router"]);
app.config(["$stateProvider", "$urlRouterProvider", function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/nutrition");
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
        });
    }]);
var NutritionDataService = (function () {
    function NutritionDataService($q, nutritionService) {
        this.$q = $q;
        this.nutritionService = nutritionService;
    }
    NutritionDataService.prototype.GetNutritionTable = function (forceUpdate) {
        var _this = this;
        var dfd = this.$q.defer();
        if (!this.nutritionTable || forceUpdate === RequestOptions.Force) {
            this.nutritionService.getNutritionTable().then(function (data) {
                _this.nutritionTable = data.data;
                dfd.resolve(data);
                return null;
            }, function (error) {
                dfd.reject(error);
            });
        }
        else {
            var dataResponse = { data: this.nutritionTable };
            dfd.resolve(dataResponse);
        }
        return dfd.promise;
    };
    NutritionDataService.prototype.getMostRecentDay = function (forceUpdate) {
        var _this = this;
        var dfd = this.$q.defer();
        if (!this.currentDay || forceUpdate === RequestOptions.Force) {
            this.nutritionService.getMostRecentDay().then(function (data) {
                _this.currentDay = data.data;
                dfd.resolve(data);
                return null;
            }, function (error) {
                dfd.reject(error);
            });
        }
        else {
            var dataResponse = { data: this.currentDay };
            dfd.resolve(dataResponse);
        }
        return dfd.promise;
    };
    NutritionDataService.prototype.getFoodById = function (foodId) {
        var food;
        this.nutritionTable.forEach(function (value) {
            if (value.Id === foodId)
                food = value.Name;
        });
        return food;
    };
    return NutritionDataService;
}());
app.service("nutritionDataService", ["$q", "nutritionService", NutritionDataService]);
var RequestOptions;
(function (RequestOptions) {
    RequestOptions[RequestOptions["Force"] = 0] = "Force";
})(RequestOptions || (RequestOptions = {}));
var NutritionService = (function () {
    function NutritionService($http) {
        this.$http = $http;
    }
    NutritionService.prototype.getAllData = function () {
        return this.$http.get("/api/nutrition/getalldata");
    };
    NutritionService.prototype.getMostRecentDay = function () {
        return this.$http.get("/api/nutrition/getmostrecentday");
    };
    NutritionService.prototype.getDayTotals = function () {
        return this.$http.get("/api/nutrition/getdaytotals");
    };
    NutritionService.prototype.getNutritionTable = function () {
        return this.$http.get("/api/nutrition/getnutritiontable");
    };
    NutritionService.prototype.addFood = function (food) {
        return this.$http.post("/api/nutrition/addfood", food);
    };
    NutritionService.prototype.addMeal = function (meal) {
        return this.$http.post("/api/nutrition/addmeal", meal);
    };
    NutritionService.prototype.addDay = function () {
        var data = {};
        return this.$http.post("/api/nutrition/addday", data);
    };
    NutritionService.prototype.clearDay = function () {
        var data = {};
        return this.$http.post("/api/nutrition/clearday", data);
    };
    NutritionService.prototype.deleteDay = function (dayId) {
        return this.$http.delete("/api/nutrition/deleteday/" + dayId);
    };
    NutritionService.prototype.deleteInvalidDays = function () {
        var data = {};
        return this.$http.post("/api/nutrition/deleteinvaliddays", data);
    };
    return NutritionService;
}());
app.service("nutritionService", ["$http", NutritionService]);
var SharedService = (function () {
    function SharedService() {
    }
    return SharedService;
}());
app.service("sharedService", ["$http", SharedService]);
var DestinyFilter = (function () {
    function DestinyFilter() {
    }
    DestinyFilter.FoodIdFilter = function (nutritionDataService) {
        return function (food) {
            var output;
            if (food) {
                var foodName = nutritionDataService.getFoodById(food.FoodId);
                output = foodName + ": " + food.Calories;
            }
            return output;
        };
    };
    return DestinyFilter;
}());
app.filter("foodIdFilter", function (nutritionDataService) { return DestinyFilter.FoodIdFilter(nutritionDataService); });
var FoodListController = (function () {
    function FoodListController(scope, nutritionService, nutritionDataService) {
        var _this = this;
        this.scope = scope;
        this.nutritionService = nutritionService;
        this.nutritionDataService = nutritionDataService;
        this.successCallBack = function (data, message) {
            _this.scope.message = data.status + ": " + data.statusText;
            _this.scope.data = data.data;
            if (message)
                toastr.success(message);
            return null;
        };
        this.errorCallBack = function (error) {
            _this.scope.message = error.status + ": " + error.statusText;
            _this.scope.data = error.data;
            console.log(error);
            toastr.error("Error!");
        };
        scope.vm = this;
        this.getNutritionData();
    }
    FoodListController.prototype.getNutritionData = function (forceUpdate) {
        var _this = this;
        this.nutritionDataService.GetNutritionTable(forceUpdate).then(function (data) {
            _this.nutritionTable = data.data;
            _this.successCallBack(data);
            return null;
        });
    };
    FoodListController.prototype.addFood = function () {
        var _this = this;
        var sco = this.scope;
        if (!sco.addFoodName || !sco.addFoodCalories)
            return;
        var food = {
            Name: sco.addFoodName,
            ServingSize: sco.addFoodServingSize,
            ServingName: sco.addFoodServingName,
            Calories: sco.addFoodCalories,
            Protein: sco.addFoodProtein,
            Fat: sco.addFoodFat,
            Carbs: sco.addFoodCarbs,
            Sugar: sco.addFoodSugar,
            Fiber: sco.addFoodFiber,
            Sodium: sco.addFoodSodium,
            Potassium: sco.addFoodPotassium
        };
        this.nutritionService.addFood(food).then(function (data) {
            _this.getNutritionData(RequestOptions.Force);
            _this.clearTextboxes();
            _this.successCallBack(data, "Succesfully Added/Updated food");
            return null;
        }, this.errorCallBack);
    };
    ;
    FoodListController.prototype.clearTextboxes = function () {
        this.scope.addFoodName = undefined;
        this.scope.addFoodServingSize = undefined;
        this.scope.addFoodServingName = undefined;
        this.scope.addFoodCalories = undefined;
        this.scope.addFoodProtein = undefined;
        this.scope.addFoodFat = undefined;
        this.scope.addFoodCarbs = undefined;
        this.scope.addFoodSugar = undefined;
        this.scope.addFoodFiber = undefined;
        this.scope.addFoodSodium = undefined;
        this.scope.addFoodPotassium = undefined;
    };
    FoodListController.prototype.setDataToTextboxes = function (index) {
        console.log(index);
        var food = this.nutritionTable[index];
        this.scope.addFoodName = food.Name;
        this.scope.addFoodServingSize = food.ServingSize;
        this.scope.addFoodServingName = food.ServingName;
        this.scope.addFoodCalories = food.Calories;
        this.scope.addFoodProtein = food.Protein;
        this.scope.addFoodFat = food.Fat;
        this.scope.addFoodCarbs = food.Carbs;
        this.scope.addFoodSugar = food.Sugar;
        this.scope.addFoodFiber = food.Fiber;
        this.scope.addFoodSodium = food.Sodium;
        this.scope.addFoodPotassium = food.Potassium;
    };
    return FoodListController;
}());
app.controller("foodListController", ["$scope", "nutritionService", "nutritionDataService", FoodListController]);
var NutritionController = (function () {
    function NutritionController(scope, nutritionService, nutritionDataService) {
        var _this = this;
        this.scope = scope;
        this.nutritionService = nutritionService;
        this.nutritionDataService = nutritionDataService;
        this.activeFood = new Food();
        this.debugObj = {};
        this.successCallBack = function (data, message) {
            _this.debugObj.data = data.data;
            _this.debugObj.message = data.status + ": " + data.statusText;
            if (message)
                toastr.success(message);
            return null;
        };
        this.errorCallBack = function (error) {
            _this.debugObj.message = error.status + ": " + error.statusText;
            _this.debugObj.data = error.data;
            console.log(error);
            toastr.error("Error: " + error.data);
        };
        scope.vm = this;
        this.getNutritionTable();
        this.getMostRecentDay();
    }
    NutritionController.prototype.getAllData = function () {
        this.nutritionService.getAllData().then(this.successCallBack, this.errorCallBack);
    };
    NutritionController.prototype.getNutritionTable = function () {
        var _this = this;
        this.nutritionDataService.GetNutritionTable().then(function (data) {
            _this.nutritionData = data.data;
            _this.selectRandomFood();
            return _this.successCallBack(data);
        }, this.errorCallBack);
    };
    NutritionController.prototype.dropDownUpdate = function (currentDropdownFoodId) {
        var _this = this;
        this.nutritionData.forEach(function (value) {
            if (value.Id === currentDropdownFoodId)
                _this.activeFood.Calories = value.Calories;
        });
    };
    NutritionController.prototype.getMostRecentDay = function (forceUpdate) {
        var _this = this;
        this.nutritionDataService.getMostRecentDay(forceUpdate).then(function (data) {
            _this.currentDay = data.data;
            _this.nutritionService.getDayTotals().then(function (innerData) {
                _this.dayTotals = innerData.data;
                _this.successCallBack(innerData);
            });
            return _this.successCallBack(data);
        }, this.errorCallBack);
    };
    NutritionController.prototype.addDay = function () {
        var _this = this;
        this.nutritionService.addDay().then(function (data) {
            _this.getMostRecentDay(RequestOptions.Force);
            return _this.successCallBack(data, "Successfully Added day.");
        }, this.errorCallBack);
    };
    NutritionController.prototype.clearDay = function () {
        var _this = this;
        this.nutritionService.clearDay().then(function (data) {
            _this.getMostRecentDay(RequestOptions.Force);
            return _this.successCallBack(data, "Successfully cleared day.");
        }, this.errorCallBack);
    };
    NutritionController.prototype.deleteDay = function () {
        var _this = this;
        this.nutritionService.deleteDay(this.currentDay.DayId).then(function (data) {
            _this.getMostRecentDay(RequestOptions.Force);
            return _this.successCallBack(data, "Successfully deleted day.");
        }, this.errorCallBack);
    };
    NutritionController.prototype.deleteInvalidDays = function () {
        var _this = this;
        this.nutritionService.deleteInvalidDays().then(function (data) {
            _this.getMostRecentDay(RequestOptions.Force);
            return _this.successCallBack(data, "Successfully deleted invalid days.");
        }, this.errorCallBack);
    };
    NutritionController.prototype.addFood = function (currentDropdownFoodId, foodCalories) {
        if (currentDropdownFoodId === undefined || foodCalories === null) {
            toastr.error("Error: Please select a food");
            return;
        }
        if (!this.nextMeal) {
            this.nextMeal = new Meal();
            this.nextMeal.date = this.currentDay.Date;
        }
        this.nextMeal.calories += foodCalories;
        this.nextMeal.mealEntries.push({
            FoodId: currentDropdownFoodId,
            Calories: foodCalories,
            MealEntryNumber: this.nextMeal.mealEntries.length + 1
        });
        this.selectRandomFood();
        console.log(this.nextMeal.mealEntries);
    };
    NutritionController.prototype.saveDay = function () {
        var _this = this;
        if (!this.nextMeal) {
            toastr.error("Error: Please enter a food");
            return;
        }
        this.nextMeal.mealNumber = this.currentDay.Meals.length + 1;
        console.log("Next Meal Number: " + this.nextMeal.mealNumber);
        this.nutritionService.addMeal(this.nextMeal).then(function (data) {
            _this.getMostRecentDay(RequestOptions.Force);
            _this.nextMeal = undefined;
            _this.successCallBack(data, "Successfully Saved Day!");
            return null;
        }, this.errorCallBack);
    };
    NutritionController.prototype.selectRandomFood = function () {
        var maxValue = this.nutritionData.length;
        var randomNumber = Math.floor(Math.random() * maxValue);
        var randomFood = this.nutritionData[randomNumber];
        this.activeFood.Calories = randomFood.Calories;
        this.activeFood.Id = randomFood.Id;
    };
    NutritionController.prototype.clearSelection = function () {
        this.activeFood.Calories = undefined;
        this.activeFood.Id = undefined;
    };
    NutritionController.prototype.clearNextMeal = function () {
        this.nextMeal = undefined;
    };
    return NutritionController;
}());
app.controller("nutritionController", ["$scope", "nutritionService", "nutritionDataService", NutritionController]);
var Food = (function () {
    function Food() {
    }
    return Food;
}());
var Meal = (function () {
    function Meal() {
        this.mealEntries = [];
        this.calories = 0;
    }
    return Meal;
}());
//# sourceMappingURL=appCombined.js.map