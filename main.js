async function tts(text, _lang, options = {}) {
    const { config } = options;

    let { requestPath, apiKey, model, voice, speed } = config;

    if (!requestPath) {
        requestPath = "https://api.openai.com";
    }

    if (!/https?:\/\/.+/.test(requestPath)) {
        requestPath = `https://${requestPath}`;
    }
    const apiUrl = new URL(requestPath);

    // in openai like api, /v1 is not required
    if (!apiUrl.pathname.endsWith('/audio/speech')) {
        apiUrl.pathname += apiUrl.pathname.endsWith('/') ? '' : '/';
        apiUrl.pathname += 'v1/audio/speech';
    }

    if (!apiKey) {
        throw "apiKey is required";
    }
    if (!model) {
        model = "tts-1";
    }
    if (!voice) {
        voice = "alloy";
    }
    if (!speed) {
        speed = 1.0;
    }

    const res = await window.fetch(apiUrl.href, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model,
            voice,
            speed: parseFloat(speed),
            input: text,
        })
    });

    if (res.ok) {
        const audioData = await res.blob();
        return audioData;
    } else {
        const errorData = await res.text();
        throw `Http Request Error\nHttp Status: ${res.status}\n${errorData}`;
    }
}