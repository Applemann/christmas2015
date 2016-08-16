using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.Azure;

using System.Drawing;
using System.Drawing.Imaging;
using System.Text.RegularExpressions;
using System.Drawing.Text;
using System.Runtime.InteropServices;
using System.IO;
using SkodaChristmas2015.Helper;

namespace SkodaChristmas.Controllers 
{

    public class Wish
    {
        public int id { get; set; }
        public string text { get; set; }
    }

    public class Blob
    {
        public int id { get; set; }
        public string url { get; set; }
        public string color { get; set; }
    }

    public class Text
    {
        public Font Font { get; set; }
        public Brush Brush { get; set; }
        public Color Color { get; set; }
        public String String { get; set; }
        public String Placeholder { get; set; }
        public RectangleF Rectangle { get; set; }
        public PointF Point { get; set; }
        public SizeF Size { get; set; }

        public Text(String text, String placeholder)
        {
            
            Font = new Font("Arial", 19);
            Color = Color.White;
            String = text;
            Placeholder = placeholder;
            Brush = new SolidBrush(Color);

        }

        public Text(string text, string placeholder, RectangleF rectangle) : this(text, placeholder)
        {
            Rectangle = rectangle;
            Point = rectangle.Location;
            Size = rectangle.Size;
        }

        public Text(string text, string placeholder, RectangleF rectangle, Color color) : this(text, placeholder, rectangle)
        {
            Color = color;
            Brush = new SolidBrush(color);
        }

        override
        public string ToString()
        {
            return String;
        }

        public void SetFont(Stream stream, int size)
        {
            FontFamily font = LoadFontFamily(stream);
            Font = new Font(font, size);
        }
        

        public void SetFont(string fontName, int size)
        {
            PrivateFontCollection pfc = new PrivateFontCollection();
            pfc.AddFontFile(System.AppDomain.CurrentDomain.BaseDirectory + "\\fonts\\" + fontName);
            Font = new Font(pfc.Families[0], size);
        }

        private FontFamily LoadFontFamily(Stream fontStream)
        {
                int fontStreamLength = (int)fontStream.Length;

                IntPtr data = Marshal.AllocCoTaskMem(fontStreamLength);

                byte[] fontData = new byte[fontStreamLength];
                fontStream.Read(fontData, 0, fontStreamLength);

                Marshal.Copy(fontData, 0, data, fontStreamLength);

                var fontCollection = new PrivateFontCollection();
                fontCollection.AddMemoryFont(data, fontStreamLength);
                var skodaFont = fontCollection.Families[0];

                Marshal.FreeCoTaskMem(data);
                return skodaFont;
            }
        
    }


    public class GeneratorController : ApiController
    {

        public string ConvertIcon(string str)
        {
            string[] strParts = Regex.Split(str, "{");
            for (int i = 1; i < strParts.Length; i++)
            {
                strParts[i] = Regex.Split(strParts[i], "}")[1];
            }
            str = String.Join("{{icon}}", strParts);
            return str;
        }

        // POST api/values
        public Dictionary<string, string> Post()
        {
            string Json = Request.Content.ReadAsStringAsync().Result;
            dynamic result = Newtonsoft.Json.JsonConvert.DeserializeObject(Request.Content.ReadAsStringAsync().Result);
                
            
            var imageId = result.image_id;
            var iconIds = result.icon_ids;
            var text = result.text;
            string lang = (string)result.lang;

            var card = new ChristmasCard((int)imageId, iconIds.ToObject<int[]>());
            
            //set colors and positions of wish for some images
            if (imageId == 8 || imageId == 5 || imageId == 4)
            {
                text.color = "#ffffff";
            }

            if (imageId == 1)
            {
                text.top = 200;
            }

            
            var textString = "";

            foreach (var wish in GetTexts(lang))
            {
                if (text.id == wish.id)
                {
                   textString = wish.text.ToUpper();
                }
            }
            
            //set wish text
            var rectText = new RectangleF(new PointF((float)text.left, (float)text.top), new SizeF(card.Width - (float)text.right, card.Height - (float)text.bottom));
            Color color = ColorTranslator.FromHtml((string)text.color);

            card.Text = new Text(ConvertIcon(textString), "{{icon}}", rectText, color);
            card.Text.SetFont("SkodaPro-ExtraBold.ttf", 19);

            //set logo
            if (imageId == 6)
            {
                color = ColorTranslator.FromHtml("#ffffff");
            }
            card.Logo = new Text("", "", rectText, color);

            
            card.Generate(Request, lang);

            //give back json with url of generated images for download
            Dictionary<string, string> dict = new Dictionary<string, string>();
            dict.Add("preview_image_url", card.PreviewUrl);
            

            dict.Add("image_url", card.ImageUrl);
            dict.Add("page_url", "http://" + Request.RequestUri.Authority + "/" + lang + "/Home/ChristmasCard/" + card.ImageUrl.Split('-')[1].Split('.')[0]);
            
            return dict;
            
        }

        private List<Wish> GetTexts(string lang)
        {
            string wishString = SkodaChristmas2015.Resources.ChristmasDefault.ResourceManager.GetString("Wishes", new System.Globalization.CultureInfo(CultureHelper.GetImplementedCulture(lang)));
            string[] wishes = Regex.Split(wishString, "##");

            
            List<Wish> wishesList = new List<Wish>();

            int i = 1;
            foreach (var wish in wishes)
            {
                wishesList.Add(new Wish { id = i, text = wish });
                i++;
            }

            return wishesList;

        }
    }

    public class ResourceController : ApiController
    {
        public CloudBlobContainer GetContainer(string container)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                                            CloudConfigurationManager.GetSetting("StorageConnectionString"));
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            return blobClient.GetContainerReference(container);
        }

        public CloudBlockBlob GetBlob(string cont, string blobName)
        {
            var container = GetContainer(cont);
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobName);
            return blockBlob;
        }
        

        [HttpGet]
        public Blob[] Get(string name)
        {
            var container = GetContainer(name);

            var listBlobs = container.ListBlobs(null, false);
            Blob[] blobs = new Blob[listBlobs.ToArray().Length];

            int i = 0;
            string color = "#000000";
            foreach (IListBlobItem item in listBlobs)
            {

                CloudBlockBlob blob = (CloudBlockBlob)item;
                var id = blob.Name.Split('-')[1];
                blobs[i] = new Blob { id = Int32.Parse(id), url = blob.Uri.ToString(), color = color };
                i++;
            }

            return blobs;
        }




        [HttpGet]
        public List<Wish> GetWishes(string lang)
        {
            string[] wishes = Regex.Split(SkodaChristmas2015.Resources.ChristmasDefault.ResourceManager.GetString("Wishes", new System.Globalization.CultureInfo(CultureHelper.GetImplementedCulture(lang))), "##");
            List<Wish> wishesList = new List<Wish>();

            int i = 1;
            foreach (var wish in wishes)
            {
                wishesList.Add(new Wish { id = i, text = wish.Replace("<br>", "") });
                i++;
            }

            return wishesList;

        }
    }

}
