function getUpdateStatus(elementId, npUri) {
  document.getElementById(elementId).innerHTML = "<em>Checking for updates...</em>";
  const apiUrl = 'https://grlc.nps.petapico.org/api/local/local/get_latest_version?np=' + npUri;
  var r = new XMLHttpRequest();
  r.open('GET', apiUrl, true);
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
    } else {
      h = "<em>An error has occurred while checking for updates.</en>";
    }
    document.getElementById(elementId).innerHTML = h;
  };
  r.send();
};
