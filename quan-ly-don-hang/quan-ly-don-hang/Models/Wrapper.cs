using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace quan_ly_don_hang.Models
{
    public class Wrapper<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public T Data { get; set; }
    }
}