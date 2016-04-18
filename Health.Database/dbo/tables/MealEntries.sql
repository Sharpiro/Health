﻿CREATE TABLE [dbo].[MealEntries]
(
	[Id] INT NOT NULL IDENTITY (1,1),
    [MealEntryNumber] INT NOT NULL, 
    [MealId] INT NOT NULL, 
    [FoodId] INT NOT NULL, 
    [Calories] INT NOT NULL

	CONSTRAINT [PK_MealEntries] PRIMARY KEY CLUSTERED ([Id] ASC) ON [Primary]
	CONSTRAINT [FK_MealEntries_Meals] FOREIGN KEY ([MealId]) REFERENCES [dbo].[Meals]([Id])
	CONSTRAINT [FK_MealEntries_Foods] FOREIGN KEY ([FoodId]) REFERENCES [dbo].[Foods]([Id])
)