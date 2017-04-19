CREATE TABLE [AspNetUserClaims] (
    [Id] int NOT NULL IDENTITY,
    [ClaimType] nvarchar(max),
    [ClaimValue] nvarchar(max),
    [UserId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
);
GO
CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);