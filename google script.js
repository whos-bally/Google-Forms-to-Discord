const POST_URL = "WEBHOOK_URL";

function onSubmit(e) {
    const response = e.response.getItemResponses();
    let items = [];

    for (const responseAnswer of response) {
        const question = responseAnswer.getItem().getTitle();
        const answer = responseAnswer.getResponse();
        let parts = []

        try {
            parts = answer.match(/[\s\S]{1,1024}/g) || [];
        } catch (e) {
            parts = answer;
        }

        if (!answer) {
            continue;
        }

        for (const [index, part] of Object.entries(parts)) {
            if (index == 0) {
                items.push({
                    "name": question,
                    "value": part,
                    "inline": false
                });
            } else {
                items.push({
                    "name": question.concat(" (cont.)"),
                    "value": part,
                    "inline": false
                });
            }
        }
    }

    const options = {
        "method": "post",
        "headers": {
            "Content-Type": "application/json",
        },
        //TTS disabled, and date of post added to footer
        "payload": JSON.stringify({
            "content": "‌",
            "tts": false,
            "embeds": [{
                "type": "rich",
                "title": "Title",
                "color": 0xFFD200, // Use "0x" before the hex number so the API can convert to decimal RGB 
                "fields": items,
                "footer": {
                     "text": `Submitted on ` + new Date().toISOString()
                  },
                "timestamp": new Date().toISOString()
            }]
        })
    };

    UrlFetchApp.fetch(POST_URL, options);
};
