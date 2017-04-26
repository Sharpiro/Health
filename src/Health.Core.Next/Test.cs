using Newtonsoft.Json;
using System.Collections.Immutable;

namespace Health.Core.Next
{
    public class Test
    {
        public void Do()
        {
            var json = JsonConvert.SerializeObject(new { });
            var list = ImmutableList.Create<string>();
        }
    }
}