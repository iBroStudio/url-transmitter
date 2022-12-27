function saveOptions(e) {
    browser.storage.sync.set({
      endpoint: {
        url: document.querySelector("#endpoint_url").value,
        token: document.querySelector("#endpoint_token").value,
      },
      sources: document.querySelector("#sources").value.split(",")
    });
    e.preventDefault();
  }

function restoreOptions () {

    let endpoint = browser.storage.sync.get('endpoint');
    endpoint.then((res) => {
      document.querySelector("#endpoint_url").value = res.endpoint.url;
      document.querySelector("#endpoint_token").value = res.endpoint.token;
    });

    let sources = browser.storage.sync.get('sources');
    sources.then((res) => {
      document.querySelector("#sources").value = res.sources.join();
    });

  }

  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.querySelector("form").addEventListener("submit", saveOptions);