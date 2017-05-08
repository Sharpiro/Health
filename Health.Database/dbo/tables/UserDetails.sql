CREATE TABLE [dbo].[UserDetails]
(
	[UserId] INT NOT NULL,
	[TargetCalories] INT

	CONSTRAINT PK_UserDetails PRIMARY KEY CLUSTERED ([UserId])
	CONSTRAINT FK_UserDetails_Users FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers (Id)
)