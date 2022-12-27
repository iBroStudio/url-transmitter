function process () {

    let gettingActiveTab = browser.tabs.query({ active: true, currentWindow: true });

    gettingActiveTab.then(transmit, onError);
}

function transmit (tabInfo) {

    browser.pageAction.setIcon({ tabId: tabInfo[0].id, path: "icons/transmitting.svg" });

    let getSources = browser.storage.sync.get('endpoint');

    getSources.then((result) => {

        let myHeaders = new Headers({
            "Accept": 'application/json',
            "Content-Type": 'application/json',
            Authorization: 'Bearer ' + result.endpoint.token
          });

        fetch(result.endpoint.url, {
            method: 'POST',
            headers: myHeaders,
            mode: "cors",
            body: JSON.stringify({ url: tabInfo[0].url }),
            cache: 'default'

        }).then(resp => {

            browser.pageAction.setIcon({ tabId: tabInfo[0].id, path: "icons/done.svg" });

        }).catch(error => {

            browser.pageAction.setIcon({ tabId: tabInfo[0].id, path: "icons/error.svg" });

            console.error(error)
        });

    }, onError);
}

function onError (error) {

    console.log(error);
}

function initializePageAction (tab) {

    let getSources = browser.storage.sync.get('sources');

    getSources.then((result) => {

        const url = (new URL(tab.url));
        const domain = url.hostname;

        if (result.sources.includes(domain)) {

            browser.pageAction.setIcon({tabId: tab.id, path: "icons/transmit.svg"});
            browser.pageAction.setTitle({tabId: tab.id, title: "Transmit!"});
            browser.pageAction.show(tab.id);
        }

    }, onError);
  }

let gettingAllTabs = browser.tabs.query({});

gettingAllTabs.then((tabs) => {

    for (let tab of tabs) {

      initializePageAction(tab);
    }
  });

browser.tabs.onUpdated.addListener((id, changeInfo, tab) => {

    initializePageAction(tab);

});

browser.pageAction.onClicked.addListener(process);