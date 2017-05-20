CREATE TABLE [AspNetRoles] (
    [Id] int NOT NULL,
    [ConcurrencyStamp] nvarchar(max),
    [Name] nvarchar(256),
    [NormalizedName] nvarchar(256),
    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
);
GO
CREATE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]);