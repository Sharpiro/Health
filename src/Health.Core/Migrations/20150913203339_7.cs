using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace Health.Core.Migrations
{
    public partial class _7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Day",
                columns: table => new
                {
                    Id = table.Column<int>(isNullable: false),
                    Created = table.Column<DateTime>(isNullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Day", x => new { x.Id, x.Created });
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("Day");
        }
    }
}
