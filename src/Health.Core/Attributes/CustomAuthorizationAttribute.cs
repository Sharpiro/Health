using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Health.Core.Attributes
{
    public class CustomAuthorizationAttribute : AuthorizeFilter
    {
        public CustomAuthorizationAttribute(AuthorizationPolicy policy) : base(policy)
        {
        }
    }
}
