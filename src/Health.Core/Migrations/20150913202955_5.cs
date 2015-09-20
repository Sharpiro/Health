using Microsoft.Data.Entity.Migrations;

namespace Health.Core.Migrations
{
    public partial class _5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "MealNumber",
                table: "Meal",
                isNullable: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "MealNumber",
                table: "Meal",
                isNullable: true);
        }
    }
}
