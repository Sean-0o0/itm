export function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
  // compatibility for firefox and chrome
  const myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
  let pc = new myPeerConnection({
      iceServers: [],
    }),
    noop = function () {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

  function iterateIP(ip) {
    if (!localIPs[ip]) onNewIP(ip);
    localIPs[ip] = true;
  }

  // create a bogus data channel
  pc.createDataChannel('');

  // create offer and set local description
  pc.createOffer().then((sdp) => {
    sdp.sdp.split('\n').forEach((line) => {
      if (line.indexOf('candidate') < 0) return;
      line.match(ipRegex).forEach(iterateIP);
    });

    pc.setLocalDescription(sdp, noop, noop);
  }).catch((reason) => {
    // An error occurred, so handle the failure to connect
  });

  // listen for candidate events
  pc.onicecandidate = function (ice) {
    // const t = ice.candidate.toJSON();
    if(ice && ice.candidate && ice.candidate.candidate && ice.candidate.candidate.indexOf('.local') !== -1) {
      iterateIP(-1);
    } else {
      if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
      ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    }
  };
}
