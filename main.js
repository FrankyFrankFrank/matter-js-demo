import Matter from 'matter-js'

var Example = Example || {};

Example.compound = function () {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Events = Matter.Events,
        Constraint = Matter.Constraint,
        Composite = Matter.Composite,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Vector = Matter.Vector,
        Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
        world = engine.world;

    // create random HSL color
    const getRandomColor = () => {
        return `hsla(${Math.random() * 360}, ${Math.random() * 50 + 30}%, ${Math.random() * 50 + 30}%)`
    }
    var randomColor = getRandomColor()

    // create renderer
    var render = Render.create({
        element: document.body,
        engine: engine,
        options: {
            width: 800,
            height: 600,
            wireframes: false,
            background: randomColor
        }
    });

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    const pegRadius = 10;
    const pegGap = 40;
    const pegCount = 40;
    const pegsPerRow = 10;

    const pegOptions = {
        render: {
            fillStyle: 'red'
        },
        isStatic: true,
        friction: 0,
        restitution: 0.2,
        frictionAir: 0.01,
        frictionStatic: 0.01,
    }
    const pegBodies = [];

    for (let r = 0; r < Math.floor(pegCount / pegsPerRow); r++) {
        const pegsInThisRow = (r % 2 == 0) ? pegsPerRow : pegsPerRow - 1
        for (let c = 0; c < pegsInThisRow; c++) {
            const startX = (r % 2 == 0) ? 0 : (pegGap + pegRadius) / 2
            const pegX = startX + c * (pegRadius + pegGap);
            const pegY = r * (pegRadius + pegGap);
            const pegBody = Bodies.circle(-pegX + 600, -pegY + 500, pegRadius, pegOptions);
            Composite.add(world, pegBody);
        }
    }

    const ballRadius = 10;
    const ballOptions = {
        render: {
            fillStyle: 'blue'
        },
        isStatic: false,
        friction: 0,
        restitution: 1,
        frictionAir: 0.01,
        frictionStatic: 0.01,
    }
    const ball = Bodies.circle(render.canvas.width / 2, render.canvas.height / 4, ballRadius, ballOptions);
    const vector = Vector.create(Math.random() * 0.0012, 0);
    Composite.add(world, ball);
    Body.applyForce(ball, { x: 0, y: 0 }, vector);

    var floor = Bodies.rectangle(400, 600, 800, 50.5),
        leftWall = Bodies.rectangle(0, 300, 50.5, 600),
        rightWall = Bodies.rectangle(800, 300, 50.5, 600);

    var floorAndWalls = Body.create({
        parts: [
            floor,
            leftWall,
            rightWall,
        ],
        isStatic: true
    })

    Composite.add(world, [
        floorAndWalls,
        pegBodies
    ]);

    // add mouse control
    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
        min: { x: 0, y: 0 },
        max: { x: 800, y: 600 }
    });

    Events.on(engine, 'collisionStart', function (event) {
        var pairs = event.pairs;

        // change object colours to show those starting a collision
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            pair.bodyA.render.fillStyle = getRandomColor();
            pair.bodyB.render.fillStyle = getRandomColor();
        }
    });

    Events.on(engine, 'collisionEnd', function (event) {
        var pairs = event.pairs;

        // change object colours to show those starting a collision
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            pair.bodyA.render.fillStyle = getRandomColor();
            pair.bodyB.render.fillStyle = getRandomColor();
        }
    });

    // context for MatterTools.Demo
    return {
        engine: engine,
        runner: runner,
        render: render,
        canvas: render.canvas,
        stop: function () {
            Matter.Render.stop(render);
            Matter.Runner.stop(runner);
        }
    };
};

Example.compound.title = 'Compound Bodies';
Example.compound.for = '>=0.14.2';

if (typeof module !== 'undefined') {
    module.exports = Example.compound;
}

Example.compound()