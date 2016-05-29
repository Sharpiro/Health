SET IDENTITY_INSERT [dbo].[Foods] ON

MERGE INTO [dbo].[Foods] AS TARGET
USING (VALUES 
	(6, 120, N'Chicken', 4, 0, 1, 0, 0, 26, N'oz', 50, 0),
	(7, 184, N'Eggs', 1, 0, 10, 0, 75, 21, N'custom', 272, 0),
	(8, 100, N'Almonds', 1, 1, 9, 2, 130, 4, N'packet', 0, 1),
	(9, 105, N'Oatmeal', 1, 16, 2, 3, 105, 4, N'packet', 75, 0),
	(11, 40, N'Apple', 1, 17, 0, 5, 0, 0, N'apple', 0, 17),
	(12, 35, N'Soup', 1, 8, 0, 4, 580, 3, N'half-can', 470, 2),
	(13, 180, N'Protein Bar', 1, 4, 8, 13, 140, 20, N'bar', 170, 1),
	(14, 110, N'Beans', 130, 14, 1, 6, 400, 6, N'grams', 530, 2),
	(16, 150, N'Potatoes', 213, 34, 0, 4, 969, 4, N'grams', 38, 3),
	(17, 130, N'Cheeto-Crunch', 28, 0, 0, 0, 0, 0, N'grams', 0, 0),
	(18, 150, N'Cheeto-Puff', 28, 0, 0, 0, 0, 0, N'grams', 0, 0),
	(19, 100, N'Yasso-Pop', 1, 0, 0, 0, 0, 0, N'pop', 0, 0),
	(20, 150, N'Yasso-Bar', 1, 0, 0, 0, 0, 0, N'bar', 0, 0),
	(21, 140, N'Waffles', 2, 0, 0, 0, 0, 0, N'waffles', 0, 0),
	(22, 380, N'Strudles', 2, 0, 0, 0, 0, 0, N'strudles', 0, 0)
) AS SOURCE 
([Id], [Calories], [Name], [ServingSize], [Carbs], [Fat], [Fiber], [Potassium], [Protein], [ServingName], [Sodium], [Sugar])
ON Target.[Id] = Source.[Id]

WHEN MATCHED THEN UPDATE SET 
	[Name] = Source.[Name],
	[Calories] = Source.[Calories],
	[Protein] = Source.[Protein],
	[Fat] = Source.[Fat],
	[Carbs] = Source.[Carbs],
	[Sugar] = Source.[Sugar],
	[ServingSize] = Source.[ServingSize],
	[ServingName] = Source.[ServingName],
	[Fiber] = Source.[Fiber],
	[Sodium] = Source.[Sodium],
	[Potassium] = Source.[Potassium]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ([Id], [Name], [Calories], [Protein], [Fat], [Carbs], [Sugar], [ServingSize], [ServingName], [Fiber], [Sodium], [Potassium])
	VALUES (Source.[Id], Source.[Name], Source.[Calories], Source.[Protein], Source.[Fat], Source.[Carbs], Source.[Sugar], Source.[ServingSize], 
	Source.[ServingName], Source.[Fiber], Source.[Sodium], Source.[Potassium]);

SET IDENTITY_INSERT [dbo].[Foods] OFF