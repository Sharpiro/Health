CREATE TABLE [dbo].[UserHistory]
(
	[Id] INT NOT NULL,
	[UserId] INT NOT NULL,
	[TargetCalories] INT NOT NULL,
	[CurrentWeight] INT NOT NULL,
	[TimeStamp] DATETIME NOT NULL DEFAULT GETUTCDATE()

	CONSTRAINT PK_UserHistory PRIMARY KEY CLUSTERED ([Id])
	CONSTRAINT FK_UserHistory_Users FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers (Id)
)