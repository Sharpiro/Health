CREATE TABLE [dbo].[UsersFoods]
(
	[UserId] INT NOT NULL,
	[FoodId] INT NOT NULL

	CONSTRAINT PK_UsersFoods PRIMARY KEY CLUSTERED (UserId, FoodId)
	CONSTRAINT FK_UsersFoods_Users FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers (Id)
	CONSTRAINT FK_UsersFoods_Foods FOREIGN KEY (FoodId) REFERENCES dbo.Foods (Id)
)