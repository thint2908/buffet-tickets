//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace quan_ly_don_hang.Context
{
    using System;
    using System.Collections.Generic;
    
    public partial class Tax
    {
        public int TaxID { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int Value { get; set; }
        public int Active { get; set; }
        public Nullable<System.DateTime> CreatedAt { get; set; }
        public Nullable<System.DateTime> UpdatedAt { get; set; }
    }
}
