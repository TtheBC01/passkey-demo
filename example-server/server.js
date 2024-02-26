const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 80;

app.get("/", (req, res) => {
    res.send("Hello World! 🌎");
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Route handling for submitting predictions
app.get("/register", async (req, res) => {
    try {
        // Extract data from the user's information
        const username = sanitizeHtml(req.query["username"]);
        const base64UrlEncodedPublicKey = sanitizeHtml(req.query["pubkey"]);
        const base64UrlEncodedKeyID = sanitizeHtml(req.query["keyid"]);

        // keyid is your index for retrieving the pubkey later on 
        // username is only there to help end-user remember what the key was for

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

// Route handling for getting user information
app.get("/login", async (req, res) => {
    try {
        // Extract data from the user's request
        const keyID = sanitizeHtml(req.query["keyid"]);
        const base64UrlEncodedsignature = sanitizeHtml(req.query["signature"]);
        const base64UrlEncodedAuthenticatorData = sanitizeHtml(req.query["authdata"]);
        const base64UrlEncodedClientDataJSON = sanitizeHtml(req.query["clientdata"]);

        // 1. look up associated public key using supplied keyid
        // throw some DB lookups here

        // 2. Ensure the clientDataJSON matches what you expect before verifying signature
        const { type, clientChallenge, origin } = JSON.parse(
            Buffer.from(base64UrlEncodedClientDataJSON, "base64url"),
          );
        
          if (type !== "webauthn.get") {
            return false;
          }
        
          if (origin !== "https://example.com") {
            return false;
          }
        
          const relyingPartyChallenge = "The challenge the Relying Party sent to be signed by the client."
        
          if (
            clientChallenge !==
            Buffer.from(relyingPartyChallenge, "utf8").toString(
              "base64url",
            )
          ) {
            return false;
          }


        // 3. then verify the user signature matches the public key.
        // Create a Verify object and update it with the data to be verified
        const verify = crypto.createVerify("sha256");

        const cDataHash = crypto.createHash("sha256").update(Buffer.from(base64UrlEncodedClientDataJSON, "base64url")).digest()
        const authMessageBuffer = Buffer.concat([
            Buffer.from(base64UrlEncodedAuthenticatorData, "base64url"),
            cDataHash,
        ]);
        verify.update(authMessageBuffer);

        const publicKeyBuffer = crypto.createPublicKey({
            key: base64UrlEncodedsignature,
            format: "der",
            type: "spki",
            encoding: "base64url",
        });

        // Verify the signature against the public key
        const isSignatureValid = verify.verify(
            publicKeyBuffer,
            signature,
            "base64url",
        );

        // return user object or error
        if (isSignatureValid) {
            return res.status(200);
        } else {
            return res.status(420).json({ message: "Signature did not verify" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});