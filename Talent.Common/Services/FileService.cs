using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _tempFolder;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment, 
            IAwsService awsService)
        {
            _environment = environment;
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            try
            {
                string bucketName = "talentprofilephoto";
                String fileURL = await _awsService.GetStaticUrl(id, bucketName);
                return fileURL;
            }
            catch
            {
                return null;
            }

        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            string bucketName = "talentprofilephoto";
            string filename = $@"{DateTime.Now.Ticks}_" + file.FileName;
            var reader = file.OpenReadStream();
            await _awsService.PutFileToS3(filename, reader, bucketName, true);
            return filename;
        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            await _awsService.RemoveFileFromS3(id, "talentprofilephoto");
            return true;
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            //Your code here;
            throw new NotImplementedException();
        }
        #endregion
    }
}
