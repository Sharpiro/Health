using AutoMapper;
using Health.Core.Next.DataAccess;
using Health.Core.Next.DataAccess.Entities;
using Health.Core.Next.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Health.Core.Next.Services
{
    public class FoodService
    {
        private readonly HealthContext _healthContext;
        private readonly IMapper _mapper;

        public FoodService(HealthContext healthContext, IMapper mapper)
        {
            _healthContext = healthContext ?? throw new ArgumentNullException(nameof(healthContext));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        public FoodDto Get(int id)
        {
            if (id <= 0) throw new ArgumentOutOfRangeException(nameof(id));

            var foodEntity = _healthContext.Foods.Find(id);
            var foodDto = _mapper.Map<FoodDto>(foodEntity);
            return foodDto;
        }

        public IEnumerable<FoodDto> GetAll()
        {
            var foodEntities = _healthContext.Foods.ToList();
            var foodDtos = foodEntities.Select(_mapper.Map<FoodDto>);
            return foodDtos;
        }

        public void UpdateFood(FoodDto foodDto)
        {
            if (foodDto == null) throw new ArgumentNullException(nameof(foodDto));
            if (foodDto.Id <= 0) throw new ArgumentException($"Must provide a valid Id when updating an entity. Id: {foodDto.Id}");

            var foodEntity = _mapper.Map<Food>(foodDto);
            _healthContext.Foods.Update(foodEntity);
            _healthContext.SaveChanges();
        }
    }
}