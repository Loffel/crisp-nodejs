var fs = require("fs");
var Crisp = require("node-crisp-api");
var CrispClient  = new Crisp();

var settings = require('./settings.json');

const identifier = settings.identifier,
    key = settings.key;

CrispClient.authenticate(identifier, key);

var websiteId = settings.websiteId;

async function main(){
    var convers = [],
        page = 1;
    while(true){
        let convs = await CrispClient.websiteConversations.getList(websiteId, page).then(function(conversations){
            return conversations;
        });

        if (typeof convs !== 'undefined' && convs.length > 0){
            convers = convers.concat(convs);
        }else break;
        
        page++;
    }

    var conversationsCount = convers.length;

    for(var i = 0; i < conversationsCount; i++){
        let messagesData = await getMessages(convers[i].session_id);
        convers[i].messages = messagesData;
    }

    let fileData = JSON.stringify(convers, null, 4);
    fs.writeFileSync('./data.json', fileData);
}


async function getMessages(session){
    let messages = await CrispClient.websiteConversations.getMessages(websiteId, session, {});
    
    return messages
}

main();