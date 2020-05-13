function getData(callbackIN) {
    var ref = firebase.database().ref("patient");
        ref.once('value').then(function (snapshot) {
        callbackIN(snapshot.val())
    });
}