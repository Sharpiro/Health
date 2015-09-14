using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Migrations;
using Health.Core;
using Microsoft.Data.Entity.SqlServer.Metadata;

namespace Health.Core.Migrations
{
    [DbContext(typeof(HealthContext))]
    partial class _6
    {
        public override string Id
        {
            get { return "20150913203231_6"; }
        }

        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Annotation("ProductVersion", "7.0.0-beta7-15540")
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerIdentityStrategy.IdentityColumn);

            modelBuilder.Entity("Health.Core.Entities.Food", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Calories");

                    b.Property<string>("Name");

                    b.Property<int>("ServingSize");

                    b.Key("Id");
                });

            modelBuilder.Entity("Health.Core.Entities.Meal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("MealNumber");

                    b.Key("Id");
                });

            modelBuilder.Entity("Health.Core.Entities.MealEntry", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Calories");

                    b.Property<int>("FoodId");

                    b.Key("Id");
                });

            modelBuilder.Entity("Health.Core.Entities.MealEntry", b =>
                {
                    b.Reference("Health.Core.Entities.Food")
                        .InverseCollection()
                        .ForeignKey("FoodId");
                });
        }
    }
}
