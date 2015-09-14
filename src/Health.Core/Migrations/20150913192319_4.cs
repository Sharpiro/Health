using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace Health.Core.Migrations
{
    public partial class _4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(name: "PK_Day", table: "Day");
            migrationBuilder.DropColumn(name: "Id", table: "Day");
            migrationBuilder.AddPrimaryKey(
                name: "PK_Day",
                table: "Day",
                column: "Created");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(name: "PK_Day", table: "Day");
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Day",
                isNullable: false,
                defaultValue: 0);
            migrationBuilder.AddPrimaryKey(
                name: "PK_Day",
                table: "Day",
                columns: new[] { "Id", "Created" });
        }
    }
}
