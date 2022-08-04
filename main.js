import Matter from 'matter-js'

var Example = Example || {};

Example.compound = function() {
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Body = Matter.Body,
        Events = Matter.Events,
        Constraint = Matter.Constraint,
        Composite = Matter.Composite,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
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

    // add bodies
    var size = 200,
        x = 200,
        y = 200;

    var partC = Bodies.circle(x, y, 30, { render: { fillStyle: '#ff0000' }  }),
        partD = Bodies.circle(x + size, y, 30),
        partE = Bodies.circle(x + size, y + size, 30),
        partF = Bodies.circle(x, y + size, 30);

    var compoundBodyB = Body.create({
        parts: [partC, partD, partE, partF]
    });

    var constraint = Constraint.create({
        pointA: { x: 400, y: 100 },
        bodyB: compoundBodyB,
        pointB: { x: 0, y: 0 }
    });

    

    // array from random number between 3 and 13
    var randomNumber = Math.floor(Math.random() * (13 - 3 + 1)) + 3;
    for (var i = 0; i < randomNumber; i++) {
        var randomX = Math.floor(Math.random() * (800 - 0 + 1)) + 0;
        var randomY = Math.floor(Math.random() * (600 - 0 + 1)) + 0;
        var randomSize = Math.floor(Math.random() * (50 - 0 + 1)) + 20;
        var randomColor = getRandomColor();
        var randomBody = Bodies.circle(randomX, randomY, randomSize, { render: { fillStyle: randomColor } });
        Composite.add(world, randomBody);
    }

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
        compoundBodyB, 
        constraint,
        floorAndWalls
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

    Events.on(engine, 'collisionStart', function(event) {
      var pairs = event.pairs;

      // change object colours to show those starting a collision
      for (var i = 0; i < pairs.length; i++) {
          var pair = pairs[i];
          pair.bodyA.render.fillStyle = getRandomColor();
          pair.bodyB.render.fillStyle = getRandomColor();
      }
    });

    Events.on(engine, 'collisionEnd', function(event) {
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
        stop: function() {
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