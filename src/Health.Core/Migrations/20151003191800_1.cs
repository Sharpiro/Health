using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;
using Microsoft.Data.Entity.SqlServer.Metadata;

namespace Health.Core.Migrations
{
    public partial class _1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Day",
                columns: table => new
                {
                    Created = table.Column<DateTime>(isNullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Day", x => x.Created);
                });
            migrationBuilder.CreateTable(
                name: "Food",
                columns: table => new
                {
                    Id = table.Column<int>(isNullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerIdentityStrategy.IdentityColumn),
                    Calories = table.Column<int>(isNullable: false),
                    Carbs = table.Column<int>(isNullable: false),
                    Fat = table.Column<int>(isNullable: false),
                    Fiber = table.Column<int>(isNullable: true),
                    Name = table.Column<string>(isNullable: false),
                    Potassium = table.Column<int>(isNullable: true),
                    Protein = table.Column<int>(isNullable: false),
                    ServingName = table.Column<string>(isNullable: true),
                    ServingSize = table.Column<int>(isNullable: false),
                    Sodium = table.Column<int>(isNullable: true),
                    Sugar = table.Column<int>(isNullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Food", x => x.Id);
                });
            migrationBuilder.CreateTable(
                name: "Meal",
                columns: table => new
                {
                    Id = table.Column<int>(isNullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerIdentityStrategy.IdentityColumn),
                    DayId = table.Column<DateTime>(isNullable: false),
                    MealNumber = table.Column<int>(isNullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Meal", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Meal_Day_DayId",
                        column: x => x.DayId,
                        principalTable: "Day",
                        principalColumn: "Created");
                });
            migrationBuilder.CreateTable(
                name: "MealEntry",
                columns: table => new
                {
                    Id = table.Column<int>(isNullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerIdentityStrategy.IdentityColumn),
                    Calories = table.Column<int>(isNullable: false),
                    FoodId = table.Column<int>(isNullable: false),
                    MealEntryNumber = table.Column<int>(isNullable: false),
                    MealId = table.Column<int>(isNullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MealEntry", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MealEntry_Food_FoodId",
                        column: x => x.FoodId,
                        principalTable: "Food",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_MealEntry_Meal_MealId",
                        column: x => x.MealId,
                        principalTable: "Meal",
                        principalColumn: "Id");
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("MealEntry");
            migrationBuilder.DropTable("Food");
            migrationBuilder.DropTable("Meal");
            migrationBuilder.DropTable("Day");
        }
    }
}
