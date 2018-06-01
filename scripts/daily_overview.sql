declare @test table (
	[MealEntryNumber] int,
	[MealNumber] int,
	[FoodName] nvarchar(50),
	[ServingSize] int,
	[ServingCalories] int,
	ServingCarbs int,
	ServingProtein int,
	[Multiplier] float,
	ConsumedServingSize float,
	[ConsumedCalories] int,
	 ConsumedCarbs float,
	 ConsumedProtein float,
	 ConsumedFat float,
	[TimeStamp] datetime,
	[Date] datetime
);

;with cte as (
	SELECT TOP (1000) 
		  [MealEntryNumber]
		  ,m.MealNumber
		  ,f.Name 'FoodName'
		  ,f.ServingSize
		  ,f.Calories 'ServingCalories'
		  ,f.Carbs 'ServingCarbs'
		  ,f.Protein 'ServingProtein'
		  ,f.Fat 'ServingFat'
		  ,(me.[Calories] * 1.0 / f.Calories) 'Multiplier'
		  ,me.[Calories] 'ConsumedCalories'
		  ,[TimeStamp],
		  d.Date
	  FROM [dbo].[MealEntries] me
	  inner join dbo.Meals m
	  on m.Id = me.MealId
	  inner join dbo.Days d
	  on m.DayId = d.Id
	  inner join dbo.Foods f
	  on me.FoodId = f.Id
	  WHERE d.Date = '2018-05-30 00:00:00.000'
)
INSERT INTO @test
select 
	[MealEntryNumber]
	,[MealNumber]
	,[FoodName]
	,[ServingSize]
	,[ServingCalories]
	,ServingCarbs
	,ServingProtein
	,[Multiplier]
	,Multiplier * ServingSize 'ConsumedServingSize'
	,[ConsumedCalories]
	, Multiplier * ServingCarbs 'ConsumedCarbs'
	, Multiplier * ServingProtein 'ConsumedProtein'
	, Multiplier * ServingFat 'ConsumedFat'
	,[TimeStamp]
	,[Date]
 from cte

SELECT * FROM @test

SELECT 
	SUM(ConsumedCarbs) 'GramsCarbs',
	SUM(ConsumedProtein) 'GramsProtein',
	SUM(ConsumedFat) 'GramsFat'
From @test

SELECT 
	SUM(ConsumedCarbs) * 4 'CarbsMacros',
	SUM(ConsumedProtein) * 4 'ProteinMacros',
	SUM(ConsumedFat) * 9 'FatMacros'
From @test