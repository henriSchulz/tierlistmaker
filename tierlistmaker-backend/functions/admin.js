const {initializeApp, cert} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

const serviceAccount = require("./src/keys/sandbox-655bf-firebase-adminsdk-8ijzk-d11014687d.json");

const ID_PROPERTIES = {
    length: 16, characters: 'abcdefghijklmnopqrstuvwxyz0123456789'
}

function generateModelId(length = ID_PROPERTIES.length) {
    const characters = ID_PROPERTIES.characters
    let id = '';

    for (let i = 0; i < length; i++) {
        id += characters[Math.floor(Math.random() * characters.length)];
    }
    return id;
}

function parseArgs() {
    const args = process.argv.slice(2)
    let command = args[0]
    let values = args.slice(1)
    return {command, args: values}
}

const app = initializeApp({
    credential: cert(serviceAccount), storageBucket: "tierlistmaker-2e01f.appspot.com"
});


async function main() {
    const {command, args} = parseArgs()
    const db = getFirestore(app)
    if (command === "vote") {
        const [tierlistId] = args
        const numberOfVotes = parseInt(args[1])
        if (!tierlistId || !numberOfVotes) {
            return console.log("Missing arguments")
        }

        for (const i of Array.from({length: numberOfVotes}, (_, i) => i)) {
            const vote = {
                tierlistId, id: `${generateModelId()}`, clientId: "fake-vote-client"
            }
            await db.collection("votes").doc(vote.id).set(vote)
        }

        return console.log(`Added ${numberOfVotes} votes to ${tierlistId}`)


    }


    console.log("Command not found")
}


main()




