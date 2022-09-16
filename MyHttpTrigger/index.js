// CONFIG ---- Start with "http(s)://"" and end with a "/".
const URLDOMAIN = "http://127.0.0.1:5500/";
let MASTERPASS = "ikbenadmin";
// CONFIG ----


module.exports = async function (context, req, workersIN) {
    workersIN = workersIN[0];

    console.log("here");
    let surName = context.bindingData.surName;
    let lastName = context.bindingData.lastName;
    let vehicleCode = context.bindingData.vehicleCode;
    let vehicleDescription = context.bindingData.vehicleDescription;
    let km = context.bindingData.km;
    let transactionID = context.bindingData.transactionID;

    // admin wants to generate a link for the target.
    if (transactionID == MASTERPASS) {
        let url = generateLink(workersIN, surName, lastName, vehicleCode, vehicleDescription, context);
        context.res = {
            body: url
        };
    }
    // Target is trying to save his km.
    else {
        // Search for the worker's name and get his values.
        if (workersIN.transactionID == transactionID) {
            // update the database, remove the transactionID.
            // get the km.
            if (km < workersIN.km) {
                // The value that the user has given is lower than what's in the database.
                var res = { body: `<meta http-equiv=\"refresh\" content=\"0; url=${URLDOMAIN}?${workersIN.name}?${workersIN.vehicleDescription}?${workersIN.km}?${transactionID}?low" />`, headers: { "Content-Type": "text/html" } };
                context.res = res;
            }
            else {
                workersIN.transactionID = randomCodeGenerator(10);
                // SQL update worker's km
                workersIN.km = km;

                // The value that the user has given is ok!
                var res = { body: `<meta http-equiv=\"refresh\" content=\"0; url=${URLDOMAIN}?${workersIN.name}?${workersIN.vehicleDescription}?${workersIN.km}?${transactionID}?ok" />`, headers: { "Content-Type": "text/html" } };
                context.res = res;
            }
        }
        else {
            context.res = {
                body: "INVALID transactionID"
            };
            // User's transactionID is not valid. Tell him his link is invalid.
        }
    }
};

function generateLink(workersIN, surName, lastName, vehicleCode, vehicleDescription, context) {
    workersIN.surName = surName;
    workersIN.lastName = lastName;
    workersIN.vehicleCode = vehicleCode;
    workersIN.vehicleDescription = vehicleDescription;
    workersIN.transactionID = randomCodeGenerator(10);

    updateWorker(workersIN, context);

    // INDEX SITE COMES HERE
    let url = `${URLDOMAIN}?${surName}?${lastName}?${vehicleCode}?${workersIN.km}?${vehicleDescription}?${workersIN.transactionID}`;
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
function updateWorker(workersIN, context) {
    context.bindings.workersOUT = JSON.stringify(workersIN);
}
