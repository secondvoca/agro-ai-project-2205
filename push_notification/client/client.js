const publicVapidKey = "BNIzDhe0gjguRMGE4EBMoybwBIA-CG3cZrGL7KdzxrBhlOw3FUSOsNwXkDhSiwPl-n8Tt5NSbUPppzbdRN6ry-0"

if ("serviceWorker" in navigator) {
    send().catch((err) => console.error(err))
}

async function send() {
    console.log("registering a service worker...")
    const register = await navigator.serviceWorker.register("/worker.js", { scope: "/", })
    console.log("service worker is ready now.");
    console.log("registering a push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    })
    console.log("push is ready now.");
    console.log("sending the push");
    await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json",
        },
    })
    console.log("the push has been sent.");
}

function urlBase64ToUint8Array(base64String){
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}