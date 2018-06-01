CREATE TABLE [dbo].[Foods]
(
	[Id] INT NOT NULL IDENTITY(1,1),
    [Name] NVARCHAR(50) NOT NULL, 
    [Calories] INT NOT NULL, 
    [Protein] INT NOT NULL, 
    [Fat] INT NOT NULL, 
    [Carbs] INT NOT NULL, 
    [Sugar] INT NULL, 
    [ServingSize] INT NOT NULL, 
    [ServingName] NVARCHAR(50) NULL, 
    [Fiber] INT NULL, 
    [Sodium] INT NULL, 
    [Potassium] INT NULL,
	[IsActive] BIT NOT NULL

	CONSTRAINT [PK_Foods] PRIMARY KEY CLUSTERED ([Id] ASC) ON [PRIMARY], 
)
GO


CREATE UNIQUE NONCLUSTERED INDEX [IX_Foods_Name] ON [dbo].[Foods]([Name] ASC) ON [PRIMARY]