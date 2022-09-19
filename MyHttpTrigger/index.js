// CONFIG ---- Start with "http(s)://"" and end with a "/".
const URLDOMAIN = "http://127.0.0.1:5501/";
let MASTERPASS = "ikbenadmin";
// CONFIG ----


module.exports = async function (context, req, databaseIN) {
    let lastKM = 0
    if (databaseIN.length != 0){
        databaseIN = databaseIN[0];
        lastKM = databaseIN.km;
    }
    // else lastKM stays 0, because the vehicle is never used.
    
    let surName = context.bindingData.surName;
    let lastName = context.bindingData.lastName;
    let vehicleCode = context.bindingData.vehicleCode;
    let vehicleDescription = context.bindingData.vehicleDescription;
    let km = context.bindingData.km;
    let transactionID = context.bindingData.transactionID;

    let timeID = new Date().getTime() / 1000;

    // admin wants to generate a link for the target.
    if (transactionID == MASTERPASS) {
        databaseIN = {
            "timeID": timeID,
            "surName": surName,
            "lastName": lastName,
            "vehicleCode": vehicleCode,
            "km": lastKM,
            "transactionID": randomCodeGenerator(10),
            "status": "new"
        }

        let url = generateLink(databaseIN, vehicleDescription, context);
        context.res = {
            body: url
        };
    }
    // Target is trying to save his km.
    else if (databaseIN.transactionID == transactionID) {
        // The km input is valid, update it.
        if (km > lastKM) {
            // update the user
            databaseIN = {
            "id":databaseIN.id,
            "timeID": timeID,
            "surName": surName,
            "lastName": lastName,
            "vehicleCode": vehicleCode,
            "km": km,
            "transactionID": randomCodeGenerator(10),
            "status": "submitted"
        }

        addWorker(databaseIN, context)

        // The value that the user has given is ok!
        context.res = { body: `<meta http-equiv=\"refresh\" content=\"0; url=${URLDOMAIN}?${databaseIN.surName}?${databaseIN.lastName}?${databaseIN.vehicleCode}?${databaseIN.km}?${databaseIN.transactionID}?${vehicleDescription}?ok" />`, headers: { "Content-Type": "text/html" } };
        }
        else {
            // The value that the user has given is lower than what's in the database.
            context.res = { body: `<meta http-equiv=\"refresh\" content=\"0; url=${URLDOMAIN}?${databaseIN.surName}?${databaseIN.lastName}?${databaseIN.vehicleCode}?${databaseIN.km}?${databaseIN.transactionID}?${vehicleDescription}?low" />`, headers: { "Content-Type": "text/html" } };
        }
    } 
    else {
        context.res = {
            body: "INVALID transactionID"
        };
    }
}

function generateLink(databaseIN, vehicleDescription, context) {
   
    addWorker(databaseIN, context);
    
    // URL FOR THE WEBPAGE.
    let url = `${URLDOMAIN}?${databaseIN.surName}?${databaseIN.lastName}?${databaseIN.vehicleCode}?${databaseIN.km}?${databaseIN.transactionID}?${vehicleDescription}`;
    return url;
}

function randomCodeGenerator(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

// make the values 'undefined' if you don't want them changed.
function addWorker(databaseIN, context) {
    context.bindings.workersOUT = JSON.stringify(databaseIN);
}






