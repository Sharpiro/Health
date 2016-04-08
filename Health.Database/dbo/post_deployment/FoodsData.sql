SET IDENTITY_INSERT [dbo].[Foods] ON

MERGE INTO [dbo].[Foods] AS TARGET
USING (VALUES 
	(1, 'Food1', 1,2,3,4,5,6, 'ServingName1', 1, 2, 3),
	(2, 'Food2', 1,2,3,4,5,6, 'ServingName2', 1, 2, 3),
	(3, 'Food3', 1,2,3,4,5,6, 'ServingName3', 1, 2, 3),
	(4, 'Food4', 1,2,3,4,5,6, 'ServingName4', 1, 2, 3)
) AS SOURCE 
([Id], [Name], [Calories], [Protein], [Fat], [Carbs], [Sugar], [ServingSize], [ServingName], [Fiber], [Sodium], [Potassium])
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