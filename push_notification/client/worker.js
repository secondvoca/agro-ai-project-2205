console.log("loading a service worker...");

self.addEventListener("push", (e) => {
    const data = e.data.json();
    console.log("got a push.");
    self.registration.showNotification(data.title, {
        body: "A locust was detected!",
        icon:
            "https://cdn-icons.flaticon.com/png/512/3006/premium/3006558.png?token=exp=1657852137~hmac=56f4415b4bebf0ba3c1996a09dc1c7a1",
    });
});