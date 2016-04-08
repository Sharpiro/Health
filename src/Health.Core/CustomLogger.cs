using System;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Health.Core
{
    public class CustomLogger : ILogger
    {
        public void Log(LogLevel logLevel, int eventId, object state, Exception exception, Func<object, Exception, string> formatter)
        {
            //var message = state as string;
            //if (!string.IsNullOrEmpty(message))
            //{
            //    Debug.WriteLine(message);
            //    Console.WriteLine(message);
            //    return;
            //}
            Debug.WriteLine(formatter(state, exception));
            Console.WriteLine(formatter(state, exception));
        }

        public bool IsEnabled(LogLevel logLevel)
        {
            return true;
        }

        public IDisposable BeginScopeImpl(object state)
        {
            return null;
            //throw new NotImplementedException();
        }
    }
}
