using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace Health.Core.Migrations
{
    public partial class _15 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Meal_Day_DayCreated", table: "Meal");
            migrationBuilder.DropColumn(name: "DayCreated", table: "Meal");
            migrationBuilder.AlterColumn<int>(
                name: "MealId",
                table: "MealEntry",
                isNullable: false);
            migrationBuilder.AddColumn<DateTime>(
                name: "DayId",
                table: "Meal",
                isNullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
            migrationBuilder.AddForeignKey(
                name: "FK_Meal_Day_DayId",
                table: "Meal",
                column: "DayId",
                principalTable: "Day",
                principalColumn: "Created");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Meal_Day_DayId", table: "Meal");
            migrationBuilder.DropColumn(name: "DayId", table: "Meal");
            migrationBuilder.AlterColumn<int>(
                name: "MealId",
                table: "MealEntry",
                isNullable: true);
            migrationBuilder.AddColumn<DateTime>(
                name: "DayCreated",
                table: "Meal",
                isNullable: true);
            migrationBuilder.AddForeignKey(
                name: "FK_Meal_Day_DayCreated",
                table: "Meal",
                column: "DayCreated",
                principalTable: "Day",
                principalColumn: "Created");
        }
    }
}
