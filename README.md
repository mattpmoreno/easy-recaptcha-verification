# Why does this exist?
The [Google docs for setting up recaptcha](https://developers.google.com/recaptcha/docs/verify) are pretty good, but it can still be a bit of a headache setting up recaptcha verification. With this package, I'm hoping to provide a few useful tools that streamline incorporation of recaptcha verification into your backend server.

# Setup

1. Sign up with Google to use their recaptcha service, set up the recaptcha secret token in the environment variables of your backend server (or wherever you prefer to put it).
2. **Verify Recaptcha Response:** When the user sends a recaptcha token to your backend to verify some request:


    // Import this module
    let easyRecaptcha = require('easy-recaptcha-verification');
    ... // Wherever you plan to verify the frontend recaptcha token
    const recaptchaResponse = await easyRecaptcha.checkRecaptchaToken(
        recaptchaToken,
        process.env.RECAPTCHA_SECRET
    );
    // if the recaptcha token checks out, then you keep going
    if (recaptchaResponse.goodToGo) {
        ...
    } else {
        // if using express, then you can return error
        // (or throw or whatever works for your backend)
        return recaptchaResponse.error;
    }