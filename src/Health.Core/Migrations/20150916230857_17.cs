using Microsoft.Data.Entity.Migrations;

namespace Health.Core.Migrations
{
    public partial class _17 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MealEntryNumber",
                table: "MealEntry",
                isNullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "MealEntryNumber", table: "MealEntry");
        }
    }
}
