using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HomeCareApi.DAL.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthUserLinking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AuthUserId",
                table: "Personnels",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AuthUserId",
                table: "Patients",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthUserId",
                table: "Personnels");

            migrationBuilder.DropColumn(
                name: "AuthUserId",
                table: "Patients");
        }
    }
}
