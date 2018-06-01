using System;
using Health.Core.Next.Services;
using Microsoft.AspNetCore.Mvc;
using Health.Core.Next.Dtos;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Health.Next.API
{
    public class DayController : Controller
    {
        private readonly HealthService _healthService;

        public DayController(HealthService healthService)
        {
            _healthService = healthService ?? throw new ArgumentNullException(nameof(healthService));
        }

        [HttpGet]
        public void Get()
        {
            throw new Exception("bad");
        }

        [HttpGet]
        public object GetMacros()
        {
            var macros = _healthService.GetMacros();
            return new
            {
                Protein = macros.Protein,
                Carbs = macros.Carbs,
                Fat = macros.Fat
            };
        }

        [HttpPost]
        public DayDto Add(DateTime currentTime)
        {
            return _healthService.AddDay(currentTime);
        }

        [HttpGet]
        public DayDto GetLatest()
        {
            return _healthService.GetLatestDay();
        }

        [HttpGet]
        public IEnumerable<DayDto> GetDayList(int numberOfDays)
        {
            return _healthService.GetDayList(numberOfDays);
        }

        [HttpGet]
        public object GetMacroTiming(DateTime? dayTimeStamp = null)
        {
            var macroDto = _healthService.GetMacroTiming(dayTimeStamp);

            var macroDtoNoTuple = new
            {
                CarbsList = macroDto.CarbsList.Select(MapTuple),
                FatList = macroDto.FatList.Select(MapTuple),
                ProteinList = macroDto.ProteinList.Select(MapTuple)
            };

            //string json =
            //    JsonConvert.SerializeObject(
            //        macroDtoNoTuple,
            //        new JsonSerializerSettings { ContractResolver = new CamelCasePropertyNamesContractResolver() }
            //    );
            //const string fakeData = @"{""carbsList"":[{""item1"":17,""item2"":""2017-06-11T10:00:00"",""item3"":68},{""item1"":33,""item2"":""2017-06-11T15:00:00"",""item3"":132}],""fatList"":[{""item1"":20,""item2"":""2017-06-11T10:00:00"",""item3"":180},{""item1"":27,""item2"":""2017-06-11T15:00:00"",""item3"":243}],""proteinList"":[{""item1"":12,""item2"":""2017-06-11T10:00:00"",""item3"":48},{""item1"":85,""item2"":""2017-06-11T15:00:00"",""item3"":340}]}";
            //macroSeriesLists = JObject.Parse(fakeData);
            return macroDtoNoTuple;

            object MapTuple((int Macros, DateTime TimeStamp, int Calories) tuple) =>
                new { tuple.Macros, tuple.TimeStamp, tuple.Calories };
        }

        [HttpPut]
        public DayDto Update([FromBody]DayDto day)
        {
            return _healthService.UpdateDay(day);
        }

        [HttpPut]
        public DayDto Clear()
        {
            return _healthService.ClearDay();
        }

        [HttpPut]
        public void PruneInvalidDays()
        {
            _healthService.PruneInvalidDays();
        }
    }
}