CREATE TABLE [AspNetRoleClaims] (
    [Id] int NOT NULL IDENTITY,
    [ClaimType] nvarchar(max),
    [ClaimValue] nvarchar(max),
    [RoleId] nvarchar(450) NOT NULL,
    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
);
GO
CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);