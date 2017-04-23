//using AutoMapper;
//using Health.Core.Next.DataAccess;
//using Health.Core.Next.Models;
//using System;
//using System.Collections.Generic;
//using System.Linq;

//namespace Health.Core.Next.Services
//{
//    public class FoodService
//    {
//        private readonly HealthContext _healthContext;
//        private readonly IMapper _mapper;

//        public FoodService(HealthContext healthContext, IMapper mapper)
//        {
//            _healthContext = healthContext ?? throw new ArgumentNullException(nameof(healthContext));
//            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
//        }

//        public FoodDto Get(int id)
//        {
//            var foodEntity = _healthContext.Foods.Find(id);
//            var foodDto = _mapper.Map<FoodDto>(foodEntity);
//            return foodDto;
//        }

//        public IEnumerable<FoodDto> GetAll()
//        {
//            var foodEntities = _healthContext.Foods.ToList();
//            var foodDtos = foodEntities.Select(_mapper.Map<FoodDto>);
//            return foodDtos;
//        }
//    }
//}