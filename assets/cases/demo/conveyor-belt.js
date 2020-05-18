cc.Class({
    extends: cc.Component,

    properties: {
        tangentSpeed: 5
    },

    onPreSolve: function (contact) {
        contact.setTangentSpeed( this.tangentSpeed );
    },

    onPostSolve: function(contact) {
        console.log("#########", contact);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});
