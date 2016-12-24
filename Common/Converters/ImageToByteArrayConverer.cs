using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Converters
{
    public class ImageToByteArrayToByteArrayConverer : IImageToByteArrayConverer
    {
        public byte[] Convert(System.Drawing.Image imageIn)
        {
            MemoryStream ms = new MemoryStream();
            imageIn.Save(ms, imageIn.RawFormat);
            return ms.ToArray();
        }
    }

    internal interface IImageToByteArrayConverer
    {
        byte[] Convert(System.Drawing.Image imageIn);
    }
}
