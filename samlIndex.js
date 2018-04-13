var saml2 = require('saml2-js');
var fs = require('fs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
app.use(bodyParser.urlencoded({
    extended: true
}));

// Create service provider
var sp_options = {
    entity_id: "http://localhost:3000/metadata.xml",
    private_key: "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC/f7iZ/szyl88V3Z7VxvqzBkGd2YXrti5szImNLYihVE1bu1LrEIgYiKzdmv7JX70osaeWrFtFoS/t8I+RQRj0Zw47xJFh1UqDQ8DeZL+gTP1eMhEiBq0YkwrKDR9OmLNXVeVLAbYWun7zaB3KWxFvqMr7UbH35ZmjOxJtNk8tuMotnpLbSKa/Xe1w+TrjDpBrPdodV+xeKCaf2pldJPL9tckeyN2Tq/FHC1LGQWgJd0Bd1NDTG5F6FrxoPHYGiq/jKC1kyz+6P5yH3l4n0n9NTqwQUmlB0hhUSPXPNI9T7p5wcdlJAjyWaUuitGyQSXRpBhKFDmri5nsvHq28FEuJAgMBAAECggEAMUJPX/11BqoaMMuzQdZPQqHHWy1LD5jrVD1A3LnrvWQMCh6jc6fq+jSeEtr90xr3c3JPY6iuSbjutUv+AiU2oBeqR6GGrB3LbvyMrihISpnDSumiEpiZCgs46UR62yLYbwy/UI3+ItaSNVaA4z6Nu6U1oXQgTV4YKS7WzJT9xQqiz813+crVxcO9vVxmUMw/aUquBZz3acpdqPwPL20x7p1TbBB8jPIVGClBue9ku945T5b6ToIsujHYjmgY9Khf7IDETfRXQVJrL4ZqnUNzpjwdYyqGOHqkVoV/klyoVic//msH7hl/A/Q8VqvUTbofvPa8SM2fBuZv/mv/hz0x6QKBgQD7mf439M4Mqr8hliR1cU0CWz9c93jjj41vLkjjf6PFz4ZjAR0a5tBgzrWZkFlG4yIt2hjPPz/jWRHOz59ymvitvWEqpUjkh8JX2eXL9lVoFixOwM1/RLw4V4kdm4z1h0kj1MZFGBUL8jC8RsRZHkSCc0O0mhWRjGJbSVZTQI9a6wKBgQDC2L9OjObKi0na7sCrnEw6LxAGBvAtuiMu7zB1dJiiBZcGfF7CgGowAcpKVkvEh0NZEe25wdVAyVverhNw3fV+/aV38KusWsREzUo1BNd+BvBB7TVhfA4OnrjjWaVP9FFRVqanRwuqeCIUrO+DtF/LQBngy4JAYUaUJWFdcKpuWwKBgQDPbN+HJk4RZ1t3xx57rFL+1Fdiv6tsgFbsCE6TMBHG7RYv3SUvnobAqOpSlgzkQjFVd+7oPY7gUfg6djVP+K94HR9UVzvHHJ1+a+flxUoYK9+Pdah1eidqk9A5FpqZeVU1Mx/aqsX/OUYwkm8hwbBdk8WHyVhqzD/yXn3K2PjWzQKBgBDRlsnX/b/z//8G5tipWCcZkt+CT88SpyDRArTQyLALnXqw15kgbooQTX7XLhkbt+ODWarUIW1DNEvnaMQwVJWOnW7Z9medOh3aPpKPBW7aeHioWhg9FhWK+9icD1n0c+R6f04nIsmnLwHr34zV0AMCWHl/95FJFEeLZnkjVYLLAoGAKMWb7i0CMROJlMK5KKX/OE++WBsX+Et43qKIqx1TGXosZSE51ktvVcUPSBAl90g8Ct8NPlS1+ha3lFrtPA/qP7h06GYxqOKDKsHsxTZrCUnRthU1Ylkdzc5jDJ8PrAiKEtHB5katfPS6mrlQga4BpKt5uC/C+AbYG/DMtjzAw80=",
    certificate: "MIIDrTCCApWgAwIBAgIJANopXNGY1YktMA0GCSqGSIb3DQEBCwUAMG0xCzAJBgNVBAYTAlVTMRMwEQYDVQQIDApDYWxpZm9ybmlhMRYwFAYDVQQHDA1TYW4gRnJhbmNpc2NvMRAwDgYDVQQKDAdKYW5reUNvMR8wHQYDVQQDDBZUZXN0IElkZW50aXR5IFByb3ZpZGVyMB4XDTE4MDQwNTIwNDU1MVoXDTM4MDMzMTIwNDU1MVowbTELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xEDAOBgNVBAoMB0phbmt5Q28xHzAdBgNVBAMMFlRlc3QgSWRlbnRpdHkgUHJvdmlkZXIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQC/f7iZ/szyl88V3Z7VxvqzBkGd2YXrti5szImNLYihVE1bu1LrEIgYiKzdmv7JX70osaeWrFtFoS/t8I+RQRj0Zw47xJFh1UqDQ8DeZL+gTP1eMhEiBq0YkwrKDR9OmLNXVeVLAbYWun7zaB3KWxFvqMr7UbH35ZmjOxJtNk8tuMotnpLbSKa/Xe1w+TrjDpBrPdodV+xeKCaf2pldJPL9tckeyN2Tq/FHC1LGQWgJd0Bd1NDTG5F6FrxoPHYGiq/jKC1kyz+6P5yH3l4n0n9NTqwQUmlB0hhUSPXPNI9T7p5wcdlJAjyWaUuitGyQSXRpBhKFDmri5nsvHq28FEuJAgMBAAGjUDBOMB0GA1UdDgQWBBT7G1ChR+udn02VeK4KoUKwQPcLATAfBgNVHSMEGDAWgBT7G1ChR+udn02VeK4KoUKwQPcLATAMBgNVHRMEBTADAQH/MA0GCSqGSIb3DQEBCwUAA4IBAQCXrNg+88FvhMDyLGNIcR/Djrh9tf8ZHKlKCcO9+jRvyJQruKjtGD1vz1qxw4FGdhw6VqKUGYyr+naOtDIfyohH5ZvaVN5Vv7V8pVaRKfUI/FrKYPqf86tEBT6Wr2KpaRZLXwwu8vEu6v1tfi+Q9Ls0DGrgnUaiF9+oKfZDXcewF8mq+u50TgjKpHuun7lhGsp9ETnX2HiHhuejkTz2uSZp8iJW5HLxg+Jm8QMP/UZagqgev3Ur7P58uopAW2hRVobfxa3cFSOHIwh1gqq43Jb1wTaYU/99tcBpsrsZ97TokuOIxQX0tGj+EdbiZPP5FeWbSTeZTs1OI+wsk6dbU5HJ",
    assert_endpoint: "https://localhost:3000/assert",
    allow_unencrypted_assertion: false,
    sign_get_request: true
    // force_authn: true
};
var sp = new saml2.ServiceProvider(sp_options);

// Create identity provider
var idp_options = {
    sso_login_url: "https://dev-122534.oktapreview.com/app/globantdev122534_samltest_1/exken4ieussU2lEVE0h7/sso/saml",
    sso_logout_url: "https://dev-122534.oktapreview.com/app/globantdev122534_samltest_1/exken4ieussU2lEVE0h7/slo/saml",
    certificates: "MIIDpDCCAoygAwIBAgIGAWFRxposMA0GCSqGSIb3DQEBCwUAMIGSMQswCQYDVQQGEwJVUzETMBEGA1UECAwKQ2FsaWZvcm5pYTEWMBQGA1UEBwwNU2FuIEZyYW5jaXNjbzENMAsGA1UECgwET2t0YTEUMBIGA1UECwwLU1NPUHJvdmlkZXIxEzARBgNVBAMMCmRldi0xMjI1MzQxHDAaBgkqhkiG9w0BCQEWDWluZm9Ab2t0YS5jb20wHhcNMTgwMjAxMTQyOTI1WhcNMjgwMjAxMTQzMDI1WjCBkjELMAkGA1UEBhMCVVMxEzARBgNVBAgMCkNhbGlmb3JuaWExFjAUBgNVBAcMDVNhbiBGcmFuY2lzY28xDTALBgNVBAoMBE9rdGExFDASBgNVBAsMC1NTT1Byb3ZpZGVyMRMwEQYDVQQDDApkZXYtMTIyNTM0MRwwGgYJKoZIhvcNAQkBFg1pbmZvQG9rdGEuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhab3/K7sLqJ3peXdJjpXLmm7lSq9ld95oYvwUEBp0w3pjERfP7N3wIlMtsiuskgvCMNJ/YQ9hii5JlZncsibeKc+YdZNV1KjpjYzGjQ/ado1oBH/Kn7+JHcm44YyTiZEHFqf1hNg9hiGp83kg40cf1HQ5zDk7ugLxNLau4GeTD++vxqPWAIApPKTYbWkNTaSbwc7LO5SHBQTTOguVRBiKZhK4BWyTFCFc9thfAa5Y2bX0opfFPuCZ22kTxFcAV2LlTZ2tL37vkI9vxhu0Kyq+e3yBbri1nWt6gMBwVgmB/avxs6e6ivIcyZ8U9OMHmVOME9NMUrQ//UsaRQ+5AQ4xwIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQATGPVGeTwJ/n+Ztt+xN4hUcf/eAxJysX6zs7zu5AzvVoizXqHXunvLYi5jbusLo/RAuyNiGUn3CZOitkqTbbyCo7j71hS5hKaTAAzu+D6UKNA2fB4sRpFP66nwCKCYBiZSVru/2W7GjqK6msV+6u1fu2Hc+zRKsD2+2FDhYOSVprg1e6OUc8ZcfoMu3XZM+JcoBE+kekmlWcCHDufURJLRzGdKDkSSlkibFr3Yo6SABWMsSH/t32ZmZqTui+QV0SCGGyKk8afiwryIoFAugW2j0hJiQ6wRQfg/l8kVLvF+fUHNOLQHQ9ofBIaEqCFIzCDLBfhpOD4nPyBRt4ZYGK77",
    allow_unencrypted_assertion: false
};
var idp = new saml2.IdentityProvider(idp_options);

// ------ Define express endpoints ------

// Endpoint to retrieve metadata
app.get("/metadata.xml", function(req, res) {
    res.type('application/xml');
    res.send(sp.create_metadata());
});

// Starting point for login
app.get("/login", function(req, res) {
    var relayState = req.query.RelayState;
    var config = relayState ? { relay_state: relayState } : {};
    console.log("LOGIN", JSON.stringify(config));
    console.log("-----------------------");
    sp.create_login_request_url(idp, config, function(err, login_url, request_id) {
        if (err != null)
            return res.send(500);
        console.log("create_login_request_url", login_url);
        console.log("-----------------------");
        res.redirect(login_url);
    });
});

// Assert endpoint for when login completes
app.post("/assert", function(req, res) {
    var options = {request_body: req.body};
    console.log("ASSERT", JSON.stringify(options));
    console.log("-----------------------");
    sp.post_assert(idp, options, function(err, saml_response) {
        if (err != null)
            return res.send(500);

        // Save name_id and session_index for logout
        // Note:  In practice these should be saved in the user session, not globally.
        name_id = saml_response.user.name_id;
        session_index = saml_response.user.session_index;
        console.log(JSON.stringify(saml_response));
        console.log("-----------------------");

        var token = jwt.sign(saml_response.user, 'shhhhh');
        res.redirect('http://localhost:7070/#/landing?token=' + token);
    });
});

// Starting point for logout
app.get("/logout", function(req, res) {
    var options = {
        name_id: name_id,
        session_index: session_index
    };
    
    console.log("LOGOUT", JSON.stringify(options));
    console.log("-----------------------");
    sp.create_logout_request_url(idp, options, function(err, logout_url) {
        if (err != null)
            return res.send(500);
        
        console.log("create_logout_request_url", logout_url);
        console.log("-----------------------");
        res.redirect(logout_url);
    });
});

// Starting point for logout
app.post("/landing", function(req, res) {
    var options = {
        relay_state: 'http://localhost:7070'
    };
    console.log("LANDING");
    console.log("-----------------------");
    sp.create_logout_response_url(idp.sso_login_url, options, function(err, response_url) {
        console.log("create_logout_response_url", response_url);
        console.log("-----------------------");
        res.redirect(response_url);
    });
});

app.listen(3000);