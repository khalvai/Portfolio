
---
title: "Result pattern, on failure"
description: When a command fails, and we want to execute a business logic in application layer
draft: false
tags: ["failure", "application-layer","result-patter", "patterns", "typescript"]
date: 2026-09-03
image: ""

---


Let say we have a method called sendOTP() which talks with our sms provider in infrastructure layer. 



```ts
//application layer

await sendOtp()
```

```ts
  
// infrastructure layer
async function sendOTP(data:{...}) {

//  Talk to third party to send the template

const data = await fetch({
	url: "https://your-third-party-sms-provider.com/send",
	method: "POST",
	body: JSON.stringify({
	to: phoneNumber,
	template: "Your verification code is {{otp}}",
});
  
	if (!data.ok) {
		throw new Error("Failed to send OTP");	
	}

    return {
        success: true,    
        message: "OTP sent successfully",
        };

}
```

On the failure mode, we want to invalidate otp and then notify user.

This policy should be in application layer, not in infrastructure, so what should we do?

 I discussed two approaches in this blog.

 ### 1. Catch the method in the application layer

```ts
// application layer
try {
await sendOtp()
} catch(err)(

// Invalidate otp

  throw err
)
```

- In this approach, we are catching and rethrowing the same error
- It is efficient and causes performance challenges.
-  It is a bad practice.


## 2. Use of result pattern
 -  lets say we have this simple interface as Result pattern:
 ```ts
 export type Result<V, E > = { failed: true; error: E } | { failed: false; value: V }
 ```
 
 - It simply says, you can have two possible type, 
 -  {failed:false, value:"yourData"} or { failed: true, error: "yourError"}

-  We can integrate this with our own custom Exception ( In the future, i will post about my custom Exception and integration with result pattern.)

- Now with this interface, we have this:

```ts
 type Result<V, E> =

| { failed: true; error: E }

| { failed: false; value: V };

  

async function SendOTP(data:{...}): Promise<Result<string, Error>> {

try {

// Talk to third party to send the template

const response = await fetch();
 
 // check the error of this party (400,404,5**...)
	if (!response.ok) {
	
	const errorData = await response.json();
	
	return { failed: true, error: new Error(errorData.message) };
	
	}
	
	return { failed: false, value: "OTP Sent." };
	
	} catch (err) {
	
	// If we had a network issue
	return { failed: true, error: new Error(err) };

	}

}
```


Now the beauty part is that, we can differentiate the network errors and third party ones. Therefore, based on each of it, we can do what we want on application layer.



```ts
// application layer

const result= await SendOTP({...})
  
    if(result.failed){
	// invalidate the otp
	
        throw result.error
    }

```


In conclusion, it is not more like type checking but about having a convention with teammates.  It shows its power when you know something might fail, you suppose that it will return result and continue your task with that assumption.

