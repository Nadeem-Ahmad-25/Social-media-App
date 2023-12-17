import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { fromIni } from "@aws-sdk/credential-provider-ini";
import dotenv from "dotenv";
dotenv.config();
const region = "ap-south-1"
const ses = new SESClient({
    region,
    credentials: fromIni({profile: "myprofile"}),
});

function createSendEmailCommand(toAddress: string, fromAddress: string, subject: string){
    return new SendEmailCommand({
        Destination:{
            ToAddresses:[toAddress],
        },
        Source: fromAddress,
        Message: {
            Subject: {
                Charset: 'UTF-8',
                Data: "Your one-time password"
            },
            Body: {
                Text:{
                    Charset: 'UTF-8',
                    Data: subject
                }
            },

        },
    })
}

export async function sendEmailToken(email: string, token: string){
    console.log("email : ", email, token);
    const message= `Your one-time password is : ${token}` 
    const command = createSendEmailCommand(email, "yusakhan.yk@gmail.com", message);


    try{
        return await ses.send(command);
    }
    catch(err){
        console.log("error sending email", err);
        return err;
    }
}
