using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AspNet.Security.OpenIdConnect.Server;
using Microsoft.AspNet.Authentication;
using Microsoft.AspNet.Http.Authentication;
using AspNet.Security.OpenIdConnect.Extensions;

namespace Health.Core.Providers
{
    public class DefaultAuthorizationProvider: OpenIdConnectServerProvider
    {
        public override async Task ValidateClientAuthentication(ValidateClientAuthenticationNotification notification)
        {
            notification.ClientId = string.Empty;
            notification.Validated();
            await Task.FromResult<object>(null);
            notification.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(GrantResourceOwnerCredentialsNotification notification)
        {
            string roleType;
            if (!UserAuthenticatedSimple(notification, out roleType))
                return;

            //authenticate
            var identity = new ClaimsIdentity(OpenIdConnectDefaults.AuthenticationScheme);
            identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, notification.UserName));
            identity.AddClaim(new Claim(ClaimTypes.Role, roleType));

            // create metadata to pass on to refresh token provider
            var props = new AuthenticationProperties(new Dictionary<string, string>
                {
                    { "as:client_id", notification.ClientId },
                    {"userName", notification.UserName }
                });
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, props, OpenIdConnectDefaults.AuthenticationScheme);

            notification.Validated(ticket);
        }

        public override Task GrantRefreshToken(GrantRefreshTokenNotification notification)
        {
            return base.GrantRefreshToken(notification);
        }

        public override Task TokenEndpoint(TokenEndpointNotification notification)
        {
            return base.TokenEndpoint(notification);
        }

        public override Task ValidateTokenRequest(ValidateTokenRequestNotification notification)
        {
            if (notification.Request.IsPasswordGrantType() || notification.Request.IsRefreshTokenGrantType())
            {
                notification.Validated();

                return Task.FromResult<object>(null);
            }

            notification.Rejected(
                error: "unsupported_grant_type",
                description: "Only authorization code and refresh token grant types " +
                             "are accepted by this authorization server");

            return Task.FromResult<object>(null);
        }

        private bool UserAuthenticatedSimple(GrantResourceOwnerCredentialsNotification notification, out string roleType)
        {
            roleType = null;
            if (notification.UserName == "sharpiro" && notification.Password == "password")
            {
                roleType = "admin";
                return true;
            }
            if (notification.UserName == "revoked" && notification.Password == "revoked")
            {
                roleType = "admin";
                return true;
            }
            if (notification.UserName == "guest" && notification.Password == "password")
            {
                roleType = "user";
                return true;
            }
            return false;
        }
    }
}
