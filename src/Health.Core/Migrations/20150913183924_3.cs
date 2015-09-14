using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace Health.Core.Migrations
{
    public partial class _3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "FoodId",
                table: "MealEntry",
                isNullable: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "FoodId",
                table: "MealEntry",
                isNullable: true);
        }
    }
}
