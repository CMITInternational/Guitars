using System;
using System.Configuration;

namespace Common.Providers
{
    public class ConfigProvider : IConfigProvider
    {
        public string Get(string setting)
        {
            return ConfigurationManager.AppSettings[setting];
        }
    }
}