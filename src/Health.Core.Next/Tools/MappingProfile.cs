using AutoMapper;
using Health.Core.Next.DataAccess.Entities;
using Health.Core.Next.Dtos;

namespace Health.Core.Next.Tools
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Food, FoodDto>();
            CreateMap<FoodDto, Food>();
            CreateMap<Day, DayDto>();
            CreateMap<DayDto, Day>();
            CreateMap<Meal, MealDto>();
            CreateMap<MealDto, Meal>();
            CreateMap<MealEntry, MealEntryDto>();
            CreateMap<MealEntryDto, MealEntry>();
        }
    }
}