onmessage = function(e) {
    let t = 0;
    for (let i = 0; i < e.data; i++) { t += i; }
    postMessage(t);
  };