using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using Web.Models;

namespace Web
{
    public static class AutoMapperConfig
    {
        public static void Configure()
        {
            Mapper.CreateMap<Portfolio, PortfolioViewModel>();
        }
    }
}