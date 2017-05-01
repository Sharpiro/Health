SET IDENTITY_INSERT [dbo].[Foods] ON

MERGE INTO [dbo].[Foods] AS TARGET
USING (VALUES 
	(6, 120, N'Chicken', 4, 0, 1, 0, 0, 26, N'oz', 50, 0, 1),
	(7, 200, N'Eggs', 1, 0, 10, 0, 75, 21, N'custom', 272, 0, 1),
	(8, 100, N'Almonds', 18, 1, 9, 2, 130, 4, N'grams', 0, 1, 1),
	(9, 210, N'Oatmeal', 2, 32, 4, 6, 210, 8, N'item', 150, 0, 1),
	(11, 40, N'Apple', 1, 17, 0, 5, 0, 0, N'item', 0, 17, 1),
	(12, 35, N'Soup', 1, 8, 0, 4, 580, 3, N'half-can', 470, 2, 1),
	(13, 180, N'Protein Bar', 1, 4, 8, 13, 140, 20, N'item', 170, 1, 1),
	(14, 110, N'Beans', 130, 14, 1, 6, 400, 6, N'grams', 530, 2, 1),
	(16, 150, N'Potatoes', 213, 34, 0, 4, 969, 4, N'grams', 38, 3, 1),
	(17, 130, N'Cheeto-Crunch', 28, 20, 5, 0, 60, 2, N'grams', 230, 0, 1),
	(18, 150, N'Cheeto-Puff', 28, 16, 9, 0, 0, 2, N'grams', 290, 1, 1),
	(19, 80, N'Yasso-Pop', 1, 16, 2, 1, 0, 5, N'item', 40, 13, 1),
	(20, 150, N'Yasso-Bar', 1, 16, 8, 1, 0, 4, N'item', 40, 12, 1),
	(21, 140, N'Waffles', 2, 27, 3, 3, 110, 4, N'item', 380, 3, 1),
	(22, 360, N'Strudles', 2, 54, 14, 1, 0, 4, N'item', 360, 20, 1),
	(23, 80, N'Banana', 1, 27, 0, 3, 422, 1, N'item', 1, 14, 1),
	(24, 100, N'Cheerios', 28, 20, 2, 3, 180, 3, N'grams', 140, 1, 1),
	(25, 160, N'Yogurt', 300, 12, 0, 0, 320, 29, N'grams', 107, 12, 1)

) AS SOURCE 
([Id], [Calories], [Name], [ServingSize], [Carbs], [Fat], [Fiber], [Potassium], [Protein], [ServingName], [Sodium], [Sugar], [IsActive])
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
	[Potassium] = Source.[Potassium],
	[IsActive] = Source.[IsActive]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ([Id], [Name], [Calories], [Protein], [Fat], [Carbs], [Sugar], [ServingSize], [ServingName], [Fiber], [Sodium], [Potassium], [IsActive])
	VALUES (Source.[Id], Source.[Name], Source.[Calories], Source.[Protein], Source.[Fat], Source.[Carbs], Source.[Sugar], Source.[ServingSize], 
	Source.[ServingName], Source.[Fiber], Source.[Sodium], Source.[Potassium], Source.[IsActive]);

SET IDENTITY_INSERT [dbo].[Foods] OFF