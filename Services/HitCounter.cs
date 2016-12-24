using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace Services
{
    public class HitCounter
    {
        private readonly string _fileName;
        private readonly int _ipColumn;
        private readonly int _pageColumn;
        private readonly char _sepChar;

        private readonly Dictionary<string, long> _ipHits = new Dictionary<string, long>();

        public HitCounter(string fileName, int ipColumn, int pageColumn, char sepChar)
        {
            _fileName = fileName;
            _ipColumn = ipColumn;
            _pageColumn = pageColumn;
            _sepChar = sepChar;
        }

        public HitCounter Calculate()
        {
            var logStream = File.OpenText(_fileName);

            var logContent = logStream.ReadToEnd();

            foreach (var line in logContent.Split(new char[] {'\n'}))
            {
                if ((!string.IsNullOrEmpty(line)) && (!line.StartsWith("#")))
                {
                    var column = line.Split(new char[] {_sepChar});
                    var ip = column[_ipColumn];
                    var page = column[_pageColumn];
                    if (page.Equals("/"))
                    {
                        if (_ipHits.ContainsKey(ip))
                        {
                            _ipHits[ip]++;
                        }
                        else
                        {
                            _ipHits.Add(ip, 1);
                        }
                    }
                }
            }

            return this;
        }

        public long SiteHits
        {
            get
            {
                return _ipHits.Keys.Count;
            }
        }
    }
}
