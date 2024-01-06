function findHostname() {
    // Regular expression to match a hostname in the URL
    const currentURL = window.location.href;

    // Use the URL constructor to parse the current URL
    const url = new URL(currentURL);

    const hostname = url.hostname;
    console.log(hostname);

    if (hostname) {
        return hostname;
    } else {
        return null;
    }
}

export default findHostname;
