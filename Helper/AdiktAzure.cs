using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;
using Microsoft.Azure;


namespace SkodaChristmas2015.Helper
{
    public class Blob
    {
        public int id { get; set; }
        public string url { get; set; }
        public string color { get; set; }
    }

    public static class AdiktAzure
    {
        
        public static CloudBlobContainer GetContainer(string container)
        {
            CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
                                            CloudConfigurationManager.GetSetting("StorageConnectionString"));
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            return blobClient.GetContainerReference(container);
        }

        public static CloudBlockBlob GetBlob(string cont, string blobName)
        {
            var container = GetContainer(cont);
            CloudBlockBlob blockBlob = container.GetBlockBlobReference(blobName);
            
            return blockBlob;
        }


        public static Blob[] Get(string name)
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
    }
}