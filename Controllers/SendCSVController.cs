using CsvHelper;
using Skoda.SenderWSSecuredRest.Model;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Runtime.Serialization.Json;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;
using System.Configuration;
using System.Web.UI;

namespace SkodaChristmas2015.Controllers
{
    public class SendCSVController : BaseController
    {
        // GET: SendCSV
        public ActionResult Index()
        {//28
            
            var isSent = !String.IsNullOrEmpty(Request.Form["email"]);
            if (isSent) { 
            List<string> csvEmails = new List<string>();
            List<string> listB = new List<string>();
            foreach (var file in Request.Files.AllKeys)
            {
                //var csv = new CsvReader(Request.Files[file].InputStream);
                var reader = new StreamReader(Request.Files[file].InputStream);
                
                while (!reader.EndOfStream)
                {
                    var line = reader.ReadLine();
                    var values = line.Split(',');

                    csvEmails.Add(values[28]);
                }
            }

            string userEmail = Request.Form["email"];
            string[] recipient = new string[100];
            if (Request.Form["recipient[]"] != "")
                recipient = Request.Form["recipient[]"].Split(',');
            
            Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
            Match match = regex.Match(userEmail);
            if (match.Success)
            {
                foreach (var email in csvEmails)
                {
                    match = regex.Match(email);
                        if (match.Success)
                        {
                            string body = RenderPartialToString(ControllerContext, "Email", Request);
                            //string body = RenderPartialToString(ControllerContext, "SomeView", new {  });
                            SendMessage(userEmail, email, Request.Form["image_path"], body);
                        }
                }

                foreach (var email in recipient)
                {
                    match = regex.Match(email);
                    if (match.Success){
                            string body = RenderPartialToString(ControllerContext, "Email", Request);
                            SendMessage(userEmail, email, Request.Form["image_path"], body);
                    }
                }
            }

            }

                return View(isSent);
        }

        public static string RenderPartialToString(ControllerContext context, string partialViewName, object model)
        {
            ViewDataDictionary viewData = new ViewDataDictionary(model);
            TempDataDictionary tempData = new TempDataDictionary();
            ViewEngineResult result = ViewEngines.Engines.FindPartialView(context, partialViewName);

            if (result.View != null)
            {
                StringBuilder sb = new StringBuilder();
                using (StringWriter sw = new StringWriter(sb))
                {
                    using (HtmlTextWriter output = new HtmlTextWriter(sw))
                    {
                        ViewContext viewContext = new ViewContext(context, result.View, viewData, tempData, output);
                        result.View.Render(viewContext, output);
                    }
                }

                return sb.ToString();
            }
            return String.Empty;
        }

        public class HmacSha256Helper
        {

            public static string ComputeHash(string inputString, string key)

            {

                key = key ?? "";

                var encoding = Encoding.UTF8;

                byte[] keyBytes = encoding.GetBytes(key);



                using (var hmacsha256 = new HMACSHA256(keyBytes))

                {

                    byte[] input = Encoding.UTF8.GetBytes(inputString);

                    byte[] hashmessage = hmacsha256.ComputeHash(input);

                    return Convert.ToBase64String(hashmessage);

                }

            }

        }


        private void SendMessage(string fromMail, string toMail, string url, string body)

        {


            ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };



            using (var webClient = new WebClient())

            {

                using (var contentStream = new MemoryStream())

                {
                    string Subject = SkodaChristmas2015.Resources.ChristmasDefault.EmailSubject;
                    string operationUri = "https://ws.skoda-auto.com/SenderWSSecuredREST/01.00.00/SenderRestService.svc/SendEmail";

                    var email = new Email

                    {

                        From = "noreply@skoda-auto.cz",

                        To = toMail,
                        Subject = Subject,
                        //Body = "<p>"+ SkodaChristmas2015.Resources.ChristmasDefault.EmailBody1 +name+"! <br>"+ SkodaChristmas2015.Resources.ChristmasDefault.EmailBody2 + "</p><p><a href=\""+appUrl+"\"> "+ SkodaChristmas2015.Resources.ChristmasDefault.EmailYourCard + "</a></p><br><img src=\"" + url+"\">",
                        Body = body,
                        IsBodyHtml = true,
                        Priority = System.Net.Mail.MailPriority.Normal,
                    };

                    var contentSerializer = new DataContractJsonSerializer(typeof(Email));

                    contentSerializer.WriteObject(contentStream, email);




                    webClient.Headers["Content-type"] = "application/json";

                    string now = String.Format(CultureInfo.GetCultureInfo("en-US"), "{0:ddd,' 'dd' 'MMM' 'yyyy' 'HH':'mm':'ss' 'K}", DateTime.UtcNow);

                    string dateHeaderName = "X-SA-Date";

                    webClient.Headers[dateHeaderName] = now;

                    string content;

                    contentStream.Position = 0;

                    using (var streamReader = new StreamReader(contentStream))

                    {

                        content = streamReader.ReadToEnd();

                    }

                    string messageToken = string.Format("{0}:{1}\n{2}", dateHeaderName, now, content);

                    string senderSignature = "MWE0MGVlYmYtZjIzYi00NzMzLWIzYjMtZTJiZjE2YWYyYTA3DQo=";
                    //string senderSignature = "MDZmZjFiZmItMThlMC00MDliLWFjN2ItMzJlM2Y1ZTZhNzcw";
                    
                    string messageSignature = HmacSha256Helper.ComputeHash(messageToken, senderSignature);

                    string senderAccountName = "Christmas2015";
                    //string senderAccountName = "TestSender1";
                    

                    string authorizationHeaderName = "X-SA-Authorization";

                    webClient.Headers[authorizationHeaderName] = string.Format("{0}:{1}", senderAccountName, messageSignature);



                    byte[] responseBytes = webClient.UploadData(operationUri, "POST", contentStream.ToArray());



                    using (var responseStream = new MemoryStream(responseBytes))

                    {

                        var responseSerializer = new DataContractJsonSerializer(typeof(string));

                        var response = responseSerializer.ReadObject(responseStream);
                    }

                }

            }


        }
    






    }


}
