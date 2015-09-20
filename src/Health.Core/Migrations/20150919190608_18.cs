using Microsoft.Data.Entity.Migrations;

namespace Health.Core.Migrations
{
    public partial class _18 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Carbs",
                table: "Food",
                isNullable: false,
                defaultValue: 0);
            migrationBuilder.AddColumn<int>(
                name: "Fat",
                table: "Food",
                isNullable: false,
                defaultValue: 0);
            migrationBuilder.AddColumn<int>(
                name: "Fiber",
                table: "Food",
                isNullable: true);
            migrationBuilder.AddColumn<int>(
                name: "Potassium",
                table: "Food",
                isNullable: true);
            migrationBuilder.AddColumn<int>(
                name: "Protein",
                table: "Food",
                isNullable: false,
                defaultValue: 0);
            migrationBuilder.AddColumn<string>(
                name: "ServingName",
                table: "Food",
                isNullable: true);
            migrationBuilder.AddColumn<int>(
                name: "Sodium",
                table: "Food",
                isNullable: true);
            migrationBuilder.AddColumn<int>(
                name: "Sugar",
                table: "Food",
                isNullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Carbs", table: "Food");
            migrationBuilder.DropColumn(name: "Fat", table: "Food");
            migrationBuilder.DropColumn(name: "Fiber", table: "Food");
            migrationBuilder.DropColumn(name: "Potassium", table: "Food");
            migrationBuilder.DropColumn(name: "Protein", table: "Food");
            migrationBuilder.DropColumn(name: "ServingName", table: "Food");
            migrationBuilder.DropColumn(name: "Sodium", table: "Food");
            migrationBuilder.DropColumn(name: "Sugar", table: "Food");
        }
    }
}
