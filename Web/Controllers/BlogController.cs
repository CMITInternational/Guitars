using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Web.Models;

namespace Web.Controllers
{
    [Route("api/blog")]
    public class BlogController : ApiController
    {
        [Route("api/blog")]
        [HttpGet]
        public List<BlogViewModel> Get()
        {
            return new List<BlogViewModel>
            {
                new BlogViewModel{Title="B1", SubTitle="Blog One", Description="First Blog", Lines=new List<string>{"Line1","Line2",}},
                new BlogViewModel{Title="B2", SubTitle="Blog Two", Description="Second Blog", Lines=new List<string>{"Line1","Line2","Line3",}},
                new BlogViewModel{Title="B3", SubTitle="Blog Three", Description="Trird Blog", Lines=new List<string>{"Line1",}},
                new BlogViewModel{Title="B4", SubTitle="Blog Four", Description="Forth Blog", Lines=new List<string>{"Line1","Line2","Line3","Line4",}},
                new BlogViewModel{Title="B5", SubTitle="Blog Five", Description="Fifth Blog", Lines=new List<string>{"Line1","Line2",}},
            };
        } 
    }
}
