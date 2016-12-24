namespace Common.Providers
{
    public interface IConfigProvider
    {
        string Get(string setting);
    }
}