using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.Web.WebSockets;

namespace Web
{
    /// <summary>
    /// Summary description for ws
    /// </summary>
    public class ws : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            if (context.IsWebSocketRequest)
            {
                context.AcceptWebSocketRequest(new ContactsWebSocketHandler());
            }
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }

    public class ContactsWebSocketHandler : WebSocketHandler
    {
        public static WebSocketCollection clients = new WebSocketCollection();

        public override void OnOpen()
        {
            clients.Add(this);
        }

        public override void OnMessage(string message)
        {
            clients.Broadcast(message);
        }

        public override void OnClose()
        {
            clients.Remove(this);
        }
    }
}