using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Net;

namespace SkodaChristmas2015.Controllers
{
    public class DownloadController : Controller
    {
        // GET: Download
        public void Index(string url)
        {

            //string url = "https://skodachristmas.blob.core.windows.net/generated/postcard-201511301624566663";
            System.IO.Stream stream = null;

            //This controls how many bytes to read at a time and send to the client
            int bytesToRead = 10000;

            // Buffer to read bytes in chunk size specified above
            byte[] buffer = new Byte[bytesToRead];

            // The number of bytes read
            try
            {
                //Create a WebRequest to get the file
                HttpWebRequest fileReq = (HttpWebRequest)HttpWebRequest.Create(url);

                //Create a response for this request
                HttpWebResponse fileResp = (HttpWebResponse)fileReq.GetResponse();

                if (fileReq.ContentLength > 0)
                    fileResp.ContentLength = fileReq.ContentLength;

                //Get the Stream returned from the response
                stream = fileResp.GetResponseStream();


            var resp = HttpContext.Response;

        //Indicate the type of data being sent
        resp.ContentType = "image/png";

        //Name the file 
        //resp.AddHeader("Content-Type", "image/png");
        resp.AddHeader("Content-Type", "application/octet-stream");
        resp.AddHeader("Content-Disposition", "attachment; filename=\"postcard.png\"");
        resp.AddHeader("Content-Length", fileResp.ContentLength.ToString());
        resp.AddHeader("Content-Transfer-Encoding", "Binary");

        int length;
        do
        {
            // Verify that the client is connected.
            if (resp.IsClientConnected)
            {
                // Read data into the buffer.
                length = stream.Read(buffer, 0, bytesToRead);

                // and write it out to the response's output stream
                resp.OutputStream.Write(buffer, 0, length);

                // Flush the data
                resp.Flush();

                //Clear the buffer
                buffer = new Byte[bytesToRead];
            }
            else
            {
                // cancel the download if client has disconnected
                length = -1;
            }
        } while (length > 0); //Repeat until no data is read
    }
    finally
    {
        if (stream != null)
        {
            //Close the input stream
            stream.Close();
        }
    }

        }
    }
}