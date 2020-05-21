cc.Class({

    extends: cc.Component,

    properties: {
        radius: 1000
    },

    // use this for initialization
    onLoad: function () {
        this.ctx    = this.getComponent(cc.Graphics);
        this.angle  = 0;
        this.center = cc.v2(cc.winSize.width/2, cc.winSize.height/2);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.angle += Math.PI / 20 * dt;
        var p1 = this.center;


        /*
        var p2 = cc.v2(Math.cos(this.angle), Math.sin(this.angle)).mulSelf(this.radius).addSelf(this.center);
        this.ctx.clear();
        this.remainLength = this.radius;
        this.rayCast(p1, p2);
        */

       //this.rayCast0(p1)
       this.testRayCast0(p1);
    },


    testRayCast0: function(p1) {
        this.ctx.clear();
        this.remainLength = this.radius;

        var dirVec = cc.v2(Math.cos(this.angle), Math.sin(this.angle));
        this.testRayCast(p1, dirVec)
    },

    testRayCast: function(startLocation, dirVec) {
        if (this.remainLength <= 0) {
            return;
        }

        var endLocation = startLocation.add(dirVec.mul(this.remainLength));

        var manager = cc.director.getPhysicsManager();
        var results = manager.rayCast(startLocation, endLocation);

        if (results.length > 0) {
            var result = results[0];
            var tPoint = result.point;
            this.drawAimLine(startLocation, tPoint);

            var tDrawLen = tPoint.sub(startLocation).mag();
            this.remainLength -= tDrawLen;

            //const vector_r = vector_i.sub(vector_n.mul(2 * vector_i.dot(vector_n)));
            var normalVec = result.normal;
            var reflectDirVec = dirVec.sub(normalVec.mul(2 * dirVec.dot(normalVec)));
            this.testRayCast(tPoint, reflectDirVec);
        } else {
            this.drawAimLine(startLocation, endLocation);
        }
    },


    drawAimLine: function(startLocation, endLocation) {

        startLocation = cc.v2(startLocation.x, startLocation.y);

        this.ctx.moveTo(startLocation.x, startLocation.y);

        var delta    = 20;
        var dirVec   = endLocation.sub(startLocation);
        var totalCnt = Math.round(dirVec.mag() / delta);
        //console.log("######cnt:", totalCnt);

        dirVec.normalizeSelf().mulSelf(delta);

        for (var i = 0; i < totalCnt; i++) {
            startLocation.addSelf(dirVec);
            this.ctx.circle(startLocation.x, startLocation.y, 2);
            this.ctx.fill();
        }

    },



    rayCast0: function(p1) {
        this.ctx.clear();
        this.remainLength = this.radius;

        var p2 = cc.v2(Math.cos(this.angle), Math.sin(this.angle)).mulSelf(this.radius).addSelf(this.center);        
        this.rayCast(p1, p2);
    },
    rayCast: function (p1, p2) {
        var manager = cc.director.getPhysicsManager();
        var result = manager.rayCast(p1, p2)[0];

        if (result) {
            p2 = result.point;
            this.ctx.circle(p2.x, p2.y, 5);
            this.ctx.fill();
        }

        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();

        if (!result) return;

        this.remainLength = this.remainLength - p2.sub(p1).mag();
        if (this.remainLength < 1) return;

        result.normal.mul(this.remainLength);

        p1 = p2;
        p2 = result.normal.mul(this.remainLength).add(p1);
        this.rayCast(p1, p2);
    }
});
