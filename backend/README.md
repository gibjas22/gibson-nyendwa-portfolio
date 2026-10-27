# Contact form backend: API Gateway, Lambda and SES

The site is static, so the contact form posts to a small serverless backend. Three AWS services, all in **Europe (London) eu-west-2**, all inside the free tier at portfolio traffic levels.

```
browser  --POST /contact-->  API Gateway (HTTP API)  -->  Lambda (index.mjs)  -->  SES  -->  info@gcmarketingsupport.co
```

Time to set up by hand: about 30 minutes, plus waiting for the SES verification email.

## 1. Verify the sender address in SES

SES will only send from an address it has verified.

1. Console, **Amazon SES**, Region **Europe (London)**.
2. **Identities**, **Create identity**, type **Email address**, enter `info@gcmarketingsupport.co`, **Create identity**.
3. SES emails a verification link to that address. Open it. The identity shows **Verified**.
4. New accounts start in the **SES sandbox**: you can only send **to** verified addresses. Because the form sends to the same address that is verified as the sender, that is fine for this site. Nothing else is needed unless you later want to email other people.

## 2. Create the Lambda function

1. Console, **Lambda**, **Create function**, **Author from scratch**.
2. Name `portfolio-contact`, runtime **Node.js 20.x**, architecture arm64, **Create function**.
3. In the code editor, replace the contents of `index.mjs` with the file in this folder, then **Deploy**.
4. **Configuration**, **Environment variables**, add:
   - `TO_EMAIL` = `info@gcmarketingsupport.co`
   - `FROM_EMAIL` = `info@gcmarketingsupport.co`
   - `ALLOW_ORIGIN` = `https://main.dbthjbi29n1oo.amplifyapp.com`
5. **Configuration**, **General configuration**, timeout **10 seconds**.
6. **Configuration**, **Permissions**, click the execution role name. In IAM, **Add permissions**, **Create inline policy**, JSON:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["ses:SendEmail"],
    "Resource": "*",
    "Condition": { "StringEquals": { "ses:FromAddress": "info@gcmarketingsupport.co" } }
  }]
}
```

   Name it `portfolio-contact-ses-send`. This lets the function send only from that one address.

## 3. Create the HTTP API

1. Console, **API Gateway**, **Create API**, **HTTP API**, **Build**.
2. **Add integration**, Lambda, choose `portfolio-contact`. API name `portfolio-contact-api`. **Next**.
3. Routes: method **POST**, path `/contact`, integration the Lambda. Add a second route **OPTIONS** `/contact` with the same integration. **Next**.
4. Stage: `$default`, auto-deploy on. **Create**.
5. Open the API, **CORS**: Access-Control-Allow-Origin `https://main.dbthjbi29n1oo.amplifyapp.com`, Allow-Headers `content-type`, Allow-Methods `POST, OPTIONS`. Save.
6. **Throttling** (left menu, under the stage): default route throttling **Burst 5**, **Rate 2** requests per second. That is the rate limit; nobody fills a contact form faster than that.
7. Copy the **Invoke URL**. The endpoint is `<Invoke URL>/contact`.

## 4. Point the site at it

In `js/contact.js`, set:

```js
const ENDPOINT = "https://xxxxxxxxxx.execute-api.eu-west-2.amazonaws.com/contact";
```

Commit and push. Amplify redeploys. The form replaces the email fallback automatically once `ENDPOINT` is non-empty.

## 5. Test

1. Open the live site, scroll to Contact. Submit with an empty name: an inline error appears, nothing is sent.
2. Submit with a bad email: inline error.
3. Submit a real message with the subject "Test from the portfolio form". The button shows **Sending**, then **Sent**, and the status line confirms.
4. Check the inbox: an email arrives with **Reply-To** set to the address you typed. Reply to it to prove the loop works.
5. In the Lambda console, **Monitor**: one invocation, no errors.

Backend acceptance (the 200 response) and email delivery (the message in the inbox) are different checks. Both are needed before the form counts as working.

## What is deliberately not here

- No database. Messages exist only as the email that is sent.
- No CAPTCHA. The honeypot, minimum fill time and throttling are proportionate for a portfolio. Add Turnstile or reCAPTCHA if spam ever appears.
- No marketing list. The form sends one email and stops.
