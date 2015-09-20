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
    partial class _18
    {
        public override string Id
        {
            get { return "20150919190608_18"; }
        }

        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .Annotation("ProductVersion", "7.0.0-beta7-15540")
                .Annotation("SqlServer:ValueGenerationStrategy", SqlServerIdentityStrategy.IdentityColumn);

            modelBuilder.Entity("Health.Core.Entities.Day", b =>
                {
                    b.Property<DateTime>("Created");

                    b.Key("Created");
                });

            modelBuilder.Entity("Health.Core.Entities.Food", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Calories");

                    b.Property<int>("Carbs");

                    b.Property<int>("Fat");

                    b.Property<int?>("Fiber");

                    b.Property<string>("Name")
                        .Required();

                    b.Property<int?>("Potassium");

                    b.Property<int>("Protein");

                    b.Property<string>("ServingName");

                    b.Property<int>("ServingSize");

                    b.Property<int?>("Sodium");

                    b.Property<int?>("Sugar");

                    b.Key("Id");
                });

            modelBuilder.Entity("Health.Core.Entities.Meal", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("DayId");

                    b.Property<int>("MealNumber");

                    b.Key("Id");
                });

            modelBuilder.Entity("Health.Core.Entities.MealEntry", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("Calories");

                    b.Property<int>("FoodId");

                    b.Property<int>("MealEntryNumber");

                    b.Property<int>("MealId");

                    b.Key("Id");
                });

            modelBuilder.Entity("Health.Core.Entities.Meal", b =>
                {
                    b.Reference("Health.Core.Entities.Day")
                        .InverseCollection()
                        .ForeignKey("DayId");
                });

            modelBuilder.Entity("Health.Core.Entities.MealEntry", b =>
                {
                    b.Reference("Health.Core.Entities.Food")
                        .InverseCollection()
                        .ForeignKey("FoodId");

                    b.Reference("Health.Core.Entities.Meal")
                        .InverseCollection()
                        .ForeignKey("MealId");
                });
        }
    }
}
