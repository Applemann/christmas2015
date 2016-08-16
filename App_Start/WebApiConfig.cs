using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;
using System.Net.Http.Headers;

namespace SkodaChristmas2015
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Configure Web API to use only bearer token authentication.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "GetTexts",
                routeTemplate: "api/{controller}/{action}",
                defaults: new { controller = "Resource", action = "GetWishes"}
            );

            config.Routes.MapHttpRoute(
                name: "SendMail",
                routeTemplate: "api/{controller}",
                defaults: new { controller = "Send", action = "Post" }
            );

            config.Routes.MapHttpRoute(
                name: "GetResources",
                routeTemplate: "api/{controller}/{resource}"
            );

            
        }
    }
}
