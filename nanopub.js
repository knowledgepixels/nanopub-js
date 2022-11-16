const grlcNpApiUrls = ['https://grlc.nps.petapico.org/api/local/local/'];
//const grlcNpApiUrls = ['https://test1.com/foo', 'https://grlc.nps.petapico.org/api/local/local/', 'https://test2.com/bar'];

function getUpdateStatus(elementId, npUri) {
  document.getElementById(elementId).innerHTML = "<em>Checking for updates...</em>";
  getUpdateStatusX(elementId, npUri, [...grlcNpApiUrls]);
}

function getUpdateStatusX(elementId, npUri, apiUrls) {
  if (apiUrls.length == 0) {
    document.getElementById(elementId).innerHTML = "<em>An error has occurred while checking for updates.</en>";
    return;
  }
  var apiUrl = apiUrls.shift();
  //console.log('Trying ' + apiUrl);
  requestUrl = apiUrl + '/get_latest_version?np=' + npUri;
  var r = new XMLHttpRequest();
  r.open('GET', requestUrl, true);
  r.setRequestHeader('Accept', 'application/json');
  r.responseType = 'json';
  r.onload = function() {
    var h = '';
    if (r.status == 200) {
      const bindings = r.response['results']['bindings'];
      if (bindings.length == 1 && bindings[0]['latest']['value'] === npUri) {
        h = 'This is the latest version.';
      } else if (bindings.length == 0) {
        h = 'This nanopublication has been <strong>retracted</strong>.'
      } else {
        h = 'This nanopublication has a <strong>newer version</strong>: ';
        if (bindings.length > 1) {
        h = 'This nanopublication has <strong>newer versions</strong>: ';
        }
        for (const b of bindings) {
          l = b['latest']['value'];
          h += ' <code><a href="' + l + '">' + l + '</a></code>';
        }
      }
      document.getElementById(elementId).innerHTML = h;
    } else {
      getUpdateStatusX(elementId, npUri, apiUrls);
    }
  };
  r.onerror = function(error) {
    getUpdateStatusX(elementId, npUri, apiUrls);
  }
  r.send();
}
