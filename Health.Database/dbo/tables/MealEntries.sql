CREATE TABLE [dbo].[MealEntries]
(
	[Id] INT NOT NULL IDENTITY (1,1),
    [MealEntryNumber] INT NOT NULL, 
    [MealId] INT NOT NULL, 
    [FoodId] INT NOT NULL, 
    [Calories] INT NOT NULL,
	[TimeStamp] DATETIME

	CONSTRAINT [PK_MealEntries] PRIMARY KEY CLUSTERED ([Id] ASC)
	CONSTRAINT [FK_MealEntries_Meals] FOREIGN KEY ([MealId]) REFERENCES [dbo].[Meals]([Id]) ON DELETE CASCADE
	CONSTRAINT [FK_MealEntries_Foods] FOREIGN KEY ([FoodId]) REFERENCES [dbo].[Foods]([Id])
)
GO

CREATE UNIQUE NONCLUSTERED INDEX IX_MealEntries_X ON dbo.MealEntries (MealEntryNumber, MealId)