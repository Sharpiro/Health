using Microsoft.Extensions.Logging;

namespace Health.Core
{
    public class CustomLoggerFactory : ILoggerFactory, ILoggerProvider
    {
        public void Dispose()
        {
            //throw new System.NotImplementedException();
        }

        public ILogger CreateLogger(string categoryName)
        {
            return new CustomLogger();
        }

        public void AddProvider(ILoggerProvider provider)
        {
            //throw new System.NotImplementedException();
        }

        public LogLevel MinimumLevel { get; set; }
    }
}
