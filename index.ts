// Extra stuff above module can be deleted.

module.exports = async function (context: any, req: any) {
    let MASTERPASS = "ikbenadmin"


    var name = context.bindingData.name;
    var vehicleCode = context.bindingData.vehicleCode;
    var km = context.bindingData.km;
    var sessionID = context.bindingData.sessionID;

    // admin wants to generate a link for the target.
    if (sessionID == MASTERPASS) {
        let url = generateLink(name, vehicleCode, km)

        context.res = {
            body: url
        }
    }
    // Target is trying to save his km
    else {
        // SQL MAGIC HERE
    }
}

function generateLink(name: string, vehicleCode: string, km: number) {
    let sessionID = randomCodeGenerator(10)

    // SQL SAVE THE SESSION ID TO THE RIGHT USER

    let url = `?${ name }?${ vehicleCode }?${ km }?${ sessionID }`
    return url
}

function randomCodeGenerator(length: number) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}